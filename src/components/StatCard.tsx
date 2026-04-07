"use client";

import { ReactNode } from "react";
import ShareButton from "./ShareButton";

interface StatCardProps {
  label: string;
  value: string;
  change?: string;
  changeType?: "up" | "down" | "neutral";
  icon?: ReactNode;
  subtext?: string;
  accentColor?: string;
}

export default function StatCard({
  label,
  value,
  change,
  changeType = "neutral",
  icon,
  subtext,
  accentColor = "accent-blue",
}: StatCardProps) {
  const changeColor =
    changeType === "up"
      ? "text-accent-red"
      : changeType === "down"
      ? "text-accent-green"
      : "text-muted";

  return (
    <div className="glass-card group relative overflow-hidden p-4">
      {/* Subtle top accent line */}
      <div
        className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r opacity-40 group-hover:opacity-70 transition-opacity ${
          accentColor === "red"
            ? "from-red-500 to-orange-500"
            : accentColor === "amber"
            ? "from-amber-500 to-yellow-500"
            : accentColor === "green"
            ? "from-green-500 to-emerald-500"
            : accentColor === "cyan"
            ? "from-cyan-500 to-teal-500"
            : "from-blue-500 to-cyan-500"
        }`}
      />

      {/* Share button — appears on hover */}
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
        <ShareButton
          title={`${label}: ${value}${change ? ` (${change})` : ""} — Crisis Watch`}
          variant="icon"
        />
      </div>

      <div className="flex items-start justify-between mb-3">
        <span className="text-[11px] text-muted font-medium uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-muted-light">
            {icon}
          </div>
        )}
      </div>
      <div className="text-[22px] font-bold font-mono tabular-nums tracking-tight leading-none">
        {value}
      </div>
      {change && (
        <div className={`text-[11px] mt-2 font-mono ${changeColor} flex items-center gap-1`}>
          {changeType === "up" && (
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path d="M7 17l5-5 5 5M7 7l5-5 5 5" />
            </svg>
          )}
          {change}
        </div>
      )}
      {subtext && (
        <div className="text-[10px] text-muted mt-1.5">{subtext}</div>
      )}
    </div>
  );
}
