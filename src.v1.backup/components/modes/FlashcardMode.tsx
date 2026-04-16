"use client";

import { useState } from "react";
import { Cert } from "@/data/certs";
import { getQuestions } from "@/data/questions";
import { BackLink } from "@/components/ui/shared";

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

export default function FlashcardMode({
  cert,
  backHref,
}: {
  cert: Cert;
  backHref: string;
}) {
  const allQuestions = getQuestions(cert.id);
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [domain, setDomain] = useState("all");

  const filtered =
    domain === "all"
      ? allQuestions
      : allQuestions.filter((q) => q.domain === domain);
  const card = filtered.length > 0 ? filtered[index % filtered.length] : null;

  const next = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => i + 1), 150);
  };
  const prev = () => {
    setFlipped(false);
    setTimeout(() => setIndex((i) => Math.max(0, i - 1)), 150);
  };

  if (!card) {
    return (
      <div>
        <BackLink href={backHref} />
        <p className="text-gray-600 text-center mt-16">
          No questions available for this cert yet.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <BackLink href={backHref} />
        <div className="text-xs text-gray-700 font-mono">
          {(index % filtered.length) + 1} / {filtered.length}
        </div>
      </div>

      <div className="flex gap-1.5 mb-6 flex-wrap">
        <FilterChip
          label="All"
          active={domain === "all"}
          color={cert.color}
          onClick={() => {
            setDomain("all");
            setIndex(0);
            setFlipped(false);
          }}
        />
        {cert.domains.map((d) => (
          <FilterChip
            key={d}
            label={d}
            active={domain === d}
            color={cert.color}
            onClick={() => {
              setDomain(d);
              setIndex(0);
              setFlipped(false);
            }}
          />
        ))}
      </div>

      <div
        onClick={() => setFlipped((f) => !f)}
        className="rounded-xl min-h-[220px] flex flex-col justify-center cursor-pointer transition-all duration-300 relative"
        style={{
          background: flipped ? `${cert.color}08` : "rgba(0,0,0,0.3)",
          border: `1px solid ${flipped ? cert.color + "33" : "rgba(255,255,255,0.06)"}`,
          padding: "clamp(24px, 5vw, 40px)",
        }}
      >
        <div className="text-[10px] tracking-[2px] text-gray-700 uppercase mb-4">
          {flipped ? "ANSWER" : "QUESTION"} &bull; {card.domain}
        </div>
        <div
          className="leading-relaxed"
          style={{
            fontSize: "clamp(16px, 3.5vw, 20px)",
            color: flipped ? cert.color : "#e0e0e0",
            fontWeight: flipped ? 500 : 400,
          }}
        >
          {flipped ? card.correct_answer : card.prompt}
        </div>
        {flipped && card.explanation && (
          <div className="mt-4 text-[13px] text-gray-600 leading-relaxed border-t border-white/5 pt-3">
            {card.explanation}
          </div>
        )}
        <div className="absolute bottom-3 right-4 text-[11px] text-gray-800">
          tap to flip
        </div>
      </div>

      <div className="flex gap-3 mt-4 justify-center">
        <button
          onClick={prev}
          disabled={index === 0}
          className="bg-black/30 border border-white/[0.08] rounded-md px-6 py-2.5 font-mono text-xs tracking-[1px] transition-all disabled:opacity-30 disabled:cursor-default text-gray-500 hover:text-gray-300"
        >
          ← PREV
        </button>
        <button
          onClick={next}
          disabled={filtered.length <= 1}
          className="bg-black/30 border border-white/[0.08] rounded-md px-6 py-2.5 font-mono text-xs tracking-[1px] transition-all disabled:opacity-30 disabled:cursor-default text-gray-500 hover:text-gray-300"
        >
          NEXT →
        </button>
      </div>
    </div>
  );
}
