"use client";

import { Cert } from "@/data/certs";
import { getCertProgress } from "@/lib/progress";
import { BackButton, ModeButton, StatBox } from "@/components/ui/shared";

export default function CertHub({
  cert,
  onBack,
  onFlashcards,
  onExam,
  onSubnet,
}: {
  cert: Cert;
  onBack: () => void;
  onFlashcards: () => void;
  onExam: () => void;
  onSubnet: () => void;
}) {
  const progress = getCertProgress(cert.id);
  const accuracy =
    progress.total > 0
      ? Math.round((progress.correct / progress.total) * 100)
      : 0;

  return (
    <div>
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <BackButton onClick={onBack} label="← CERTS" />
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

      {/* Cert Header */}
      <div className="text-center mb-9">
        <span className="text-[32px]">{cert.icon}</span>
        <h2 className="text-[clamp(24px,5vw,36px)] font-extrabold text-white font-mono mt-2 mb-1">
          <span style={{ color: cert.color }}>{cert.name}</span>
        </h2>
        <div className="text-gray-700 text-[13px] font-mono">{cert.code}</div>
      </div>

      {/* Mode Buttons */}
      <div className="flex flex-col gap-3 max-w-[440px] mx-auto">
        <ModeButton
          icon="▦"
          label="FLASHCARDS"
          desc={`${cert.domains.length} domains — flip-card drill`}
          color={cert.color}
          onClick={onFlashcards}
        />
        <ModeButton
          icon="◷"
          label="MOCK EXAM"
          desc="Timed mock exam with score report"
          color="#ff3e8e"
          onClick={onExam}
        />
        {cert.hasSubnet && (
          <ModeButton
            icon="⌨"
            label="SUBNETTING DRILL"
            desc="Infinite algorithmic practice"
            color="#00ff9d"
            onClick={onSubnet}
          />
        )}
      </div>

      {/* Domain List */}
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
                <span
                  className="font-mono text-[11px] mr-2"
                  style={{ color: cert.color }}
                >
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
