"use client";

import { useState, useEffect, useCallback } from "react";
import { Cert } from "@/data/certs";
import { getQuestions } from "@/data/questions";
import { Question } from "@/data/types";
import { BackLink, StatBox } from "@/components/ui/shared";
import {
  buildReviewQueue,
  reviewCard,
  getCardState,
  getSM2Stats,
  type Quality,
  type CardState,
} from "@/lib/sm2";

// ── Quality Rating Buttons ───────────────────────────────────────────────────

const QUALITY_BUTTONS: { quality: Quality; label: string; sublabel: string; color: string }[] = [
  { quality: 0, label: "Blackout", sublabel: "No idea", color: "#ff3e8e" },
  { quality: 1, label: "Wrong", sublabel: "Recognized after", color: "#ff6b6b" },
  { quality: 2, label: "Wrong", sublabel: "Seemed obvious", color: "#ff9f43" },
  { quality: 3, label: "Hard", sublabel: "Got it, barely", color: "#ffd700" },
  { quality: 4, label: "Good", sublabel: "After hesitation", color: "#00d4ff" },
  { quality: 5, label: "Easy", sublabel: "Instant recall", color: "#00ff9d" },
];

function QualityButtons({
  onRate,
  cardState,
}: {
  onRate: (q: Quality) => void;
  cardState: CardState | null;
}) {
  return (
    <div className="mt-6">
      <div className="text-[10px] tracking-[3px] text-gray-600 uppercase mb-3 text-center">
        How well did you know this?
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
        {QUALITY_BUTTONS.map((btn) => (
          <button
            key={btn.quality}
            onClick={() => onRate(btn.quality)}
            className="rounded-lg p-2 transition-all duration-150 hover:scale-105 cursor-pointer text-center"
            style={{
              background: `${btn.color}10`,
              border: `1px solid ${btn.color}30`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = `${btn.color}88`;
              e.currentTarget.style.background = `${btn.color}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = `${btn.color}30`;
              e.currentTarget.style.background = `${btn.color}10`;
            }}
          >
            <div className="font-mono text-xs font-bold" style={{ color: btn.color }}>
              {btn.label}
            </div>
            <div className="text-[9px] text-gray-600 mt-0.5">{btn.sublabel}</div>
          </button>
        ))}
      </div>
      {cardState && (
        <div className="text-center mt-3 text-[10px] text-gray-700 font-mono">
          EF: {cardState.ef.toFixed(2)} &bull; Interval: {cardState.interval}d &bull;
          Reps: {cardState.repetitions}
        </div>
      )}
    </div>
  );
}

// ── Small UI Pieces ──────────────────────────────────────────────────────────

function CardBadge({ state }: { state: CardState | null }) {
  if (!state) {
    return (
      <span className="text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded font-semibold bg-white/5 text-gray-600 border border-white/[0.06]">
        NEW
      </span>
    );
  }
  if (state.interval >= 21 && state.repetitions >= 4) {
    return (
      <span
        className="text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded font-semibold"
        style={{ background: "#00ff9d15", color: "#00ff9d", border: "1px solid #00ff9d30" }}
      >
        MASTERED
      </span>
    );
  }
  return (
    <span
      className="text-[9px] tracking-[1.5px] uppercase px-2 py-0.5 rounded font-semibold"
      style={{ background: "#00d4ff15", color: "#00d4ff", border: "1px solid #00d4ff30" }}
    >
      LEARNING
    </span>
  );
}

function NextReviewInfo({ nextReview }: { nextReview: string }) {
  const diffDays = Math.ceil(
    (new Date(nextReview).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
  let text: string;
  if (diffDays <= 0) text = "Due now";
  else if (diffDays === 1) text = "Due tomorrow";
  else if (diffDays < 7) text = `Due in ${diffDays} days`;
  else if (diffDays < 30) text = `Due in ${Math.ceil(diffDays / 7)}w`;
  else text = `Due in ${Math.ceil(diffDays / 30)}mo`;

  return <span className="text-[10px] text-gray-600 font-mono">{text}</span>;
}

function SM2ProgressBar({
  mastered,
  learning,
  unseen,
  color,
}: {
  mastered: number;
  learning: number;
  unseen: number;
  color: string;
}) {
  const total = mastered + learning + unseen;
  if (total === 0) return null;
  const masteredPct = (mastered / total) * 100;
  const learningPct = (learning / total) * 100;

  return (
    <div className="w-full">
      <div className="h-1.5 bg-white/5 rounded-full overflow-hidden flex">
        {masteredPct > 0 && (
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${masteredPct}%`, background: "#00ff9d" }}
          />
        )}
        {learningPct > 0 && (
          <div
            className="h-full transition-all duration-500"
            style={{ width: `${learningPct}%`, background: color }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5 text-[10px] font-mono">
        <span className="text-accent-green">{mastered} mastered</span>
        <span style={{ color }}>{learning} learning</span>
        <span className="text-gray-700">{unseen} unseen</span>
      </div>
    </div>
  );
}

function FilterChip({
  label,
  active,
  color,
  onClick,
}: {
  label: string;
  active: boolean;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3 py-1 text-[11px] font-mono transition-all whitespace-nowrap"
      style={{
        background: active ? `${color}18` : "transparent",
        border: `1px solid ${active ? color + "44" : "rgba(255,255,255,0.06)"}`,
        color: active ? color : "#555",
      }}
    >
      {label}
    </button>
  );
}

// ── Main Component ───────────────────────────────────────────────────────────

export default function FlashcardMode({
  cert,
  backHref,
}: {
  cert: Cert;
  backHref: string;
}) {
  const [domain, setDomain] = useState("all");
  const [queue, setQueue] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [rated, setRated] = useState(false);
  const [lastState, setLastState] = useState<CardState | null>(null);
  const [sessionReviewed, setSessionReviewed] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [stats, setStats] = useState({
    mastered: 0, learning: 0, unseen: 0, dueToday: 0, averageEF: 2.5,
  });
  const [questionsMap, setQuestionsMap] = useState<Record<string, Question>>({});

  // Rebuild queue when domain changes
  const rebuildQueue = useCallback(() => {
    const allQuestions = getQuestions(cert.id);
    const filtered =
      domain === "all" ? allQuestions : allQuestions.filter((q) => q.domain === domain);
    const ids = filtered.map((q) => q.id);
    const map: Record<string, Question> = {};
    filtered.forEach((q) => {
      map[q.id] = q;
    });

    setQuestionsMap(map);
    setQueue(buildReviewQueue(cert.id, ids, 10));
    setStats(getSM2Stats(cert.id, ids));
    setCurrentIndex(0);
    setFlipped(false);
    setRated(false);
    setLastState(null);
  }, [cert.id, domain]);

  useEffect(() => {
    rebuildQueue();
  }, [rebuildQueue]);

  const currentId = queue[currentIndex];
  const currentCard = currentId ? questionsMap[currentId] : null;
  const currentCardState = currentId ? getCardState(currentId) : null;

  const handleRate = useCallback(
    (quality: Quality) => {
      if (!currentId || rated) return;
      const newState = reviewCard(currentId, cert.id, quality);
      setLastState(newState);
      setRated(true);
      setSessionReviewed((n) => n + 1);
      if (quality >= 3) setSessionCorrect((n) => n + 1);

      // Refresh stats
      const allQuestions = getQuestions(cert.id);
      const filtered =
        domain === "all" ? allQuestions : allQuestions.filter((q) => q.domain === domain);
      setStats(getSM2Stats(cert.id, filtered.map((q) => q.id)));
    },
    [currentId, rated, cert.id, domain]
  );

  const handleNext = useCallback(() => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((i) => i + 1);
      setFlipped(false);
      setRated(false);
      setLastState(null);
    } else {
      rebuildQueue();
      setSessionReviewed(0);
      setSessionCorrect(0);
    }
  }, [currentIndex, queue.length, rebuildQueue]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Ignore if typing in an input
      if ((e.target as HTMLElement)?.tagName === "INPUT") return;

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!flipped) {
          setFlipped(true);
        } else if (rated) {
          handleNext();
        }
      }
      if (flipped && !rated) {
        const num = parseInt(e.key);
        if (num >= 0 && num <= 5) {
          handleRate(num as Quality);
        }
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [flipped, rated, handleRate, handleNext]);

  // ── Empty State ───────────────────────────────────────────────────────
  if (queue.length === 0) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <BackLink href={backHref} />
        </div>

        {/* Domain filter even on empty so user can switch */}
        <div className="flex gap-1.5 mb-6 flex-wrap">
          <FilterChip label="All" active={domain === "all"} color={cert.color} onClick={() => setDomain("all")} />
          {cert.domains.map((d) => (
            <FilterChip key={d} label={d} active={domain === d} color={cert.color} onClick={() => setDomain(d)} />
          ))}
        </div>

        <div className="text-center mt-8">
          <div className="text-5xl mb-4 opacity-40">✓</div>
          <h2 className="text-white font-mono text-xl font-bold mb-2">
            {stats.dueToday === 0 && stats.unseen === 0 ? "All caught up!" : "No cards due right now"}
          </h2>
          <p className="text-gray-600 text-sm mb-6">
            {stats.unseen > 0
              ? `${stats.unseen} unseen cards will be introduced next session (10 per session).`
              : "Come back later when cards are due for review."}
          </p>
          <div className="max-w-[400px] mx-auto">
            <SM2ProgressBar mastered={stats.mastered} learning={stats.learning} unseen={stats.unseen} color={cert.color} />
          </div>
        </div>
      </div>
    );
  }

  if (!currentCard) return null;

  // ── Active Review ─────────────────────────────────────────────────────
  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-4 flex-wrap gap-3">
        <BackLink href={backHref} />
        <div className="flex gap-2">
          <StatBox label="Session" value={`${sessionCorrect}/${sessionReviewed}`} color={cert.color} small />
          <StatBox label="Due" value={stats.dueToday} color={stats.dueToday > 0 ? "#ff3e8e" : "#00ff9d"} small />
        </div>
      </div>

      {/* Progress */}
      <div className="mb-5">
        <SM2ProgressBar mastered={stats.mastered} learning={stats.learning} unseen={stats.unseen} color={cert.color} />
      </div>

      {/* Domain Filter */}
      <div className="flex gap-1.5 mb-5 flex-wrap">
        <FilterChip label="All" active={domain === "all"} color={cert.color} onClick={() => setDomain("all")} />
        {cert.domains.map((d) => (
          <FilterChip key={d} label={d} active={domain === d} color={cert.color} onClick={() => setDomain(d)} />
        ))}
      </div>

      {/* Queue position + status */}
      <div className="flex justify-between items-center mb-3 text-[11px] font-mono">
        <div className="flex items-center gap-2">
          <CardBadge state={currentCardState} />
          <span className="text-gray-700">{currentIndex + 1} / {queue.length}</span>
        </div>
        {currentCardState && <NextReviewInfo nextReview={currentCardState.nextReview} />}
      </div>

      {/* Card */}
      <div
        onClick={() => !flipped && setFlipped(true)}
        className="rounded-xl min-h-[200px] flex flex-col justify-center transition-all duration-300 relative"
        style={{
          background: flipped ? `${cert.color}08` : "rgba(0,0,0,0.3)",
          border: `1px solid ${flipped ? cert.color + "33" : "rgba(255,255,255,0.06)"}`,
          padding: "clamp(24px, 5vw, 40px)",
          cursor: flipped ? "default" : "pointer",
        }}
      >
        <div className="text-[10px] tracking-[2px] text-gray-700 uppercase mb-4">
          {flipped ? "ANSWER" : "QUESTION"} &bull; {currentCard.domain}
        </div>
        <div
          className="leading-relaxed"
          style={{
            fontSize: "clamp(16px, 3.5vw, 20px)",
            color: flipped ? cert.color : "#e0e0e0",
            fontWeight: flipped ? 500 : 400,
          }}
        >
          {flipped ? currentCard.correct_answer : currentCard.prompt}
        </div>
        {flipped && currentCard.explanation && (
          <div className="mt-4 text-[13px] text-gray-600 leading-relaxed border-t border-white/5 pt-3">
            {currentCard.explanation}
          </div>
        )}
        {!flipped && (
          <div className="absolute bottom-3 right-4 text-[11px] text-gray-800">
            tap or space to reveal
          </div>
        )}
      </div>

      {/* Rating */}
      {flipped && !rated && <QualityButtons onRate={handleRate} cardState={currentCardState} />}

      {/* After rating */}
      {flipped && rated && lastState && (
        <div className="mt-5">
          <div className="text-center mb-3">
            <div className="text-[11px] font-mono text-gray-600">
              Next review:{" "}
              <span style={{ color: lastState.interval <= 1 ? "#ff3e8e" : "#00ff9d" }}>
                {lastState.interval === 1 ? "tomorrow" : `in ${lastState.interval} days`}
              </span>
              <span className="text-gray-700 ml-2">(EF: {lastState.ef.toFixed(2)})</span>
            </div>
          </div>
          <div className="flex justify-center">
            <button
              onClick={handleNext}
              className="rounded-md px-8 py-2.5 font-mono text-[13px] font-bold tracking-[1px] cursor-pointer transition-all border-none"
              style={{ background: cert.color, color: "#08080d" }}
            >
              {currentIndex < queue.length - 1 ? "NEXT CARD ↵" : "FINISH SESSION"}
            </button>
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div className="text-center mt-4 text-[10px] text-gray-800 font-mono">
        {!flipped ? "SPACE to reveal" : !rated ? "0-5 to rate" : "ENTER for next"}
      </div>
    </div>
  );
}
