export function CliBlock({ text }: { text: string }) {
  return (
    <div
      className="rounded-lg mb-4 overflow-x-auto"
      style={{
        background: "#0a0e0a",
        border: "1px solid rgba(0,255,157,0.15)",
      }}
    >
      {/* Terminal title bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5"
        style={{
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.02)",
        }}
      >
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#febc2e" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-2 text-[10px] tracking-[1px] text-gray-700 font-mono uppercase">
          CLI
        </span>
      </div>
      <pre
        className="font-mono whitespace-pre-wrap break-words px-4 py-3 m-0"
        style={{
          fontSize: "clamp(11px, 2.6vw, 13px)",
          lineHeight: 1.6,
          color: "#00ff9d",
        }}
      >
        {text}
      </pre>
    </div>
  );
}
