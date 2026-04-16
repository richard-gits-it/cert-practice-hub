"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <header className="sticky top-0 z-10 backdrop-blur-md bg-bg-primary/80 border-b border-white/[0.04] mb-6 -mx-4 px-4 sm:-mx-0 sm:px-0">
      <nav className="max-w-2xl mx-auto py-3 flex items-center justify-between">
        <Link
          href="/"
          className="font-mono text-[13px] tracking-[2px] text-white hover:text-accent-cyan transition-colors"
        >
          <span className="text-accent-cyan">CERT</span>HUB
        </Link>
        <div className="flex gap-4 text-[11px] font-mono tracking-[1.5px]">
          <Link
            href="/subnet"
            className={`transition-colors ${
              pathname.startsWith("/subnet")
                ? "text-accent-green"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            SUBNET
          </Link>
          <Link
            href="/progress"
            className={`transition-colors ${
              pathname === "/progress"
                ? "text-accent-gold"
                : "text-gray-600 hover:text-gray-400"
            }`}
          >
            PROGRESS
          </Link>
        </div>
      </nav>
    </header>
  );
}
