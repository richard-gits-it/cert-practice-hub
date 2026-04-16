"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Cert } from "@/data/certs";
import { getQuestions } from "@/data/questions";
import { Question } from "@/data/types";
import { BackLink, StatBox } from "@/components/ui/shared";
import { generateMCVariant, type MCVariant } from "@/lib/distractors";
import {
  recordAnswer,
  buildSet,
  getLearnStats,
  saveSessionState,
  loadSessionState,
  resetLearnForCert,
  MASTERY_THRESHOLDS,
  type SessionState,
  type MasteryGoal,
  type LearnStats,
} from "@/lib/learn";

// ═════════════════════════════════════════════════════════════════════════════
// MODE SELECT SCREEN
// ═════════════════════════════════════════════════════════════════════════════

function ModeSelect({
  cert,
  stats,
  existingSession,
  onStart,
  onReset,
}: {
  cert: Cert;
  stats: LearnStats;
  existingSession: SessionState | null;
  onStart: (mode: "quick" | "continue", goal: MasteryGoal, domain: string) => void;
  onReset: () => void;
}) {
  const [goal, setGoal] = useState<MasteryGoal>("solid");
  const [domain, setDomain] = useState("all");
  const [confirmReset, setConfirmReset] = useState(false);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    onReset();
    setConfirmReset(false);
  };

  return (
    <div>
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-[10px] font-mono mb-2">
          <span className="text-accent-green">
            {stats.mastered} mastered
          </span>
          <span style={{ color: cert.color }}>
            {stats.stillLearning} still learning
          </span>
          <span className="text-gray-700">
            {stats.notStudied} not studied
          </span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden flex">
          {stats.mastered > 0 && (
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(stats.mastered / stats.total) * 100}%`,
                background: "#00ff9d",
              }}
            />
          )}
          {stats.stillLearning > 0 && (
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(stats.stillLearning / stats.total) * 100}%`,
                background: cert.color,
              }}
            />
          )}
        </div>
        <div className="text-center mt-2 text-[11px] text-gray-600 font-mono">
          {stats.percentMastered}% of {stats.total} questions mastered
        </div>
      </div>

      {/* Resume banner if session exists */}
      {existingSession && (
        <div
          className="rounded-lg p-4 mb-6 flex justify-between items-center"
          style={{
            background: `${cert.color}0a`,
            border: `1px solid ${cert.color}33`,
          }}
        >
          <div>
            <div className="text-[11px] font-mono font-bold" style={{ color: cert.color }}>
              SESSION IN PROGRESS
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              Set {existingSession.setNumber} &bull;{" "}
              {existingSession.stats.correct}/{existingSession.stats.answered} correct
            </div>
          </div>
          <button
            onClick={() => onStart("continue", existingSession.goal, existingSession.domain || "all")}
            className="rounded-md px-4 py-2 font-mono text-[11px] font-bold tracking-[1px] cursor-pointer border-none"
            style={{ background: cert.color, color: "#08080d" }}
          >
            RESUME →
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="text-center mb-8">
        <h2 className="text-[clamp(24px,5vw,32px)] font-extrabold text-white font-mono mb-2">
          <span style={{ color: cert.color }}>LEARN</span> MODE
        </h2>
        <p className="text-gray-600 text-sm max-w-[380px] mx-auto">
          Answer multiple choice. Missed cards come back. Master each card through repetition.
        </p>
      </div>

      {/* Goal Selector */}
      <div className="mb-6">
        <div className="text-[10px] tracking-[3px] text-gray-600 uppercase mb-2">
          Mastery Goal
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setGoal("solid")}
            className="rounded-lg p-3 text-left transition-all"
            style={{
              background: goal === "solid" ? `${cert.color}15` : "rgba(0,0,0,0.3)",
              border: `1px solid ${goal === "solid" ? cert.color + "55" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div
              className="font-mono text-xs font-bold"
              style={{ color: goal === "solid" ? cert.color : "#888" }}
            >
              SOLID UNDERSTANDING
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">2 correct in a row</div>
          </button>
          <button
            onClick={() => setGoal("complete")}
            className="rounded-lg p-3 text-left transition-all"
            style={{
              background: goal === "complete" ? `${cert.color}15` : "rgba(0,0,0,0.3)",
              border: `1px solid ${goal === "complete" ? cert.color + "55" : "rgba(255,255,255,0.06)"}`,
            }}
          >
            <div
              className="font-mono text-xs font-bold"
              style={{ color: goal === "complete" ? cert.color : "#888" }}
            >
              COMPLETE MASTERY
            </div>
            <div className="text-[10px] text-gray-600 mt-0.5">3 correct in a row</div>
          </button>
        </div>
      </div>

      {/* Domain Filter */}
      <div className="mb-6">
        <div className="text-[10px] tracking-[3px] text-gray-600 uppercase mb-2">
          Filter by Domain
        </div>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setDomain("all")}
            className="rounded-full px-3 py-1 text-[11px] font-mono transition-all"
            style={{
              background: domain === "all" ? `${cert.color}18` : "transparent",
              border: `1px solid ${domain === "all" ? cert.color + "44" : "rgba(255,255,255,0.06)"}`,
              color: domain === "all" ? cert.color : "#555",
            }}
          >
            All
          </button>
          {cert.domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomain(d)}
              className="rounded-full px-3 py-1 text-[11px] font-mono transition-all whitespace-nowrap"
              style={{
                background: domain === d ? `${cert.color}18` : "transparent",
                border: `1px solid ${domain === d ? cert.color + "44" : "rgba(255,255,255,0.06)"}`,
                color: domain === d ? cert.color : "#555",
              }}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Start Buttons */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onStart("continue", goal, domain)}
          className="rounded-lg p-4 font-mono font-bold text-sm tracking-[1px] text-center transition-all duration-200 cursor-pointer border-none"
          style={{ background: cert.color, color: "#08080d" }}
        >
          CONTINUE STUDYING →
          <div className="text-[10px] font-normal mt-1 opacity-70">
            Progress persists across sessions
          </div>
        </button>
        <button
          onClick={() => onStart("quick", goal, domain)}
          className="rounded-lg p-4 font-mono font-bold text-sm tracking-[1px] text-center transition-all duration-200 cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#888",
          }}
        >
          QUICK SESSION
          <div className="text-[10px] font-normal mt-1 opacity-70 text-gray-600">
            One-off 10-card set, no carryover
          </div>
        </button>
      </div>

      {/* Reset */}
      {stats.stillLearning + stats.mastered > 0 && (
        <div className="text-center mt-6">
          <button
            onClick={handleReset}
            className="text-[10px] font-mono tracking-[1.5px] transition-colors"
            style={{ color: confirmReset ? "#ff3e8e" : "#444" }}
          >
            {confirmReset ? "TAP AGAIN TO CONFIRM RESET" : "RESET LEARN PROGRESS"}
          </button>
        </div>
      )}
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// ACTIVE QUESTION SCREEN
// ═════════════════════════════════════════════════════════════════════════════

function ActiveQuestion({
  mc,
  cert,
  onAnswer,
  onNext,
  answered,
  selected,
}: {
  mc: MCVariant;
  cert: Cert;
  onAnswer: (choice: string) => void;
  onNext: () => void;
  answered: boolean;
  selected: string | null;
}) {
  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      if (!answered) {
        // 1-4 selects an answer
        const num = parseInt(e.key);
        if (num >= 1 && num <= mc.choices.length) {
          onAnswer(mc.choices[num - 1].text);
        }
      } else {
        // Enter/space moves on
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onNext();
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [answered, mc.choices, onAnswer, onNext]);

  const isCorrect = answered && selected === mc.correctAnswer;

  return (
    <>
      {/* Question card */}
      <div
        className="rounded-xl mb-4"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(20px, 4vw, 32px)",
        }}
      >
        <div className="text-[10px] tracking-[2px] text-gray-700 uppercase mb-3">
          {mc.domain}
        </div>
        <div
          className="text-gray-200 leading-relaxed"
          style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
        >
          {mc.prompt}
        </div>
      </div>

      {/* Choices */}
      <div className="flex flex-col gap-2">
        {mc.choices.map((choice, idx) => {
          let bg = "rgba(0,0,0,0.3)";
          let border = "rgba(255,255,255,0.06)";
          let color = "#aaa";

          if (answered) {
            if (choice.isCorrect) {
              bg = "rgba(0,255,157,0.1)";
              border = "#00ff9d55";
              color = "#00ff9d";
            } else if (choice.text === selected) {
              bg = "rgba(255,62,142,0.1)";
              border = "#ff3e8e55";
              color = "#ff3e8e";
            } else {
              color = "#555";
            }
          } else if (choice.text === selected) {
            bg = `${cert.color}15`;
            border = cert.color + "55";
            color = cert.color;
          }

          return (
            <button
              key={idx}
              onClick={() => !answered && onAnswer(choice.text)}
              disabled={answered && !choice.isCorrect && choice.text !== selected}
              className="text-left rounded-lg px-4 py-3 text-sm font-mono transition-all relative"
              style={{
                background: bg,
                border: `1px solid ${border}`,
                color,
                cursor: answered ? "default" : "pointer",
              }}
            >
              <span className="text-[10px] font-bold opacity-50 mr-3">
                {idx + 1}
              </span>
              {choice.text}
              {answered && choice.isCorrect && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-green">
                  ✓
                </span>
              )}
              {answered && !choice.isCorrect && choice.text === selected && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-accent-pink">
                  ✗
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {answered && (
        <div className="mt-5">
          <div
            className="rounded-lg p-4"
            style={{
              background: isCorrect ? "rgba(0,255,157,0.05)" : "rgba(255,62,142,0.05)",
              border: `1px solid ${isCorrect ? "#00ff9d22" : "#ff3e8e22"}`,
            }}
          >
            <div
              className="font-mono font-bold text-xs tracking-[1.5px] mb-1.5"
              style={{ color: isCorrect ? "#00ff9d" : "#ff3e8e" }}
            >
              {isCorrect ? "✓ CORRECT" : "✗ INCORRECT"}
            </div>
            {!isCorrect && (
              <div className="text-xs text-gray-400 mb-2">
                Answer:{" "}
                <span className="text-accent-green font-mono">{mc.correctAnswer}</span>
              </div>
            )}
            {mc.explanation && (
              <div className="text-[12px] text-gray-500 leading-relaxed">
                {mc.explanation}
              </div>
            )}
          </div>

          <div className="flex justify-center mt-4">
            <button
              onClick={onNext}
              className="rounded-md px-8 py-2.5 font-mono text-[13px] font-bold tracking-[1px] cursor-pointer border-none"
              style={{ background: cert.color, color: "#08080d" }}
            >
              CONTINUE ↵
            </button>
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div className="text-center mt-4 text-[10px] text-gray-800 font-mono">
        {!answered ? "1-4 to answer" : "ENTER to continue"}
      </div>
    </>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// SET COMPLETE SCREEN
// ═════════════════════════════════════════════════════════════════════════════

function SetComplete({
  cert,
  stats,
  setCorrect,
  setTotal,
  setNumber,
  hasMore,
  onContinue,
  onExit,
}: {
  cert: Cert;
  stats: LearnStats;
  setCorrect: number;
  setTotal: number;
  setNumber: number;
  hasMore: boolean;
  onContinue: () => void;
  onExit: () => void;
}) {
  const pct = setTotal > 0 ? Math.round((setCorrect / setTotal) * 100) : 0;

  return (
    <div>
      <div className="text-center mt-6 mb-6">
        <div className="text-5xl mb-3">{pct >= 80 ? "🎯" : pct >= 60 ? "✓" : "📚"}</div>
        <h2 className="text-white font-mono text-xl font-bold mb-1">
          Set {setNumber} Complete
        </h2>
        <p className="text-gray-600 text-sm">
          {setCorrect} of {setTotal} correct ({pct}%)
        </p>
      </div>

      {/* Progress update */}
      <div className="mb-6">
        <div className="text-[10px] tracking-[3px] text-gray-700 uppercase text-center mb-3">
          Your Progress
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden flex mb-2">
          {stats.mastered > 0 && (
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(stats.mastered / stats.total) * 100}%`,
                background: "#00ff9d",
              }}
            />
          )}
          {stats.stillLearning > 0 && (
            <div
              className="h-full transition-all duration-500"
              style={{
                width: `${(stats.stillLearning / stats.total) * 100}%`,
                background: cert.color,
              }}
            />
          )}
        </div>
        <div className="flex justify-between text-[10px] font-mono">
          <span className="text-accent-green">{stats.mastered} mastered</span>
          <span style={{ color: cert.color }}>{stats.stillLearning} learning</span>
          <span className="text-gray-700">{stats.notStudied} new</span>
        </div>
      </div>

      {stats.percentMastered === 100 && (
        <div
          className="rounded-lg p-4 mb-4 text-center"
          style={{
            background: "rgba(0,255,157,0.05)",
            border: "1px solid #00ff9d33",
          }}
        >
          <div className="text-accent-green font-mono font-bold text-sm tracking-[2px] mb-1">
            🏆 FULL MASTERY
          </div>
          <div className="text-xs text-gray-500">
            You&apos;ve mastered every question in this pool.
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        {hasMore && (
          <button
            onClick={onContinue}
            className="rounded-lg p-3.5 font-mono font-bold text-sm tracking-[1px] cursor-pointer border-none"
            style={{ background: cert.color, color: "#08080d" }}
          >
            NEXT SET →
          </button>
        )}
        <button
          onClick={onExit}
          className="rounded-lg p-3.5 font-mono font-bold text-xs tracking-[1px] cursor-pointer"
          style={{
            background: "rgba(0,0,0,0.3)",
            border: "1px solid rgba(255,255,255,0.1)",
            color: "#888",
          }}
        >
          {hasMore ? "TAKE A BREAK" : "BACK TO MENU"}
        </button>
      </div>
    </div>
  );
}

