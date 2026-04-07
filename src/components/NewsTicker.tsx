"use client";

import { useState } from "react";
import { ShareRow } from "./ShareButton";

interface NewsItem {
  id: number;
  time: string;
  source: string;
  headline: string;
  urgency: "breaking" | "urgent" | "normal";
}

const MOCK_NEWS: NewsItem[] = [
  {
    id: 1,
    time: "2 min ago",
    source: "Reuters",
    headline: "Iran's acting Supreme Leader rejects US ceasefire proposal, demands 'permanent solution'",
    urgency: "breaking",
  },
  {
    id: 2,
    time: "18 min ago",
    source: "AP",
    headline: "Pentagon moves additional carrier strike group toward Persian Gulf",
    urgency: "urgent",
  },
  {
    id: 3,
    time: "34 min ago",
    source: "Al Jazeera",
    headline: "Pakistan-mediated talks in Islamabad end without agreement on 45-day ceasefire",
    urgency: "breaking",
  },
  {
    id: 4,
    time: "1 hr ago",
    source: "CNN",
    headline: "Oil surges past $142/barrel as Strait of Hormuz remains closed on day 38",
    urgency: "urgent",
  },
  {
    id: 5,
    time: "1 hr ago",
    source: "BBC",
    headline: "European nations announce emergency fuel rationing plans amid supply disruption",
    urgency: "urgent",
  },
  {
    id: 6,
    time: "2 hr ago",
    source: "NPR",
    headline: "Trump sets 8pm ET deadline for Iran to reopen Strait of Hormuz or face infrastructure strikes",
    urgency: "breaking",
  },
  {
    id: 7,
    time: "3 hr ago",
    source: "Bloomberg",
    headline: "Global shipping insurers suspend coverage for Persian Gulf transit",
    urgency: "normal",
  },
  {
    id: 8,
    time: "4 hr ago",
    source: "Reuters",
    headline: "China calls for 'immediate de-escalation', offers to mediate alongside Pakistan",
    urgency: "normal",
  },
];

export default function NewsTicker() {
  const [news] = useState<NewsItem[]>(MOCK_NEWS);

  return (
    <div className="glass-card overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-card-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-live" />
          <h3 className="text-sm font-bold">Live Feed</h3>
        </div>
        <span className="text-[10px] text-muted font-mono">Auto-updating</span>
      </div>

      {/* News Items */}
      <div className="flex-1 overflow-y-auto">
        {news.map((item, i) => (
          <div
            key={item.id}
            className="relative px-4 py-3.5 border-b border-card-border hover:bg-white/[0.02] transition-colors cursor-pointer group animate-slide-in"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Urgency indicator bar */}
            <div
              className={`absolute left-0 top-0 bottom-0 w-[3px] rounded-r transition-opacity ${
                item.urgency === "breaking"
                  ? "bg-accent-red"
                  : item.urgency === "urgent"
                  ? "bg-accent-amber"
                  : "bg-transparent"
              }`}
            />

            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-[10px] text-muted font-mono tabular-nums">
                {item.time}
              </span>
              <span className="w-1 h-1 rounded-full bg-card-border" />
              <span className="text-[10px] font-semibold text-accent-blue">
                {item.source}
              </span>
              {item.urgency !== "normal" && (
                <span
                  className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    item.urgency === "breaking"
                      ? "bg-accent-red/15 text-accent-red"
                      : "bg-accent-amber/15 text-accent-amber"
                  }`}
                >
                  {item.urgency}
                </span>
              )}
            </div>
            <p className="text-[13px] leading-[1.4] text-foreground/90 group-hover:text-foreground transition-colors">
              {item.headline}
            </p>
            <div className="mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <ShareRow title={`${item.headline} — Crisis Watch`} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
