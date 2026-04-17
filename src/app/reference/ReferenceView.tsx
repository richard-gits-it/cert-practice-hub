"use client";

import { useState, useMemo } from "react";
import { BackLink } from "@/components/ui/shared";
import { GLOSSARY, PORTS, SUBNET_CHART, AD_CHART } from "@/data/reference";

type Tab = "glossary" | "ports" | "subnetting" | "ad";

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: "glossary", label: "ABBREVIATIONS", color: "#00d4ff" },
  { id: "ports", label: "PORTS", color: "#00ff9d" },
  { id: "subnetting", label: "SUBNETTING", color: "#ffd700" },
  { id: "ad", label: "AD TABLE", color: "#ff3e8e" },
];

// ── Glossary Tab ────────────────────────────────────────────────────────

function GlossaryTab() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(GLOSSARY.map((g) => g.category))).sort()],
    []
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GLOSSARY.filter((g) => {
      if (category !== "all" && g.category !== category) return false;
      if (!q) return true;
      return (
        g.abbr.toLowerCase().includes(q) ||
        g.full.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q)
      );
    });
  }, [search, category]);

  return (
    <div>
      {/* Search */}
      <input
        type="text"
        placeholder="Search abbreviations..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-md font-mono text-sm text-white mb-4 transition-all"
        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
      />

      {/* Category chips */}
      <div className="flex gap-1.5 mb-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="rounded-full px-3 py-1 text-[10px] font-mono transition-all capitalize whitespace-nowrap"
            style={{
              background: category === cat ? "#00d4ff18" : "transparent",
              border: `1px solid ${category === cat ? "#00d4ff44" : "rgba(255,255,255,0.06)"}`,
              color: category === cat ? "#00d4ff" : "#555",
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="text-[10px] text-gray-700 font-mono mb-2">{filtered.length} entries</div>

      {/* Glossary list */}
      <div className="flex flex-col gap-1.5">
        {filtered.map((g) => (
          <div
            key={g.abbr}
            className="rounded-lg px-3.5 py-2.5"
            style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.04)" }}
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <span className="font-mono font-bold text-accent-cyan text-sm">{g.abbr}</span>
                <span className="text-gray-400 text-xs ml-2">{g.full}</span>
              </div>
              <span
                className="text-[9px] tracking-[1px] uppercase px-1.5 py-0.5 rounded font-mono whitespace-nowrap"
                style={{ background: "rgba(255,255,255,0.03)", color: "#555" }}
              >
                {g.category}
              </span>
            </div>
            <div className="text-[12px] text-gray-600 mt-1 leading-relaxed">
              {g.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Ports Tab ────────────────────────────────────────────────────────────

function PortsTab() {
  const [search, setSearch] = useState("");
  const [transportFilter, setTransportFilter] = useState("all");

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return PORTS.filter((p) => {
      if (transportFilter !== "all" && !p.transport.includes(transportFilter)) return false;
      if (!q) return true;
      return (
        p.port.includes(q) ||
        p.protocol.toLowerCase().includes(q) ||
        p.fullName.toLowerCase().includes(q) ||
        p.notes.toLowerCase().includes(q)
      );
    });
  }, [search, transportFilter]);

  return (
    <div>
      <input
        type="text"
        placeholder="Search port, protocol, or name..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-3.5 py-2.5 rounded-md font-mono text-sm text-white mb-4 transition-all"
        style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)" }}
      />

      <div className="flex gap-1.5 mb-4">
        {["all", "TCP", "UDP"].map((t) => (
          <button
            key={t}
            onClick={() => setTransportFilter(t)}
            className="rounded-full px-3 py-1 text-[10px] font-mono transition-all"
            style={{
              background: transportFilter === t ? "#00ff9d18" : "transparent",
              border: `1px solid ${transportFilter === t ? "#00ff9d44" : "rgba(255,255,255,0.06)"}`,
              color: transportFilter === t ? "#00ff9d" : "#555",
            }}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      <div className="text-[10px] text-gray-700 font-mono mb-2">{filtered.length} entries</div>

      {/* Header */}
      <div
        className="grid gap-2 px-3 py-1.5 text-[9px] tracking-[2px] text-gray-600 uppercase font-mono"
        style={{ gridTemplateColumns: "60px 90px 55px 1fr" }}
      >
        <span>Port</span>
        <span>Protocol</span>
        <span>Type</span>
        <span>Description</span>
      </div>

      <div className="flex flex-col gap-1">
        {filtered.map((p) => (
          <div
            key={`${p.port}-${p.protocol}`}
            className="grid gap-2 px-3 py-2 rounded-md items-start"
            style={{
              gridTemplateColumns: "60px 90px 55px 1fr",
              background: "rgba(0,0,0,0.3)",
              border: "1px solid rgba(255,255,255,0.03)",
            }}
          >
            <span className="font-mono font-bold text-accent-green text-sm">{p.port}</span>
            <span className="font-mono text-xs text-white">{p.protocol}</span>
            <span className="text-[10px] text-gray-600 font-mono">{p.transport}</span>
            <div>
              <div className="text-xs text-gray-400">{p.fullName}</div>
              <div className="text-[11px] text-gray-600">{p.notes}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Subnetting Tab ───────────────────────────────────────────────────────

function SubnettingTab() {
  const [showAll, setShowAll] = useState(false);
  const entries = showAll ? SUBNET_CHART : SUBNET_CHART.filter((e) => e.cidr >= 16);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-[10px] tracking-[3px] text-gray-600 uppercase">
          CIDR / Subnet Mask Chart
        </div>
        <button
          onClick={() => setShowAll((s) => !s)}
          className="text-[10px] font-mono text-accent-cyan"
        >
          {showAll ? "Show common (/16-/32)" : "Show all (/8-/32)"}
        </button>
      </div>

      {/* Header */}
      <div
        className="grid gap-1 px-3 py-1.5 text-[9px] tracking-[1.5px] text-gray-600 uppercase font-mono"
        style={{ gridTemplateColumns: "45px 1fr 1fr 70px 65px" }}
      >
        <span>CIDR</span>
        <span>Mask</span>
        <span>Wildcard</span>
        <span>Hosts</span>
        <span>Block</span>
      </div>

      <div className="flex flex-col gap-0.5">
        {entries.map((e) => {
          const highlight = [24, 25, 26, 27, 28, 29, 30].includes(e.cidr);
          return (
            <div
              key={e.cidr}
              className="grid gap-1 px-3 py-1.5 rounded text-xs font-mono items-center"
              style={{
                gridTemplateColumns: "45px 1fr 1fr 70px 65px",
                background: highlight ? "rgba(255,215,0,0.04)" : "rgba(0,0,0,0.25)",
                border: highlight ? "1px solid rgba(255,215,0,0.1)" : "1px solid transparent",
              }}
            >
              <span className="text-accent-cyan font-bold">/{e.cidr}</span>
              <span className="text-gray-300">{e.mask}</span>
              <span className="text-gray-500">{e.wildcard}</span>
              <span className="text-gray-400">{e.usableHosts.toLocaleString()}</span>
              <span className="text-gray-500">{e.blockSize.toLocaleString()}</span>
            </div>
          );
        })}
      </div>

      {/* Quick formulas */}
      <div className="mt-6 rounded-lg p-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-[10px] tracking-[3px] text-accent-gold uppercase mb-3 font-semibold">
          Quick Formulas
        </div>
        <div className="flex flex-col gap-2 text-[12px] text-gray-400 font-mono leading-relaxed">
          <div><span className="text-accent-cyan">Usable Hosts</span> = 2^(32 − CIDR) − 2</div>
          <div><span className="text-accent-cyan">Block Size</span> = 256 − last non-zero mask octet</div>
          <div><span className="text-accent-cyan">Wildcard Mask</span> = 255.255.255.255 − Subnet Mask</div>
          <div><span className="text-accent-cyan">Network Address</span> = IP AND Subnet Mask</div>
          <div><span className="text-accent-cyan">Broadcast</span> = IP OR Wildcard Mask</div>
          <div><span className="text-accent-cyan">First Usable</span> = Network Address + 1</div>
          <div><span className="text-accent-cyan">Last Usable</span> = Broadcast − 1</div>
          <div className="mt-2 text-gray-600 text-[11px]">
            For VLSM: always allocate largest subnets first and align to the next boundary.
          </div>
        </div>
      </div>

      {/* Binary powers cheat sheet */}
      <div className="mt-4 rounded-lg p-4" style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="text-[10px] tracking-[3px] text-accent-gold uppercase mb-3 font-semibold">
          Powers of 2
        </div>
        <div className="grid grid-cols-4 gap-1 text-[11px] font-mono">
          {[0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((n) => (
            <div key={n} className="flex justify-between px-2 py-0.5 rounded" style={{ background: "rgba(0,0,0,0.25)" }}>
              <span className="text-gray-600">2^{n}</span>
              <span className="text-gray-300">{Math.pow(2, n).toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── AD Tab ───────────────────────────────────────────────────────────────

function ADTab() {
  return (
    <div>
      <div className="text-[10px] tracking-[3px] text-gray-600 uppercase mb-3">
        Administrative Distance — Lower is More Trusted
      </div>
      <div className="flex flex-col gap-0.5">
        {AD_CHART.map((entry) => (
          <div
            key={entry.source}
            className="flex justify-between items-center px-3 py-2 rounded-md text-sm"
            style={{
              background: entry.ad === 0 ? "rgba(0,255,157,0.04)" : "rgba(0,0,0,0.25)",
              border: entry.ad === 0 ? "1px solid rgba(0,255,157,0.1)" : "1px solid transparent",
            }}
          >
            <span className="text-gray-300">{entry.source}</span>
            <span
              className="font-mono font-bold"
              style={{ color: entry.ad <= 1 ? "#00ff9d" : entry.ad < 120 ? "#00d4ff" : entry.ad < 200 ? "#ffd700" : "#ff3e8e" }}
            >
              {entry.ad}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────

export default function ReferenceView() {
  const [activeTab, setActiveTab] = useState<Tab>("glossary");

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-3">
        <BackLink href="/" />
      </div>

      <div className="text-center mb-6">
        <h1 className="text-[clamp(22px,5vw,32px)] font-extrabold text-white font-mono mb-1">
          <span className="text-accent-cyan">QUICK</span> REFERENCE
        </h1>
        <p className="text-gray-600 text-xs">Abbreviations, ports, subnetting, and AD — all in one place.</p>
      </div>

      {/* Tab selector */}
      <div className="flex gap-1.5 mb-6 flex-wrap justify-center">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className="rounded-md px-3.5 py-2 font-mono text-[11px] tracking-[1px] transition-all"
            style={{
              background: activeTab === tab.id ? `${tab.color}15` : "rgba(0,0,0,0.3)",
              border: `1px solid ${activeTab === tab.id ? tab.color + "55" : "rgba(255,255,255,0.06)"}`,
              color: activeTab === tab.id ? tab.color : "#555",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "glossary" && <GlossaryTab />}
      {activeTab === "ports" && <PortsTab />}
      {activeTab === "subnetting" && <SubnettingTab />}
      {activeTab === "ad" && <ADTab />}
    </div>
  );
}
