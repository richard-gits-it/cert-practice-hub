"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Cert } from "@/data/certs";
import { getMultipleChoiceQuestions } from "@/data/questions";
import { Question } from "@/data/types";
import { getCertProgress, saveCertProgress } from "@/lib/progress";
import { BackLink } from "@/components/ui/shared";

export default function ExamMode({
  cert,
  backHref,
}: {
  cert: Cert;
  backHref: string;
}) {
  const allMC = getMultipleChoiceQuestions(cert.id);
  const [phase, setPhase] = useState<"intro" | "active" | "results">("intro");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeLeft, setTimeLeft] = useState(60 * 60);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startExam = () => {
    const shuffled = [...allMC].sort(() => Math.random() - 0.5).slice(0, Math.min(50, allMC.length));
    setQuestions(shuffled);
    setAnswers({});
    setCurrent(0);
    setTimeLeft(60 * 60);
    setPhase("active");
  };

  useEffect(() => {
    if (phase === "active") {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setPhase("results");
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [phase]);

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("results");
  }, []);

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  // ── Intro ─────────────────────────────────────────────────────────────
  if (phase === "intro") {
    return (
      <div>
        <BackLink href={backHref} />
        <div className="text-center mt-12">
          <div className="text-5xl mb-4">◷</div>
          <h2 className="text-white font-mono text-2xl font-bold mb-2">Mock Exam</h2>
          <p className="text-gray-600 text-sm mb-1">
            {cert.name} &bull; {Math.min(50, allMC.length)} questions &bull; 60 minutes
          </p>
          {allMC.length < 10 && (
            <p className="text-accent-pink text-xs mb-4">
              ⚠ Only {allMC.length} questions available — expand the question bank for a full exam
            </p>
          )}
          <button
            onClick={startExam}
            className="mt-4 bg-accent-pink border-none rounded-lg px-9 py-3.5 text-bg-primary font-mono text-sm font-bold tracking-[1px] cursor-pointer hover:brightness-110 transition-all"
          >
            START EXAM
          </button>
        </div>
      </div>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────
  if (phase === "results") {
    const score = questions.filter((q) => answers[q.id] === q.correct_answer).length;
    const pct = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const passed = pct >= 70;

    const domainMap: Record<string, { total: number; correct: number }> = {};
    questions.forEach((q) => {
      if (!domainMap[q.domain]) domainMap[q.domain] = { total: 0, correct: 0 };
      domainMap[q.domain].total++;
      if (answers[q.id] === q.correct_answer) domainMap[q.domain].correct++;
    });

    const progress = getCertProgress(cert.id);
    progress.total += questions.length;
    progress.correct += score;
    Object.entries(domainMap).forEach(([domain, stats]) => {
      if (!progress.byDomain[domain]) progress.byDomain[domain] = { attempted: 0, correct: 0 };
      progress.byDomain[domain].attempted += stats.total;
      progress.byDomain[domain].correct += stats.correct;
    });
    saveCertProgress(cert.id, progress);

    const missed = questions.filter((q) => answers[q.id] !== q.correct_answer);

    return (
      <div>
        <BackLink href={backHref} />

        <div className="text-center mt-8 mb-8">
          <div
            className="text-[64px] font-extrabold font-mono"
            style={{ color: passed ? "#00ff9d" : "#ff3e8e" }}
          >
            {pct}%
          </div>
          <div
            className="text-lg font-semibold tracking-[2px]"
            style={{ color: passed ? "#00ff9d" : "#ff3e8e" }}
          >
            {passed ? "PASSED" : "NOT YET"}
          </div>
          <div className="text-gray-700 text-[13px] mt-2 font-mono">
            {score}/{questions.length} correct &bull; {formatTime(3600 - timeLeft)} elapsed
          </div>
        </div>

        <div className="max-w-[440px] mx-auto">
          <div className="text-[10px] tracking-[3px] text-gray-700 uppercase mb-3">
            Domain Breakdown
          </div>
          {Object.entries(domainMap).map(([domain, stats]) => {
            const dpct = Math.round((stats.correct / stats.total) * 100);
            return (
              <div key={domain} className="mb-3">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{domain}</span>
                  <span
                    className="font-mono"
                    style={{ color: dpct >= 70 ? "#00ff9d" : "#ff3e8e" }}
                  >
                    {stats.correct}/{stats.total}
                  </span>
                </div>
                <div className="h-1 bg-white/5 rounded overflow-hidden">
                  <div
                    className="h-full rounded transition-all duration-500"
                    style={{
                      width: `${dpct}%`,
                      background: dpct >= 70 ? "#00ff9d" : "#ff3e8e",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {missed.length > 0 && (
          <div className="max-w-[440px] mx-auto mt-8">
            <div className="text-[10px] tracking-[3px] text-gray-700 uppercase mb-3">
              Missed Questions ({missed.length})
            </div>
            {missed.map((q) => (
              <div
                key={q.id}
                className="rounded-lg p-3.5 mb-2"
                style={{
                  background: "rgba(255,62,142,0.04)",
                  border: "1px solid rgba(255,62,142,0.1)",
                }}
              >
                <div className="text-[13px] text-gray-300 mb-1.5">{q.prompt}</div>
                <div className="text-xs text-accent-pink font-mono">
                  Your answer: {answers[q.id] || "—"}
                </div>
                <div className="text-xs text-accent-green font-mono">
                  Correct: {q.correct_answer}
                </div>
                {q.explanation && (
                  <div className="text-[11px] text-gray-600 mt-1.5">{q.explanation}</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── Active Exam ───────────────────────────────────────────────────────
  const q = questions[current];

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <div
          className="font-mono text-xl font-bold"
          style={{ color: timeLeft < 300 ? "#ff3e8e" : "#00d4ff" }}
        >
          {formatTime(timeLeft)}
        </div>
        <div className="text-xs text-gray-700 font-mono">
          {current + 1} / {questions.length}
        </div>
      </div>

      <div className="flex gap-[3px] mb-6 flex-wrap">
        {questions.map((_, i) => (
          <div
            key={i}
            onClick={() => setCurrent(i)}
            className="w-2.5 h-2.5 rounded-sm cursor-pointer transition-all"
            style={{
              background:
                i === current
                  ? cert.color
                  : answers[questions[i].id]
                  ? `${cert.color}44`
                  : "rgba(255,255,255,0.06)",
            }}
          />
        ))}
      </div>

      <div
        className="rounded-xl"
        style={{
          background: "rgba(0,0,0,0.3)",
          border: "1px solid rgba(255,255,255,0.06)",
          padding: "clamp(20px, 4vw, 32px)",
        }}
      >
        <div className="text-[10px] tracking-[2px] text-gray-700 uppercase mb-3">{q.domain}</div>
        <div
          className="text-gray-200 leading-relaxed mb-6"
          style={{ fontSize: "clamp(15px, 3vw, 18px)" }}
        >
          {q.prompt}
        </div>

        <div className="flex flex-col gap-2">
          {q.options.map((opt) => (
            <button
              key={opt}
              onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt }))}
              className="text-left rounded-lg px-4 py-3 text-sm font-mono cursor-pointer transition-all"
              style={{
                background: answers[q.id] === opt ? `${cert.color}15` : "rgba(0,0,0,0.3)",
                border: `1px solid ${
                  answers[q.id] === opt ? cert.color + "55" : "rgba(255,255,255,0.06)"
                }`,
                color: answers[q.id] === opt ? cert.color : "#aaa",
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between mt-4 gap-3">
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          className="bg-black/30 border border-white/[0.08] rounded-md px-6 py-2.5 font-mono text-xs tracking-[1px] transition-all disabled:opacity-30 text-gray-500"
        >
          ← PREV
        </button>
        {current === questions.length - 1 ? (
          <button
            onClick={submitExam}
            className="bg-accent-pink border-none rounded-md px-6 py-2.5 text-bg-primary font-mono text-xs font-bold tracking-[1px] cursor-pointer"
          >
            SUBMIT EXAM
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
            className="bg-black/30 border border-white/[0.08] rounded-md px-6 py-2.5 font-mono text-xs tracking-[1px] transition-all text-gray-500"
          >
            NEXT →
          </button>
        )}
      </div>
    </div>
  );
}
