"use client";

export function StatBox({
  label,
  value,
  color = "#00ff9d",
  small = false,
}: {
  label: string;
  value: string | number;
  color?: string;
  small?: boolean;
}) {
  return (
    <div
      className="rounded-md text-center"
      style={{
        background: "rgba(0,0,0,0.4)",
        border: `1px solid ${color}25`,
        padding: small ? "8px 12px" : "12px 16px",
        minWidth: small ? "70px" : "90px",
      }}
    >
      <div className="text-[10px] tracking-[2px] uppercase text-gray-600 mb-0.5">
        {label}
      </div>
      <div
        className="font-mono font-bold"
        style={{ fontSize: small ? "18px" : "24px", color }}
      >
        {value}
      </div>
    </div>
  );
}

export function Badge({ text, color }: { text: string; color: string }) {
  return (
    <span
      className="inline-block text-[9px] tracking-[2px] uppercase px-2 py-0.5 rounded font-semibold"
      style={{
        background: `${color}15`,
        color,
        border: `1px solid ${color}30`,
      }}
    >
      {text}
    </span>
  );
}

export function BackButton({
  onClick,
  label = "← BACK",
}: {
  onClick: () => void;
  label?: string;
}) {
  return (
    <button
      onClick={onClick}
      className="bg-transparent border border-white/[0.08] rounded-md text-gray-600 font-mono text-[11px] tracking-[2px] px-4 py-2 cursor-pointer transition-all hover:border-white/20 hover:text-gray-400"
    >
      {label}
    </button>
  );
}

export function ModeButton({
  icon,
  label,
  desc,
  color,
  onClick,
}: {
  icon: string;
  label: string;
  desc: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group text-left rounded-[10px] p-[18px] cursor-pointer transition-all duration-200 flex items-center gap-4"
      style={{
        background: "rgba(0,0,0,0.3)",
        border: `1px solid ${color}20`,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = `${color}55`;
        e.currentTarget.style.background = `${color}0a`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = `${color}20`;
        e.currentTarget.style.background = "rgba(0,0,0,0.3)";
      }}
    >
      <span className="text-[22px] font-mono" style={{ color }}>
        {icon}
      </span>
      <div>
        <div
          className="font-mono font-bold text-sm tracking-[1px]"
          style={{ color }}
        >
          {label}
        </div>
        <div className="text-gray-600 text-xs mt-0.5">{desc}</div>
      </div>
    </button>
  );
}