// ═════════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═════════════════════════════════════════════════════════════════════════════

type Phase = "select" | "active" | "set_complete";

export default function FlashcardMode({
  cert,
  backHref,
}: {
  cert: Cert;
  backHref: string;
}) {
  const [phase, setPhase] = useState<Phase>("select");
  const [session, setSession] = useState<SessionState | null>(null);
  const [allStats, setAllStats] = useState<LearnStats>({
    notStudied: 0, stillLearning: 0, mastered: 0, total: 0, percentMastered: 0,
  });
  const [existingSession, setExistingSession] = useState<SessionState | null>(null);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [setCorrect, setSetCorrect] = useState(0);

  // Pool of all questions for this cert (filtered by domain if set)
  const [pool, setPool] = useState<Question[]>([]);
  const questionsById = useMemo(() => {
    const map: Record<string, Question> = {};
    pool.forEach((q) => { map[q.id] = q; });
    return map;
  }, [pool]);

  // All questions in cert (for distractor pool — broader than current domain)
  const [allCertQuestions, setAllCertQuestions] = useState<Question[]>([]);

  // Load initial state on mount
  useEffect(() => {
    const loaded = loadSessionState();
    if (loaded && loaded.cert === cert.id) {
      setExistingSession(loaded);
    }
    const all = getQuestions(cert.id);
    setAllCertQuestions(all);
    setAllStats(getLearnStats(cert.id, all.map((q) => q.id)));
  }, [cert.id]);

  // Current MC variant for the question we're showing
  const currentQuestionId = session?.currentSet[session.position];
  const currentQuestion = currentQuestionId ? questionsById[currentQuestionId] : null;
  const currentMC = useMemo(
    () => currentQuestion ? generateMCVariant(currentQuestion, allCertQuestions) : null,
    [currentQuestion, allCertQuestions]
  );

  // ── Start a new or resumed session ────────────────────────────────────
  const startSession = useCallback(
    (mode: "quick" | "continue", goal: MasteryGoal, domain: string) => {
      const allQs = getQuestions(cert.id);
      const filtered = domain === "all" ? allQs : allQs.filter((q) => q.domain === domain);
      const poolIds = filtered.map((q) => q.id);

      if (poolIds.length === 0) return;

      // If resuming an existing session, keep its state
      if (mode === "continue" && existingSession && existingSession.cert === cert.id) {
        setSession(existingSession);
        setPool(filtered);
        setPhase("active");
        setAnswered(false);
        setSelected(null);
        return;
      }

      // Otherwise build a fresh session
      const firstSet = buildSet(poolIds, [], 10);
      const newSession: SessionState = {
        cert: cert.id,
        mode,
        goal,
        poolIds,
        currentSet: firstSet,
        immediateRequeue: [],
        nextSetCarryover: [],
        position: 0,
        setNumber: 1,
        stats: { answered: 0, correct: 0 },
        domain: domain === "all" ? undefined : domain,
      };
      setSession(newSession);
      setPool(filtered);
      if (mode === "continue") saveSessionState(newSession);
      setPhase("active");
      setAnswered(false);
      setSelected(null);
      setSetCorrect(0);
    },
    [cert.id, existingSession]
  );

  // ── Handle an answer ──────────────────────────────────────────────────
  const handleAnswer = useCallback(
    (choiceText: string) => {
      if (!session || !currentMC || answered) return;
      const correct = choiceText === currentMC.correctAnswer;
      setSelected(choiceText);
      setAnswered(true);

      // Persist card state
      recordAnswer(currentMC.questionId, cert.id, correct, session.goal);

      // Update session stats
      const updated: SessionState = {
        ...session,
        stats: {
          answered: session.stats.answered + 1,
          correct: session.stats.correct + (correct ? 1 : 0),
        },
      };

      if (!correct) {
        // Re-queue at end of current set (immediate) and flag for next set
        updated.immediateRequeue = [...session.immediateRequeue, currentMC.questionId];
        // If it's ALREADY been requeued once this set, escalate to next-set carryover
        if (session.immediateRequeue.includes(currentMC.questionId)) {
          updated.nextSetCarryover = [...session.nextSetCarryover, currentMC.questionId];
          // De-dupe
          updated.nextSetCarryover = Array.from(new Set(updated.nextSetCarryover));
        }
      } else {
        setSetCorrect((n) => n + 1);
      }

      setSession(updated);
      if (session.mode === "continue") saveSessionState(updated);

      // Refresh stats
      setAllStats(getLearnStats(cert.id, session.poolIds));
    },
    [session, currentMC, answered, cert.id]
  );

  // ── Move to next question or complete set ─────────────────────────────
  const handleNext = useCallback(() => {
    if (!session) return;

    // If there are more questions in the current sequence, advance
    if (session.position < session.currentSet.length - 1) {
      const updated = { ...session, position: session.position + 1 };
      setSession(updated);
      if (session.mode === "continue") saveSessionState(updated);
      setAnswered(false);
      setSelected(null);
      return;
    }

    // End of the main set — tack on immediate requeues if any
    if (session.immediateRequeue.length > 0) {
      const updated: SessionState = {
        ...session,
        currentSet: [...session.currentSet, ...session.immediateRequeue],
        immediateRequeue: [],
        position: session.position + 1,
      };
      setSession(updated);
      if (session.mode === "continue") saveSessionState(updated);
      setAnswered(false);
      setSelected(null);
      return;
    }

    // Set fully complete
    setPhase("set_complete");
    setAllStats(getLearnStats(cert.id, session.poolIds));
  }, [session, cert.id]);

  // ── Start next set ────────────────────────────────────────────────────
  const handleNextSet = useCallback(() => {
    if (!session) return;
    const nextSet = buildSet(session.poolIds, session.nextSetCarryover, 10);

    if (nextSet.length === 0) {
      // Nothing left — exit to menu
      handleExit();
      return;
    }

    const updated: SessionState = {
      ...session,
      currentSet: nextSet,
      immediateRequeue: [],
      nextSetCarryover: [],
      position: 0,
      setNumber: session.setNumber + 1,
      stats: { answered: 0, correct: 0 },
    };
    setSession(updated);
    if (session.mode === "continue") saveSessionState(updated);
    setPhase("active");
    setAnswered(false);
    setSelected(null);
    setSetCorrect(0);
  }, [session]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Exit to menu ──────────────────────────────────────────────────────
  const handleExit = useCallback(() => {
    if (session?.mode === "quick") {
      saveSessionState(null); // quick sessions don't persist
    }
    setPhase("select");
    setSession(null);
    setAnswered(false);
    setSelected(null);
    setSetCorrect(0);
    // Refresh
    const loaded = loadSessionState();
    setExistingSession(loaded && loaded.cert === cert.id ? loaded : null);
    const all = getQuestions(cert.id);
    setAllStats(getLearnStats(cert.id, all.map((q) => q.id)));
  }, [session, cert.id]);

  // ── Reset all progress ────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    resetLearnForCert(cert.id);
    saveSessionState(null);
    setExistingSession(null);
    const all = getQuestions(cert.id);
    setAllStats(getLearnStats(cert.id, all.map((q) => q.id)));
  }, [cert.id]);

  // ═══════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════

  if (phase === "select") {
    return (
      <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <BackLink href={backHref} />
        </div>
        <ModeSelect
          cert={cert}
          stats={allStats}
          existingSession={existingSession}
          onStart={startSession}
          onReset={handleReset}
        />
      </div>
    );
  }

  if (!session || !currentMC) return null;

  if (phase === "set_complete") {
    const hasMore = buildSet(session.poolIds, session.nextSetCarryover, 10).length > 0 &&
      allStats.percentMastered < 100;
    return (
      <div>
        <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
          <BackLink href={backHref} />
          <div className="text-[11px] text-gray-700 font-mono">
            {session.mode === "quick" ? "QUICK SESSION" : "CONTINUE STUDYING"}
          </div>
        </div>
        <SetComplete
          cert={cert}
          stats={allStats}
          setCorrect={setCorrect}
          setTotal={session.stats.answered}
          setNumber={session.setNumber}
          hasMore={hasMore}
          onContinue={handleNextSet}
          onExit={handleExit}
        />
      </div>
    );
  }

  // ── Active Phase ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <BackLink href={backHref} label="← EXIT" />
        <div className="flex gap-2">
          <StatBox label="Set" value={session.setNumber} color={cert.color} small />
          <StatBox
            label="Score"
            value={`${session.stats.correct}/${session.stats.answered}`}
            color="#00ff9d"
            small
          />
        </div>
      </div>

      {/* Set progress */}
      <div className="mb-4">
        <div className="flex justify-between text-[10px] font-mono mb-1.5 text-gray-700">
          <span>SET {session.setNumber}</span>
          <span>
            {session.position + 1} / {session.currentSet.length}
          </span>
        </div>
        <div className="h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full transition-all duration-300"
            style={{
              width: `${((session.position + (answered ? 1 : 0)) / session.currentSet.length) * 100}%`,
              background: cert.color,
            }}
          />
        </div>
      </div>

      <ActiveQuestion
        mc={currentMC}
        cert={cert}
        onAnswer={handleAnswer}
        onNext={handleNext}
        answered={answered}
        selected={selected}
      />
    </div>
  );
}
