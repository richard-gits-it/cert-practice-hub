"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CERTS } from "@/data/certs";
import { loadAllProgress, saveAllProgress, type CertProgress } from "@/lib/progress";
import { BackLink, StatBox } from "@/components/ui/shared";

export default function ProgressView() {
  const [allProgress, setAllProgress] = useState<Record<string, CertProgress>>({});
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    setAllProgress(loadAllProgress());
  }, []);

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      setTimeout(() => setConfirmReset(false), 3000);
      return;
    }
    saveAllProgress({});
    setAllProgress({});
    setConfirmReset(false);
  };

  // Calculate totals across everything
  const totalAnswered = Object.values(allProgress).reduce((sum, p) => sum + p.total, 0);
  const totalCorrect = Object.values(allProgress).reduce((sum, p) => sum + p.correct, 0);
  const overallAcc =
    totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
  const bestStreak = Math.max(0, ...Object.values(allProgress).map((p) => p.bestStreak || 0));

  const certEntries = CERTS.filter((c) => allProgress[c.id]);
  const subnetProgress = allProgress["subnet"];

  if (totalAnswered === 0) {
    return (
      <div>
        <BackLink href="/" />
        <div className="text-center mt-16">
          <div className="text-5xl mb-4 opacity-30">▱</div>
          <h2 className="text-white font-mono text-xl font-bold mb-2">No Progress Yet</h2>
          <p className="text-gray-600 text-sm mb-6">
            Start a flashcard session, mock exam, or subnet drill to see your stats here.
          </p>
          <Link
            href="/"
            className="inline-block bg-accent-cyan rounded-md px-6 py-3 text-bg-primary font-mono text-xs font-bold tracking-[1px] hover:brightness-110 transition-all"
          >
            BROWSE CERTS
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8 flex-wrap gap-3">
        <BackLink href="/" />
        <button
          onClick={handleReset}
          className="bg-transparent border rounded-md font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all"
          style={{
            color: confirmReset ? "#ff3e8e" : "#555",
            borderColor: confirmReset ? "#ff3e8e55" : "rgba(255,255,255,0.08)",
          }}
        >
          {confirmReset ? "TAP AGAIN TO CONFIRM" : "RESET ALL"}
        </button>
      </div>

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-[clamp(24px,5vw,36px)] font-extrabold text-white font-mono mb-1">
          <span className="text-accent-gold">YOUR</span> PROGRESS
        </h1>
        <p className="text-gray-700 text-sm">All-time stats across every cert</p>
      </div>

      {/* Overall Stats */}
      <div className="flex gap-2.5 justify-center flex-wrap mb-10">
        <StatBox label="Accuracy" value={`${overallAcc}%`} color="#00ff9d" />
        <StatBox label="Answered" value={totalAnswered.toLocaleString()} color="#00d4ff" />
        <StatBox label="Correct" value={totalCorrect.toLocaleString()} color="#00d4ff" />
        <StatBox label="Best Streak" value={bestStreak} color="#ffd700" />
      </div>

      {/* Per-Cert Stats */}
      {certEntries.length > 0 && (
        <div className="mb-8">
          <div className="text-[10px] tracking-[3px] text-gray-700 uppercase mb-3">
            By Certification
          </div>
          <div className="flex flex-col gap-3">
            {certEntries.map((cert) => {
              const p = allProgress[cert.id];
              const acc = p.total > 0 ? Math.round((p.correct / p.total) * 100) : 0;
              return (
                <Link
                  key={cert.id}
                  href={`/${cert.slug}`}
                  className="rounded-[10px] p-4 transition-all duration-200 hover:scale-[1.01]"
                  style={{
                    background: "rgba(0,0,0,0.3)",
                    border: `1px solid ${cert.color}25`,
                  }}
                >
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <span className="text-lg mr-2">{cert.icon}</span>
                      <span
                        className="font-mono font-bold text-sm"
                        style={{ color: cert.color }}
                      >
                        {cert.name}
                      </span>
                    </div>
                    <span
                      className="font-mono text-lg font-bold"
                      style={{ color: acc >= 70 ? "#00ff9d" : "#ff3e8e" }}
                    >
                      {acc}%
                    </span>
                  </div>
                  <div className="h-1 bg-white/5 rounded overflow-hidden mb-3">
                    <div
                      className="h-full rounded transition-all duration-500"
                      style={{
                        width: `${acc}%`,
                        background: acc >= 70 ? "#00ff9d" : "#ff3e8e",
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-gray-600 font-mono">
                    <span>
                      {p.correct}/{p.total} answered
                    </span>
                    <span>Best streak: {p.bestStreak}</span>
                  </div>

                  {/* Domain breakdown */}
                  {Object.keys(p.byDomain).length > 0 && (
                    <div className="mt-3 pt-3 border-t border-white/[0.04]">
                      {Object.entries(p.byDomain).map(([domain, stats]) => {
                        const dAcc =
                          stats.attempted > 0
                            ? Math.round((stats.correct / stats.attempted) * 100)
                            : 0;
                        return (
                          <div
                            key={domain}
                            className="flex justify-between text-[11px] py-1"
                          >
                            <span className="text-gray-600">{domain}</span>
                            <span
                              className="font-mono"
                              style={{ color: dAcc >= 70 ? "#00ff9d" : "#888" }}
                            >
                              {stats.correct}/{stats.attempted} ({dAcc}%)
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Subnet Drill */}
      {subnetProgress && subnetProgress.total > 0 && (
        <div>
          <div className="text-[10px] tracking-[3px] text-gray-700 uppercase mb-3">
            Subnetting Drill
          </div>
          <Link
            href="/subnet"
            className="block rounded-[10px] p-4 transition-all duration-200 hover:scale-[1.01]"
            style={{
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(0,255,157,0.25)",
            }}
          >
            <div className="flex justify-between items-center mb-3">
              <div>
                <span className="text-lg mr-2">⌨</span>
                <span className="font-mono font-bold text-sm text-accent-green">
                  Subnet Drill
                </span>
              </div>
              <span
                className="font-mono text-lg font-bold"
                style={{
                  color:
                    subnetProgress.correct / subnetProgress.total >= 0.7
                      ? "#00ff9d"
                      : "#ff3e8e",
                }}
              >
                {Math.round((subnetProgress.correct / subnetProgress.total) * 100)}%
              </span>
            </div>
            <div className="flex justify-between text-[11px] text-gray-600 font-mono">
              <span>
                {subnetProgress.correct}/{subnetProgress.total} questions
              </span>
              <span>Best streak: {subnetProgress.bestStreak}</span>
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
