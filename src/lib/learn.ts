/**
 * Learn Mode Engine
 *
 * Quizlet-inspired adaptive study flow using multiple choice to test knowledge.
 *
 * FLOW:
 *   1. Questions are split into sets of 10
 *   2. User answers each question in the set
 *   3. After all 10, any missed questions re-appear immediately
 *   4. If missed twice in a session, they're added to the NEXT set
 *   5. A card is "mastered" after N correct answers in a row (configurable)
 *   6. Mastered cards drop out of the active queue but can return for periodic review
 *
 * MASTERY LEVELS (Quizlet parity):
 *   - "not_studied"   — never seen in Learn Mode
 *   - "still_learning" — seen but not yet reached mastery threshold
 *   - "mastered"      — N correct in a row
 *
 * MODES:
 *   - "quick"    — one-off 10-card set, state still saved but session forgets misses on exit
 *   - "continue" — progressive, misses persist across sessions
 */

const LEARN_STATE_KEY = "certhub-learn";
const LEARN_SESSION_KEY = "certhub-learn-session";

// ── Types ────────────────────────────────────────────────────────────────────

export type MasteryLevel = "not_studied" | "still_learning" | "mastered";

export interface CardLearnState {
  /** Question ID */
  questionId: string;
  /** Cert slug */
  cert: string;
  /** Total correct count (lifetime) */
  totalCorrect: number;
  /** Total wrong count (lifetime) */
  totalWrong: number;
  /** Current streak of consecutive correct answers */
  currentStreak: number;
  /** Best streak ever achieved */
  bestStreak: number;
  /** Current mastery level */
  level: MasteryLevel;
  /** ISO date — last time reviewed */
  lastSeen: string;
  /** ISO date — when mastery was achieved (for periodic re-review) */
  masteredAt?: string;
}

export type MasteryGoal = "solid" | "complete";

export const MASTERY_THRESHOLDS: Record<MasteryGoal, number> = {
  solid: 2, // 2 correct in a row = mastered
  complete: 3, // 3 correct in a row = mastered
};

/** In-progress session state — persists across page reloads */
export interface SessionState {
  cert: string;
  mode: "quick" | "continue";
  goal: MasteryGoal;
  /** All question IDs this session will draw from */
  poolIds: string[];
  /** Current set of question IDs being worked through */
  currentSet: string[];
  /** Misses from the current set to re-ask at end of set */
  immediateRequeue: string[];
  /** Misses to carry into the next set */
  nextSetCarryover: string[];
  /** Current position in the set */
  position: number;
  /** Set number (1-indexed) for display */
  setNumber: number;
  /** Session stats */
  stats: {
    answered: number;
    correct: number;
  };
  /** Active domain filter if any */
  domain?: string;
}

// ── Storage ──────────────────────────────────────────────────────────────────

function loadAllCardStates(): Record<string, CardLearnState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(LEARN_STATE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllCardStates(states: Record<string, CardLearnState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LEARN_STATE_KEY, JSON.stringify(states));
  } catch {}
}

export function getCardState(questionId: string): CardLearnState | null {
  return loadAllCardStates()[questionId] || null;
}

export function saveSessionState(state: SessionState | null) {
  if (typeof window === "undefined") return;
  try {
    if (state === null) {
      localStorage.removeItem(LEARN_SESSION_KEY);
    } else {
      localStorage.setItem(LEARN_SESSION_KEY, JSON.stringify(state));
    }
  } catch {}
}

export function loadSessionState(): SessionState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LEARN_SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ── Recording Answers ────────────────────────────────────────────────────────

/**
 * Record an answer and return the updated card state.
 * Does NOT re-calculate session queue — that's a separate concern.
 */
