"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  generateSubnetProblem,
  generateRapidFireSet,
  generateVLSMProblem,
  toBinary,
  cidrToMask,
  type Difficulty,
  type DrillMode,
  type SubnetProblem,
  type RapidFireQuestion,
  type RapidFireDirection,
  type VLSMProblem,
} from "@/lib/subnet";
import { getCertProgress, saveCertProgress, type CertProgress } from "@/lib/progress";
import { BackLink, ModeButton, StatBox } from "@/components/ui/shared";

// ═══════════════════════════════════════════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

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
    <div className="rounded-lg p-5 mt-4" style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.09)" }}>
      <div className="text-[10px] tracking-[3px] text-accent-cyan uppercase mb-3.5 font-semibold">▸ Full Breakdown</div>
      <div className="grid grid-cols-2 gap-1.5 mb-5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between px-2.5 py-1.5 rounded text-xs" style={{ background: "rgba(0,0,0,0.3)" }}>
            <span className="text-gray-600">{label}</span>
            <span className="text-gray-300 font-mono font-medium">{value}</span>
          </div>
        ))}
      </div>
      <div className="text-[10px] tracking-[3px] text-accent-cyan uppercase mb-2.5 font-semibold">▸ Binary</div>
      <div className="font-mono text-[11px] leading-[1.8] rounded-md p-2.5 overflow-x-auto" style={{ background: "rgba(0,0,0,0.4)" }}>
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

// ═══════════════════════════════════════════════════════════════════════════
// CLASSIC / FULL DRILL
// ═══════════════════════════════════════════════════════════════════════════

