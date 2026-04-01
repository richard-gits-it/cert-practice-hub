"use client";

import { useState, useCallback } from "react";
import {
  generateSubnetProblem,
  toBinary,
  type Difficulty,
  type SubnetProblem,
} from "@/lib/subnet";
import { getCertProgress, saveCertProgress } from "@/lib/progress";
import { BackButton, ModeButton, StatBox } from "@/components/ui/shared";

const DIFFICULTIES: { id: Difficulty; label: string; desc: string; color: string }[] = [
  { id: "easy", label: "EASY", desc: "/8, /16, /24 only", color: "#00ff9d" },
  { id: "medium", label: "MEDIUM", desc: "Random CIDR /17-/30", color: "#00d4ff" },
  { id: "hard", label: "HARD", desc: "Class C focus, tricky masks", color: "#ff3e8e" },
];

function BreakdownPanel({ problem }: { problem: SubnetProblem }) {
  const rows = [
    ["IP Address", `${problem.ip}/${problem.cidr}`],
    ["Subnet Mask", problem.mask],
    ["Wildcard", problem.wildcardMask],
    ["Network", problem.networkAddr],
    ["Broadcast", problem.broadcastAddr],
    ["First Host", problem.firstUsable],
    ["Last Host", problem.lastUsable],
    ["Usable Hosts", problem.usableHosts.toLocaleString()],
  ];

  const binaryRows = [
    { label: "IP", value: problem.ip, color: "#00ff9d" },
    { label: "Mask", value: problem.mask, color: "#ff3e8e" },
    { label: "Net", value: problem.networkAddr, color: "#00d4ff" },
  ];

  return (
    <div
      className="rounded-lg p-5 mt-4"
      style={{
        background: "rgba(0,212,255,0.03)",
        border: "1px solid rgba(0,212,255,0.09)",
      }}
    >
      <div className="text-[10px] tracking-[3px] text-accent-cyan uppercase mb-3.5 font-semibold">
        ▸ Full Breakdown
      </div>
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex justify-between px-2.5 py-1.5 rounded text-xs"
            style={{ background: "rgba(0,0,0,0.3)" }}
          >
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-300 font-mono font-medium">{value}</span>
          </div>
        ))}
      </div>

      <div className="text-[10px] tracking-[3px] text-accent-cyan uppercase mb-2.5 font-semibold">
        ▸ Binary
      </div>
      <div
        className="font-mono text-[11px] leading-[1.8] rounded-md p-2.5 overflow-x-auto"
        style={{ background: "rgba(0,0,0,0.4)" }}
      >
        {binaryRows.map((row) => (
          <div key={row.label} className="flex gap-2">
            <span className="text-gray-700 min-w-[40px]">{row.label}:</span>
            <span style={{ color: row.color }}>{toBinary(row.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SubnetDrill({ onBack }: { onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [problem, setProblem] = useState<SubnetProblem | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [progress, setProgress] = useState(() => getCertProgress("subnet"));
  const [shake, setShake] = useState(false);

  const start = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setProblem(generateSubnetProblem(d));
    setAnswers({});
    setSubmitted(false);
    setShowBreakdown(false);
  }, []);

  const next = useCallback(() => {
    if (!difficulty) return;
    setProblem(generateSubnetProblem(difficulty));
    setAnswers({});
    setSubmitted(false);
    setShowBreakdown(false);
  }, [difficulty]);

  const handleSubmit = useCallback(() => {
    if (submitted || !problem) return;
    setSubmitted(true);

    const correctCount = problem.questions.filter(
      (q) => (answers[q.id] || "").trim() === q.answer
    ).length;
    const allCorrect = correctCount === problem.questions.length;

    const p = { ...progress };
    p.total += problem.questions.length;
    p.correct += correctCount;
    p.streak = allCorrect ? p.streak + 1 : 0;
    p.bestStreak = Math.max(p.bestStreak || 0, p.streak);
    setProgress(p);
    saveCertProgress("subnet", p);

    if (!allCorrect) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  }, [submitted, problem, answers, progress]);

  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") {
        submitted ? next() : handleSubmit();
      }
    },
    [submitted, next, handleSubmit]
  );

  const acc =
    progress.total > 0
      ? Math.round((progress.correct / progress.total) * 100)
      : 0;

  const diffConfig = difficulty
    ? DIFFICULTIES.find((d) => d.id === difficulty)
    : null;
  const diffColor = diffConfig?.color || "#00d4ff";

  // ── Difficulty Select ─────────────────────────────────────────────────
  if (!difficulty) {
    return (
      <div>
        <BackButton onClick={onBack} />
        <div className="text-center mt-10 mb-8">
          <h2 className="text-[clamp(24px,6vw,40px)] font-extrabold text-white font-mono">
            <span className="text-accent-green">SUBNET</span> DRILL
          </h2>
          <p className="text-gray-600 text-[13px] mt-2">
            Infinite problems. Instant feedback. Full binary breakdowns.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 max-w-[400px] mx-auto mb-8">
          {DIFFICULTIES.map((d) => (
            <ModeButton
              key={d.id}
              icon="⌨"
              label={d.label}
              desc={d.desc}
              color={d.color}
              onClick={() => start(d.id)}
            />
          ))}
        </div>
        {progress.total > 0 && (
          <div className="flex gap-2.5 justify-center flex-wrap">
            <StatBox label="Accuracy" value={`${acc}%`} color="#00ff9d" small />
            <StatBox label="Answered" value={progress.total} color="#00d4ff" small />
            <StatBox label="Streak" value={progress.streak} color="#ffd700" small />
          </div>
        )}
      </div>
    );
  }

  if (!problem) return null;

  // ── Active Drill ──────────────────────────────────────────────────────
  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <BackButton onClick={() => setDifficulty(null)} label="← DIFFICULTY" />
        <div className="flex gap-2">
          <StatBox
            label="Streak"
            value={progress.streak}
            color={progress.streak >= 3 ? "#ffd700" : "#00ff9d"}
            small
          />
        </div>
      </div>

      {/* Problem Card */}
      <div
        className={`rounded-xl ${shake ? "animate-shake" : ""}`}
        style={{
          background:
            "linear-gradient(145deg, rgba(15,15,25,0.95), rgba(10,10,18,0.98))",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(20px, 4vw, 32px)",
        }}
      >
        {/* IP Display */}
        <div className="text-center mb-7">
          <div
            className="text-[10px] tracking-[4px] uppercase mb-1.5"
            style={{ color: diffColor }}
          >
            {difficulty.toUpperCase()} MODE
          </div>
          <div
            className="font-mono font-extrabold text-white"
            style={{ fontSize: "clamp(28px, 6vw, 42px)" }}
          >
            {problem.ip}
            <span style={{ color: diffColor }}>/{problem.cidr}</span>
          </div>
        </div>

        {/* Question Inputs */}
        <div className="flex flex-col gap-3.5">
          {problem.questions.map((q, i) => {
            const userAns = (answers[q.id] || "").trim();
            const isCorrect = submitted && userAns === q.answer;
            const isWrong = submitted && userAns !== q.answer;

            return (
              <div key={q.id}>
                <label
                  className="block text-xs mb-1 tracking-wide"
                  style={{
                    color: submitted
                      ? isCorrect
                        ? "#00ff9d"
                        : "#ff3e8e"
                      : "#777",
                  }}
                >
                  {q.question}
                </label>
                <input
                  type="text"
                  placeholder={submitted ? q.answer : q.hint}
                  value={answers[q.id] || ""}
                  onChange={(e) =>
                    !submitted &&
                    setAnswers((a) => ({ ...a, [q.id]: e.target.value }))
                  }
                  onKeyDown={handleKey}
                  disabled={submitted}
                  autoFocus={i === 0}
                  className="w-full px-3.5 py-2.5 rounded-md font-mono text-sm text-white transition-all"
                  style={{
                    background: submitted
                      ? isCorrect
                        ? "rgba(0,255,157,0.04)"
                        : "rgba(255,62,142,0.04)"
                      : "rgba(0,0,0,0.4)",
                    border: `1px solid ${
                      submitted
                        ? isCorrect
                          ? "#00ff9d33"
                          : "#ff3e8e33"
                        : "rgba(255,255,255,0.08)"
                    }`,
                  }}
                />
                {isWrong && (
                  <div className="text-[11px] text-accent-pink mt-0.5 font-mono">
                    → {q.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2.5 mt-5 flex-wrap">
          {!submitted ? (
            <button
              onClick={handleSubmit}
              className="border-none rounded-md px-7 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer"
              style={{ background: diffColor }}
            >
              CHECK ↵
            </button>
          ) : (
            <>
              <button
                onClick={next}
                className="border-none rounded-md px-7 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer"
                style={{ background: diffColor }}
              >
                NEXT ↵
              </button>
              <button
                onClick={() => setShowBreakdown((b) => !b)}
                className="bg-transparent border border-white/10 rounded-md px-5 py-2.5 text-gray-500 font-mono text-xs tracking-[1px] cursor-pointer hover:border-white/20"
              >
                {showBreakdown ? "HIDE" : "SHOW"} BREAKDOWN
              </button>
            </>
          )}
        </div>

        {/* Result Flash */}
        {submitted && (
          <div
            className="text-center mt-3.5 text-[13px] font-semibold"
            style={{
              color: problem.questions.every(
                (q) => (answers[q.id] || "").trim() === q.answer
              )
                ? "#00ff9d"
                : "#ff3e8e",
            }}
          >
            {problem.questions.every(
              (q) => (answers[q.id] || "").trim() === q.answer
            )
              ? "✓ PERFECT"
              : `${
                  problem.questions.filter(
                    (q) => (answers[q.id] || "").trim() === q.answer
                  ).length
                }/${problem.questions.length} CORRECT`}
          </div>
        )}
      </div>

      {/* Breakdown Panel */}
      {submitted && showBreakdown && <BreakdownPanel problem={problem} />}
    </div>
  );
}