export function recordAnswer(
  questionId: string,
  cert: string,
  correct: boolean,
  goal: MasteryGoal
): CardLearnState {
  const all = loadAllCardStates();
  const now = new Date().toISOString();
  const threshold = MASTERY_THRESHOLDS[goal];

  const prev = all[questionId];
  const base: CardLearnState = prev || {
    questionId,
    cert,
    totalCorrect: 0,
    totalWrong: 0,
    currentStreak: 0,
    bestStreak: 0,
    level: "not_studied",
    lastSeen: now,
  };

  const updated: CardLearnState = { ...base, lastSeen: now };

  if (correct) {
    updated.totalCorrect += 1;
    updated.currentStreak += 1;
    updated.bestStreak = Math.max(updated.bestStreak, updated.currentStreak);

    if (updated.currentStreak >= threshold) {
      if (updated.level !== "mastered") {
        updated.masteredAt = now;
      }
      updated.level = "mastered";
    } else {
      updated.level = "still_learning";
    }
  } else {
    updated.totalWrong += 1;
    updated.currentStreak = 0;
    // Drop out of mastered back to still_learning if they miss it
    updated.level = "still_learning";
    updated.masteredAt = undefined;
  }

  all[questionId] = updated;
  saveAllCardStates(all);
  return updated;
}

// ── Session Building ─────────────────────────────────────────────────────────

/**
 * Choose the next 10 questions to work through.
 *
 * Priority:
 *   1. Carryover misses from previous set (front-loaded)
 *   2. Still-learning cards (not yet mastered)
 *   3. Not-studied cards
 *   4. Mastered cards (only if everything else is exhausted)
 */
export function buildSet(
  poolIds: string[],
  carryover: string[],
  setSize = 10
): string[] {
  const all = loadAllCardStates();
  const set: string[] = [];
  const seen = new Set<string>();

  // 1. Carryover misses first
  for (const id of carryover) {
    if (set.length >= setSize) break;
    if (!poolIds.includes(id) || seen.has(id)) continue;
    set.push(id);
    seen.add(id);
  }

  // Categorize remaining pool
  const stillLearning: string[] = [];
  const notStudied: string[] = [];
  const mastered: string[] = [];
  for (const id of poolIds) {
    if (seen.has(id)) continue;
    const state = all[id];
    if (!state || state.level === "not_studied") notStudied.push(id);
    else if (state.level === "still_learning") stillLearning.push(id);
    else mastered.push(id);
  }

  // Shuffle each tier
  const shuffleInPlace = <T>(arr: T[]) => {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  };
  shuffleInPlace(stillLearning);
  shuffleInPlace(notStudied);
  shuffleInPlace(mastered);

  // 2. Still learning
  for (const id of stillLearning) {
    if (set.length >= setSize) break;
    set.push(id);
    seen.add(id);
  }

  // 3. Not studied
  for (const id of notStudied) {
    if (set.length >= setSize) break;
    set.push(id);
    seen.add(id);
  }

  // 4. Mastered (periodic refresher)
  for (const id of mastered) {
    if (set.length >= setSize) break;
    set.push(id);
    seen.add(id);
  }

  return set;
}

// ── Stats ────────────────────────────────────────────────────────────────────

export interface LearnStats {
  notStudied: number;
  stillLearning: number;
  mastered: number;
  total: number;
  percentMastered: number;
}

export function getLearnStats(
  cert: string,
  poolIds: string[]
): LearnStats {
  const all = loadAllCardStates();
  let notStudied = 0;
  let stillLearning = 0;
  let mastered = 0;

  for (const id of poolIds) {
    const state = all[id];
    if (!state || state.level === "not_studied") notStudied++;
    else if (state.level === "still_learning") stillLearning++;
    else mastered++;
  }

  const total = poolIds.length;
  return {
    notStudied,
    stillLearning,
    mastered,
    total,
    percentMastered: total > 0 ? Math.round((mastered / total) * 100) : 0,
  };
}

export function resetLearnForCert(cert: string) {
  const all = loadAllCardStates();
  const filtered: Record<string, CardLearnState> = {};
  for (const [key, state] of Object.entries(all)) {
    if (state.cert !== cert) filtered[key] = state;
  }
  saveAllCardStates(filtered);
}