function ClassicFullDrill({
  mode,
  onBack,
}: {
  mode: "classic" | "full";
  onBack: () => void;
}) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [problem, setProblem] = useState<SubnetProblem | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [progress, setProgress] = useState<CertProgress>({ total: 0, correct: 0, streak: 0, bestStreak: 0, byDomain: {} });
  const [shake, setShake] = useState(false);

  useEffect(() => { setProgress(getCertProgress("subnet")); }, []);

  const start = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setProblem(generateSubnetProblem(d, mode));
    setAnswers({});
    setSubmitted(false);
    setShowBreakdown(false);
  }, [mode]);

  const next = useCallback(() => {
    if (!difficulty) return;
    setProblem(generateSubnetProblem(difficulty, mode));
    setAnswers({});
    setSubmitted(false);
    setShowBreakdown(false);
  }, [difficulty, mode]);

  const handleSubmit = useCallback(() => {
    if (submitted || !problem) return;
    setSubmitted(true);
    const correctCount = problem.questions.filter((q) => (answers[q.id] || "").trim() === q.answer).length;
    const allCorrect = correctCount === problem.questions.length;
    const p = { ...progress };
    p.total += problem.questions.length;
    p.correct += correctCount;
    p.streak = allCorrect ? p.streak + 1 : 0;
    p.bestStreak = Math.max(p.bestStreak || 0, p.streak);
    setProgress(p);
    saveCertProgress("subnet", p);
    if (!allCorrect) { setShake(true); setTimeout(() => setShake(false), 500); }
  }, [submitted, problem, answers, progress]);

  const handleKey = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") { submitted ? next() : handleSubmit(); }
  }, [submitted, next, handleSubmit]);

  const acc = progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;
  const diffConfig = difficulty ? DIFFICULTIES.find((d) => d.id === difficulty) : null;
  const diffColor = diffConfig?.color || "#00d4ff";
  const modeLabel = mode === "full" ? "FULL DRILL" : "CLASSIC";

  if (!difficulty) {
    return (
      <div>
        <button onClick={onBack} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← MODES</button>
        <div className="text-center mt-8 mb-6">
          <h3 className="text-lg font-bold text-white font-mono mb-1">{modeLabel}</h3>
          <p className="text-gray-600 text-xs">
            {mode === "full" ? "All 7 fields: network, first, last, broadcast, mask, wildcard, host count" : "Random 3-4 questions per problem"}
          </p>
        </div>
        <div className="flex flex-col gap-2.5 max-w-[400px] mx-auto mb-8">
          {DIFFICULTIES.map((d) => (
            <ModeButton key={d.id} icon="⌨" label={d.label} desc={d.desc} color={d.color} onClick={() => start(d.id)} />
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

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <button onClick={() => setDifficulty(null)} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← DIFFICULTY</button>
        <div className="flex gap-2">
          <StatBox label="Streak" value={progress.streak} color={progress.streak >= 3 ? "#ffd700" : "#00ff9d"} small />
        </div>
      </div>

      <div className={`rounded-xl ${shake ? "animate-shake" : ""}`} style={{ background: "linear-gradient(145deg, rgba(15,15,25,0.95), rgba(10,10,18,0.98))", border: "1px solid rgba(255,255,255,0.06)", padding: "clamp(20px, 4vw, 32px)" }}>
        <div className="text-center mb-7">
          <div className="text-[10px] tracking-[4px] uppercase mb-1.5" style={{ color: diffColor }}>{difficulty.toUpperCase()} &bull; {modeLabel}</div>
          <div className="font-mono font-extrabold text-white" style={{ fontSize: "clamp(28px, 6vw, 42px)" }}>
            {problem.ip}<span style={{ color: diffColor }}>/{problem.cidr}</span>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {problem.questions.map((q, i) => {
            const userAns = (answers[q.id] || "").trim();
            const isCorrect = submitted && userAns === q.answer;
            const isWrong = submitted && userAns !== q.answer;
            return (
              <div key={q.id}>
                <label className="block text-xs mb-1 tracking-wide" style={{ color: submitted ? (isCorrect ? "#00ff9d" : "#ff3e8e") : "#777" }}>
                  {q.question}
                </label>
                <input
                  type="text"
                  placeholder={submitted ? q.answer : q.hint}
                  value={answers[q.id] || ""}
                  onChange={(e) => !submitted && setAnswers((a) => ({ ...a, [q.id]: e.target.value }))}
                  onKeyDown={handleKey}
                  disabled={submitted}
                  autoFocus={i === 0}
                  className="w-full px-3.5 py-2.5 rounded-md font-mono text-sm text-white transition-all"
                  style={{
                    background: submitted ? (isCorrect ? "rgba(0,255,157,0.04)" : "rgba(255,62,142,0.04)") : "rgba(0,0,0,0.4)",
                    border: `1px solid ${submitted ? (isCorrect ? "#00ff9d33" : "#ff3e8e33") : "rgba(255,255,255,0.08)"}`,
                  }}
                />
                {isWrong && <div className="text-[11px] text-accent-pink mt-0.5 font-mono">→ {q.answer}</div>}
              </div>
            );
          })}
        </div>

        <div className="flex gap-2.5 mt-5 flex-wrap">
          {!submitted ? (
            <button onClick={handleSubmit} className="border-none rounded-md px-7 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer" style={{ background: diffColor }}>CHECK ↵</button>
          ) : (
            <>
              <button onClick={next} className="border-none rounded-md px-7 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer" style={{ background: diffColor }}>NEXT ↵</button>
              <button onClick={() => setShowBreakdown((b) => !b)} className="bg-transparent border border-white/10 rounded-md px-5 py-2.5 text-gray-500 font-mono text-xs tracking-[1px] cursor-pointer hover:border-white/20">
                {showBreakdown ? "HIDE" : "SHOW"} BREAKDOWN
              </button>
            </>
          )}
        </div>

        {submitted && (
          <div className="text-center mt-3.5 text-[13px] font-semibold" style={{ color: problem.questions.every((q) => (answers[q.id] || "").trim() === q.answer) ? "#00ff9d" : "#ff3e8e" }}>
            {problem.questions.every((q) => (answers[q.id] || "").trim() === q.answer)
              ? "✓ PERFECT"
              : `${problem.questions.filter((q) => (answers[q.id] || "").trim() === q.answer).length}/${problem.questions.length} CORRECT`}
          </div>
        )}
      </div>
      {submitted && showBreakdown && <BreakdownPanel problem={problem} />}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// RAPID FIRE
// ═══════════════════════════════════════════════════════════════════════════

function RapidFireDrill({ onBack }: { onBack: () => void }) {
  const [direction, setDirection] = useState<RapidFireDirection>("mixed");
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState<RapidFireQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const startDrill = useCallback((dir: RapidFireDirection) => {
    setDirection(dir);
    setQuestions(generateRapidFireSet(15, dir));
    setCurrent(0);
    setAnswer("");
    setSubmitted(false);
    setScore(0);
    setTimer(0);
    setStarted(true);
    intervalRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
  }, []);

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  useEffect(() => {
    if (started && inputRef.current) inputRef.current.focus();
  }, [started, current]);

  const handleSubmit = useCallback(() => {
    if (submitted || !questions[current]) return;
    setSubmitted(true);
    const correct = answer.trim().toLowerCase() === questions[current].answer.toLowerCase() ||
      answer.trim() === questions[current].answer.replace("/", "");
    if (correct) setScore((s) => s + 1);
  }, [submitted, answer, questions, current]);

  const handleNext = useCallback(() => {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
      setAnswer("");
      setSubmitted(false);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [current, questions.length]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (!submitted) handleSubmit();
      else handleNext();
    }
  };

  const isFinished = submitted && current === questions.length - 1;
  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  if (!started) {
    return (
      <div>
        <button onClick={onBack} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← MODES</button>
        <div className="text-center mt-8 mb-6">
          <h3 className="text-lg font-bold text-white font-mono mb-1">RAPID FIRE</h3>
          <p className="text-gray-600 text-xs max-w-[360px] mx-auto">
            15 questions. Match CIDR to dotted decimal mask. Speed is the goal — memorize the chart.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 max-w-[400px] mx-auto">
          <ModeButton icon="→" label="CIDR → MASK" desc="Given /24, answer 255.255.255.0" color="#00d4ff" onClick={() => startDrill("cidr_to_mask")} />
          <ModeButton icon="←" label="MASK → CIDR" desc="Given 255.255.240.0, answer /20" color="#00ff9d" onClick={() => startDrill("mask_to_cidr")} />
          <ModeButton icon="⇄" label="MIXED" desc="Both directions, random" color="#ffd700" onClick={() => startDrill("mixed")} />
        </div>
      </div>
    );
  }

  const q = questions[current];
  const isCorrect = submitted && (answer.trim().toLowerCase() === q.answer.toLowerCase() || answer.trim() === q.answer.replace("/", ""));

  if (isFinished) {
    const pct = Math.round((score / questions.length) * 100);
    const avgTime = (timer / questions.length).toFixed(1);
    return (
      <div>
        <button onClick={onBack} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← MODES</button>
        <div className="text-center mt-8">
          <div className="text-5xl mb-3">{pct >= 80 ? "⚡" : pct >= 50 ? "✓" : "📚"}</div>
          <div className="text-[48px] font-extrabold font-mono" style={{ color: pct >= 80 ? "#00ff9d" : "#ff3e8e" }}>{pct}%</div>
          <p className="text-gray-500 text-sm mt-1">{score}/{questions.length} correct in {formatTime(timer)}</p>
          <p className="text-gray-600 text-xs mt-1">{avgTime}s per question</p>
          <div className="flex gap-3 justify-center mt-6">
            <button onClick={() => startDrill(direction)} className="bg-accent-cyan border-none rounded-md px-6 py-2.5 text-bg-primary font-mono text-xs font-bold tracking-[1px] cursor-pointer">AGAIN</button>
            <button onClick={onBack} className="bg-transparent border border-white/10 rounded-md px-6 py-2.5 text-gray-500 font-mono text-xs tracking-[1px] cursor-pointer">BACK</button>
          </div>
        </div>

        {/* Reference chart */}
        <div className="mt-8 max-w-[440px] mx-auto">
          <div className="text-[10px] tracking-[3px] text-gray-600 uppercase mb-2">Quick Reference — CIDR Chart</div>
          <div className="grid grid-cols-2 gap-1" style={{ fontSize: "11px" }}>
            {Array.from({ length: 23 }, (_, i) => i + 8).map((c) => (
              <div key={c} className="flex justify-between px-2 py-1 rounded font-mono" style={{ background: "rgba(0,0,0,0.3)" }}>
                <span className="text-accent-cyan">/{c}</span>
                <span className="text-gray-400">{cidrToMask(c).join(".")}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <button onClick={onBack} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← EXIT</button>
        <div className="flex gap-2">
          <StatBox label="Score" value={`${score}/${current + (submitted ? 1 : 0)}`} color="#00ff9d" small />
          <StatBox label="Time" value={formatTime(timer)} color="#00d4ff" small />
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-5">
        <div className="h-full transition-all duration-300" style={{ width: `${((current + (submitted ? 1 : 0)) / questions.length) * 100}%`, background: "#ffd700" }} />
      </div>

      <div className="text-[10px] text-gray-700 font-mono text-center mb-2">{current + 1} / {questions.length}</div>

      <div className="rounded-xl p-8 text-center" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="text-[clamp(16px,4vw,22px)] text-gray-200 mb-6">{q.prompt}</div>
        <input
          ref={inputRef}
          type="text"
          placeholder={submitted ? q.answer : "Type your answer..."}
          value={answer}
          onChange={(e) => !submitted && setAnswer(e.target.value)}
          onKeyDown={handleKey}
          disabled={submitted}
          className="w-full max-w-[320px] mx-auto px-4 py-3 rounded-md font-mono text-lg text-white text-center transition-all"
          style={{
            background: submitted ? (isCorrect ? "rgba(0,255,157,0.06)" : "rgba(255,62,142,0.06)") : "rgba(0,0,0,0.4)",
            border: `1px solid ${submitted ? (isCorrect ? "#00ff9d44" : "#ff3e8e44") : "rgba(255,255,255,0.08)"}`,
          }}
        />
        {submitted && !isCorrect && (
          <div className="mt-2 text-sm text-accent-pink font-mono">→ {q.answer}</div>
        )}
        {submitted && isCorrect && (
          <div className="mt-2 text-sm text-accent-green font-mono">✓ Correct</div>
        )}
      </div>

      <div className="flex justify-center mt-4">
        {!submitted ? (
          <button onClick={handleSubmit} className="bg-accent-cyan border-none rounded-md px-8 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer">CHECK ↵</button>
        ) : (
          <button onClick={handleNext} className="bg-accent-cyan border-none rounded-md px-8 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer">NEXT ↵</button>
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// VLSM
// ═══════════════════════════════════════════════════════════════════════════

function VLSMDrill({ onBack }: { onBack: () => void }) {
  const [difficulty, setDifficulty] = useState<Difficulty | null>(null);
  const [problem, setProblem] = useState<VLSMProblem | null>(null);
  const [answers, setAnswers] = useState<Record<string, Record<string, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const start = useCallback((d: Difficulty) => {
    setDifficulty(d);
    setProblem(generateVLSMProblem(d));
    setAnswers({});
    setSubmitted(false);
  }, []);

  const next = useCallback(() => {
    if (!difficulty) return;
    setProblem(generateVLSMProblem(difficulty));
    setAnswers({});
    setSubmitted(false);
  }, [difficulty]);

  if (!difficulty) {
    return (
      <div>
        <button onClick={onBack} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← MODES</button>
        <div className="text-center mt-8 mb-6">
          <h3 className="text-lg font-bold text-white font-mono mb-1">VLSM DRILL</h3>
          <p className="text-gray-600 text-xs max-w-[380px] mx-auto">
            Given a network and departments, allocate subnets using Variable Length Subnet Masking. Largest department first.
          </p>
        </div>
        <div className="flex flex-col gap-2.5 max-w-[400px] mx-auto">
          {DIFFICULTIES.map((d) => (
            <ModeButton key={d.id} icon="⬡" label={d.label} desc={`${d.id === "easy" ? "3 departments" : d.id === "medium" ? "4-5 departments" : "5-7 departments"}`} color={d.color} onClick={() => start(d.id)} />
          ))}
        </div>
      </div>
    );
  }

  if (!problem) return null;
  const diffColor = DIFFICULTIES.find((d) => d.id === difficulty)?.color || "#00d4ff";

  const fields = ["cidr", "networkAddr", "firstUsable", "lastUsable", "broadcastAddr"] as const;
  const fieldLabels: Record<string, string> = {
    cidr: "CIDR (e.g. /26)",
    networkAddr: "Network Address",
    firstUsable: "First Usable",
    lastUsable: "Last Usable",
    broadcastAddr: "Broadcast",
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <button onClick={() => setDifficulty(null)} className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400">← DIFFICULTY</button>
      </div>

      <div className="rounded-xl mb-4" style={{ background: "linear-gradient(145deg, rgba(15,15,25,0.95), rgba(10,10,18,0.98))", border: "1px solid rgba(255,255,255,0.06)", padding: "clamp(16px, 3vw, 24px)" }}>
        <div className="text-[10px] tracking-[4px] uppercase mb-2" style={{ color: diffColor }}>VLSM &bull; {difficulty.toUpperCase()}</div>
        <div className="font-mono text-2xl font-extrabold text-white mb-1">
          {problem.givenNetwork}<span style={{ color: diffColor }}>/{problem.givenCidr}</span>
        </div>
        <div className="text-xs text-gray-600 mb-4">
          Total addresses: {problem.totalAddressesAvailable.toLocaleString()} &bull; Allocate largest-first
        </div>

        <div className="text-[10px] tracking-[2px] text-gray-600 uppercase mb-2">Departments (sorted by size)</div>
        <div className="flex gap-2 flex-wrap mb-2">
          {problem.departments.map((d) => (
            <span key={d.name} className="text-xs font-mono px-2.5 py-1 rounded" style={{ background: `${diffColor}12`, border: `1px solid ${diffColor}25`, color: diffColor }}>
              {d.name}: {d.hostsNeeded} hosts
            </span>
          ))}
        </div>
      </div>

      {/* Per-department answer grids */}
      <div className="flex flex-col gap-3">
        {problem.answers.map((expected, idx) => {
          const dept = expected.department;
          const deptAnswers = answers[dept] || {};

          return (
            <div key={dept} className="rounded-lg p-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="font-mono text-sm font-bold" style={{ color: diffColor }}>
                  {idx + 1}. {dept}
                </span>
                <span className="text-[11px] text-gray-600 font-mono">{expected.hostsNeeded} hosts needed</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {fields.map((field) => {
                  const expectedVal = field === "cidr" ? `/${expected[field]}` : expected[field];
                  const userVal = (deptAnswers[field] || "").trim();
                  const normalizedUser = field === "cidr" ? userVal.replace("/", "") : userVal;
                  const normalizedExpected = field === "cidr" ? String(expected[field]) : expectedVal;
                  const isCorrect = submitted && (normalizedUser === normalizedExpected || userVal === expectedVal);
                  const isWrong = submitted && normalizedUser !== normalizedExpected && userVal !== expectedVal;

                  return (
                    <div key={field}>
                      <label className="block text-[10px] text-gray-600 mb-0.5">{fieldLabels[field]}</label>
                      <input
                        type="text"
                        placeholder={submitted ? String(expectedVal) : ""}
                        value={deptAnswers[field] || ""}
                        onChange={(e) => !submitted && setAnswers((a) => ({
                          ...a,
                          [dept]: { ...(a[dept] || {}), [field]: e.target.value },
                        }))}
                        disabled={submitted}
                        className="w-full px-2.5 py-1.5 rounded font-mono text-xs text-white transition-all"
                        style={{
                          background: submitted ? (isCorrect ? "rgba(0,255,157,0.04)" : "rgba(255,62,142,0.04)") : "rgba(0,0,0,0.4)",
                          border: `1px solid ${submitted ? (isCorrect ? "#00ff9d33" : "#ff3e8e33") : "rgba(255,255,255,0.06)"}`,
                        }}
                      />
                      {isWrong && <div className="text-[10px] text-accent-pink font-mono mt-0.5">→ {expectedVal}</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-2.5 mt-5 flex-wrap">
        {!submitted ? (
          <button onClick={() => setSubmitted(true)} className="border-none rounded-md px-7 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer" style={{ background: diffColor }}>CHECK ALL</button>
        ) : (
          <button onClick={next} className="border-none rounded-md px-7 py-2.5 text-bg-primary font-mono text-[13px] font-bold tracking-[1px] cursor-pointer" style={{ background: diffColor }}>NEW PROBLEM</button>
        )}
      </div>

      {submitted && (
        <div className="mt-4 text-xs text-gray-600 font-mono text-center">
          Addresses used: {problem.totalAddressesUsed.toLocaleString()} / {problem.totalAddressesAvailable.toLocaleString()}
          ({Math.round((problem.totalAddressesUsed / problem.totalAddressesAvailable) * 100)}% utilization)
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — MODE SELECTOR
// ═══════════════════════════════════════════════════════════════════════════

export default function SubnetDrill({ backHref }: { backHref: string }) {
  const [activeMode, setActiveMode] = useState<DrillMode | null>(null);

  if (activeMode === "classic") return <ClassicFullDrill mode="classic" onBack={() => setActiveMode(null)} />;
  if (activeMode === "full") return <ClassicFullDrill mode="full" onBack={() => setActiveMode(null)} />;
  if (activeMode === "rapidfire") return <RapidFireDrill onBack={() => setActiveMode(null)} />;
  if (activeMode === "vlsm") return <VLSMDrill onBack={() => setActiveMode(null)} />;

  return (
    <div>
      <BackLink href={backHref} />
      <div className="text-center mt-8 mb-8">
        <h2 className="text-[clamp(24px,6vw,40px)] font-extrabold text-white font-mono">
          <span className="text-accent-green">SUBNET</span> DRILL
        </h2>
        <p className="text-gray-600 text-[13px] mt-2">
          Four modes. Infinite practice. Full breakdowns.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-[440px] mx-auto">
        <ModeButton
          icon="⌨"
          label="CLASSIC"
          desc="Random 3-4 questions per problem"
          color="#00d4ff"
          onClick={() => setActiveMode("classic")}
        />
        <ModeButton
          icon="▦"
          label="FULL DRILL"
          desc="All 7 fields: network, first, last, broadcast, mask, wildcard, hosts"
          color="#00ff9d"
          onClick={() => setActiveMode("full")}
        />
        <ModeButton
          icon="⚡"
          label="RAPID FIRE"
          desc="Memorize CIDR ↔ dotted decimal masks — timed"
          color="#ffd700"
          onClick={() => setActiveMode("rapidfire")}
        />
        <ModeButton
          icon="⬡"
          label="VLSM"
          desc="Allocate subnets for departments with different sizes"
          color="#ff3e8e"
          onClick={() => setActiveMode("vlsm")}
        />
      </div>
    </div>
  );
}
