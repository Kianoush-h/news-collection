"use client";

import { useLiveData } from "@/hooks/useLiveData";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const { data: meta } = useLiveData<{ dayOfConflict: number }>("/api/meta", 3600000);

  return (
    <header className="sticky top-0 z-40 bg-background/70 backdrop-blur-xl border-b border-card-border px-3 sm:px-6 py-3 flex items-center justify-between gap-2">
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Hamburger — mobile only */}
        <button
          className="lg:hidden p-2 -ml-1 rounded-lg text-muted-light hover:text-foreground hover:bg-white/[0.06] transition-colors"
          onClick={onMenuToggle}
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        {/* Live Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2 bg-accent-red/10 border border-accent-red/20 rounded-full px-2.5 sm:px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-live" />
          <span className="text-[11px] font-bold text-accent-red uppercase tracking-widest">
            Live
          </span>
        </div>
        {/* Conflict Day */}
        <div className="hidden sm:flex items-center gap-2">
          <div className="w-px h-4 bg-card-border" />
          <span className="text-xs text-muted-light font-medium">
            Day <span className="text-foreground font-bold">{meta?.dayOfConflict ?? "—"}</span> of Conflict
          </span>
        </div>
      </div>
    </header>
  );
}
