"use client";

import { useState, useEffect } from "react";
import { Cert } from "@/data/certs";
import { getCertProgress, type CertProgress } from "@/lib/progress";
import { BackLink, ModeLink, StatBox } from "@/components/ui/shared";

export default function CertHubView({ cert }: { cert: Cert }) {
  const [progress, setProgress] = useState<CertProgress>({
    total: 0,
    correct: 0,
    streak: 0,
    bestStreak: 0,
    byDomain: {},
  });

  useEffect(() => {
    setProgress(getCertProgress(cert.id));
  }, [cert.id]);

  const accuracy =
    progress.total > 0 ? Math.round((progress.correct / progress.total) * 100) : 0;

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <BackLink href="/" label="← CERTS" />
        <div className="flex gap-2">
          <StatBox
            label="Accuracy"
            value={progress.total > 0 ? `${accuracy}%` : "—"}
            color={cert.color}
            small
          />
          <StatBox label="Streak" value={progress.streak} color="#ffd700" small />
        </div>
      </div>

      <div className="text-center mb-9">
        <span className="text-[32px]">{cert.icon}</span>
        <h2 className="text-[clamp(24px,5vw,36px)] font-extrabold text-white font-mono mt-2 mb-1">
          <span style={{ color: cert.color }}>{cert.name}</span>
        </h2>
        <div className="text-gray-700 text-[13px] font-mono">{cert.code}</div>
      </div>

      <div className="flex flex-col gap-3 max-w-[440px] mx-auto">
        <ModeLink
          href={`/${cert.slug}/flashcards`}
          icon="▦"
          label="FLASHCARDS"
          desc={`${cert.domains.length} domains — flip-card drill`}
          color={cert.color}
        />
        <ModeLink
          href={`/${cert.slug}/exam`}
          icon="◷"
          label="MOCK EXAM"
          desc="Timed mock exam with score report"
          color="#ff3e8e"
        />
        {cert.hasSubnet && (
          <ModeLink
            href="/subnet"
            icon="⌨"
            label="SUBNETTING DRILL"
            desc="Infinite algorithmic practice"
            color="#00ff9d"
          />
        )}
      </div>

      <div className="mt-9 max-w-[440px] mx-auto">
        <div className="text-[10px] tracking-[3px] text-gray-700 uppercase mb-3">
          Exam Domains
        </div>
        {cert.domains.map((d, i) => {
          const dp = progress.byDomain?.[d];
          return (
            <div
              key={d}
              className="flex justify-between items-center py-2.5 px-3 border-b border-white/[0.03] text-[13px]"
            >
              <span className="text-gray-500">
                <span className="font-mono text-[11px] mr-2" style={{ color: cert.color }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {d}
              </span>
              {dp && (
                <span className="text-gray-700 font-mono text-[11px]">
                  {dp.correct}/{dp.attempted}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
