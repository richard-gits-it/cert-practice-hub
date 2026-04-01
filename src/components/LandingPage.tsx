"use client";

import { useState } from "react";
import { CERTS, Cert } from "@/data/certs";
import { loadAllProgress } from "@/lib/progress";
import { Badge, StatBox } from "@/components/ui/shared";

export default function LandingPage({
  onSelectCert,
  onSubnet,
}: {
  onSelectCert: (cert: Cert) => void;
  onSubnet: () => void;
}) {
  const [hoveredCert, setHoveredCert] = useState<string | null>(null);
  const allProgress = loadAllProgress();

  return (
    <div className="text-center">
      {/* Hero */}
      <div className="mb-12">
        <div className="animate-fade-up text-[10px] tracking-[8px] text-gray-600 mb-3 uppercase">
          Free &bull; No Login &bull; Open Source
        </div>
        <h1 className="animate-fade-up-1 text-[clamp(28px,7vw,48px)] font-extrabold text-white font-mono leading-tight mb-3">
          <span className="text-accent-cyan">CERT</span> PRACTICE
          <br />
          <span className="text-[0.6em] font-normal text-gray-700">HUB</span>
        </h1>
        <p className="animate-fade-up-2 text-gray-600 text-sm max-w-[420px] mx-auto leading-relaxed">
          Flashcards, subnetting drills, and timed mock exams.
          <br />
          Pick a cert, start drilling.
        </p>
      </div>

      {/* Cert Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-[580px] mx-auto mb-8">
        {CERTS.map((cert, idx) => (
          <button
            key={cert.id}
            onClick={() => (cert.available ? onSelectCert(cert) : null)}
            onMouseEnter={() => setHoveredCert(cert.id)}
            onMouseLeave={() => setHoveredCert(null)}
            className="text-left rounded-[10px] p-5 transition-all duration-200 relative overflow-hidden"
            style={{
              background:
                hoveredCert === cert.id && cert.available
                  ? `${cert.color}08`
                  : "rgba(0,0,0,0.3)",
              border: `1px solid ${
                hoveredCert === cert.id && cert.available
                  ? cert.color + "66"
                  : cert.color + "20"
              }`,
              cursor: cert.available ? "pointer" : "default",
              opacity: cert.available ? 1 : 0.5,
              animationDelay: `${idx * 0.08 + 0.16}s`,
            }}
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xl mr-2">{cert.icon}</span>
                <span
                  className="font-mono font-bold text-[15px]"
                  style={{ color: cert.color }}
                >
                  {cert.name}
                </span>
              </div>
              {!cert.available && <Badge text="Coming Soon" color="#666" />}
            </div>
            <div className="text-xs text-gray-700 font-mono">{cert.code}</div>
            <div className="text-[11px] text-gray-700 mt-2">
              {cert.domains.length} domains &bull;{" "}
              {cert.hasSubnet ? "Subnetting" : "Theory"}
            </div>
            {allProgress[cert.id] && (
              <div
                className="mt-2.5 text-[11px] font-mono"
                style={{ color: cert.color }}
              >
                {allProgress[cert.id].correct}/{allProgress[cert.id].total}{" "}
                correct &bull; {allProgress[cert.id].streak} streak
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Subnet Quick Access */}
      <div className="max-w-[580px] mx-auto">
        <button
          onClick={onSubnet}
          className="w-full text-left rounded-[10px] p-4 px-5 transition-all duration-200 flex justify-between items-center hover:border-accent-green/30"
          style={{
            background: "rgba(0,0,0,0.2)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(0,255,157,0.3)";
            e.currentTarget.style.background = "rgba(0,255,157,0.04)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
            e.currentTarget.style.background = "rgba(0,0,0,0.2)";
          }}
        >
          <div>
            <div className="text-accent-green font-mono font-bold text-[13px] tracking-[1px]">
              ⌨ SUBNETTING DRILL
            </div>
            <div className="text-gray-700 text-xs mt-1">
              Infinite algorithmic practice &bull; CCNA &amp; Network+
            </div>
          </div>
          <div className="text-gray-800 text-xl">→</div>
        </button>
      </div>
    </div>
  );
}
