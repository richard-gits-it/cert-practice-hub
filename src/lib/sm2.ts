/**
 * SM-2 Spaced Repetition Engine
 *
 * Implementation of the SuperMemo 2 algorithm.
 * Reference: https://www.supermemo.com/en/archives1990-2015/english/ol/sm2
 *
 * Quality ratings (0-5):
 *   0 — Total blackout
 *   1 — Wrong, but recognized correct answer
 *   2 — Wrong, but correct answer seemed easy to recall
 *   3 — Correct, with serious difficulty
 *   4 — Correct, after hesitation
 *   5 — Perfect recall
 *
 * Cards rated < 3 are "failed" and reset to the beginning.
 * Cards rated >= 3 advance to the next interval.
 */

const SM2_STORAGE_KEY = "certhub-sm2";

// ── Types ────────────────────────────────────────────────────────────────────

export interface CardState {
  /** Question ID */
  questionId: string;
  /** Cert slug */
  cert: string;
  /** Easiness factor — starts at 2.5, minimum 1.3 */
  ef: number;
  /** Current interval in days */
  interval: number;
  /** Number of consecutive successful repetitions */
  repetitions: number;
  /** ISO date string — when this card is next due */
  nextReview: string;
  /** ISO date string — last time card was reviewed */
  lastReview: string;
  /** Last quality rating given */
  lastQuality: number;
}

export type Quality = 0 | 1 | 2 | 3 | 4 | 5;

export interface ReviewSession {
  /** Cards due now (past due or due today) */
  due: string[];
  /** New cards not yet seen */
  unseen: string[];
  /** Cards not due yet */
  upcoming: string[];
  /** Total cards in the deck */
  total: number;
}

// ── Core SM-2 Algorithm ──────────────────────────────────────────────────────

export function calculateSM2(
  prevState: CardState | null,
  quality: Quality
): Omit<CardState, "questionId" | "cert"> {
  const now = new Date().toISOString();

  // Default initial state
  let ef = prevState?.ef ?? 2.5;
  let interval = prevState?.interval ?? 0;
  let repetitions = prevState?.repetitions ?? 0;

  if (quality >= 3) {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * ef);
    }
    repetitions += 1;
  } else {
    // Failed — reset
    repetitions = 0;
    interval = 1;
  }

  // Update easiness factor
  ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);

  return {
    ef: Math.round(ef * 100) / 100,
    interval,
    repetitions,
    nextReview: nextDate.toISOString(),
    lastReview: now,
    lastQuality: quality,
  };
}

// ── Storage ──────────────────────────────────────────────────────────────────

function loadAllCardStates(): Record<string, CardState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(SM2_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveAllCardStates(states: Record<string, CardState>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(SM2_STORAGE_KEY, JSON.stringify(states));
  } catch {}
}

/** Get the SM-2 state for a specific card, or null if never reviewed */
export function getCardState(questionId: string): CardState | null {
  const all = loadAllCardStates();
  return all[questionId] || null;
}

/** Record a review for a card and return the updated state */
export function reviewCard(
  questionId: string,
  cert: string,
  quality: Quality
): CardState {
  const all = loadAllCardStates();
  const prevState = all[questionId] || null;
  const updated = calculateSM2(prevState, quality);

  const newState: CardState = {
    questionId,
    cert,
    ...updated,
  };

  all[questionId] = newState;
  saveAllCardStates(all);
  return newState;
}

/** Get a review session — what cards are due, new, or upcoming */
export function getReviewSession(
  cert: string,
  allQuestionIds: string[],
  domain?: string
): ReviewSession {
  const all = loadAllCardStates();
  const now = new Date();

  const due: string[] = [];
  const unseen: string[] = [];
  const upcoming: string[] = [];

  for (const id of allQuestionIds) {
    const state = all[id];
    if (!state) {
      unseen.push(id);
    } else {
      const nextReview = new Date(state.nextReview);
      if (nextReview <= now) {
        due.push(id);
      } else {
        upcoming.push(id);
      }
    }
  }

  // Sort due cards: most overdue first
  due.sort((a, b) => {
    const aDate = new Date(all[a].nextReview).getTime();
    const bDate = new Date(all[b].nextReview).getTime();
    return aDate - bDate;
  });

  return {
    due,
    unseen,
    upcoming,
    total: allQuestionIds.length,
  };
}

/** Build the review queue: due cards first, then new cards (limited), then nothing */
export function buildReviewQueue(
  cert: string,
  allQuestionIds: string[],
  newCardsPerSession: number = 10
): string[] {
  const session = getReviewSession(cert, allQuestionIds);
  const queue: string[] = [];

  // Due cards — all of them
  queue.push(...session.due);

  // New cards — up to limit
  queue.push(...session.unseen.slice(0, newCardsPerSession));

  return queue;
}

/** Get summary stats for a cert's SM-2 data */
export function getSM2Stats(cert: string, allQuestionIds: string[]): {
  mastered: number;
  learning: number;
  unseen: number;
  dueToday: number;
  averageEF: number;
} {
  const all = loadAllCardStates();
  const now = new Date();

  let mastered = 0;
  let learning = 0;
  let unseen = 0;
  let dueToday = 0;
  let totalEF = 0;
  let efCount = 0;

  for (const id of allQuestionIds) {
    const state = all[id];
    if (!state) {
      unseen++;
      continue;
    }

    totalEF += state.ef;
    efCount++;

    if (state.interval >= 21 && state.repetitions >= 4) {
      mastered++;
    } else {
      learning++;
    }

    if (new Date(state.nextReview) <= now) {
      dueToday++;
    }
  }

  return {
    mastered,
    learning,
    unseen,
    dueToday,
    averageEF: efCount > 0 ? Math.round((totalEF / efCount) * 100) / 100 : 2.5,
  };
}

/** Reset all SM-2 data for a specific cert */
export function resetSM2ForCert(cert: string) {
  const all = loadAllCardStates();
  const filtered: Record<string, CardState> = {};
  for (const [key, state] of Object.entries(all)) {
    if (state.cert !== cert) {
      filtered[key] = state;
    }
  }
  saveAllCardStates(filtered);
}
