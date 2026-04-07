"use client";

import { useEffect, useState } from "react";

interface HeaderProps {
  onMenuToggle?: () => void;
}

export default function Header({ onMenuToggle }: HeaderProps) {
  const [time, setTime] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZoneName: "short",
        })
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

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
            Day <span className="text-foreground font-bold">38</span> of Conflict
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-5">
        {/* Deadline */}
        <div className="flex items-center gap-2.5 bg-accent-amber/5 border border-accent-amber/15 rounded-lg px-2 sm:px-3 py-1.5">
          <div className="flex flex-col items-end">
            <span className="text-[8px] sm:text-[9px] font-bold text-accent-amber/70 uppercase tracking-widest leading-none mb-0.5">
              <span className="hidden sm:inline">Hormuz </span>Deadline
            </span>
            <DeadlineCountdown />
          </div>
        </div>
        {/* Clock — hidden on mobile */}
        <span className="hidden sm:inline text-xs font-mono text-muted tabular-nums">
          {mounted ? time : "\u00A0"}
        </span>
      </div>
    </header>
  );
}

function DeadlineCountdown() {
  const [remaining, setRemaining] = useState<string>("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const deadline = new Date("2026-04-07T20:00:00-04:00");

    const update = () => {
      const now = new Date();
      const diff = deadline.getTime() - now.getTime();

      if (diff <= 0) {
        setRemaining("PASSED");
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setRemaining(
        `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
      );
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const isPassed = remaining === "PASSED";

  return (
    <span
      className={`font-mono font-black text-sm tabular-nums leading-none ${
        isPassed ? "text-accent-red animate-pulse-glow" : "text-accent-amber animate-count-glow"
      }`}
    >
      {mounted ? remaining : "--:--:--"}
    </span>
  );
}
