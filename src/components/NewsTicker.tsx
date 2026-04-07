"use client";

import { ShareRow } from "./ShareButton";
import { useLiveData } from "@/hooks/useLiveData";

interface NewsItem {
  id: number;
  time: string;
  source: string;
  headline: string;
  urgency: "breaking" | "urgent" | "normal";
  url?: string;
}

interface NewsResponse {
  ticker: NewsItem[];
}

export default function NewsTicker() {
  const { data, loading } = useLiveData<NewsResponse>("/api/news", 120000);
  const news = data?.ticker ?? [];

  return (
    <div className="glass-card overflow-hidden flex flex-col h-full">
      {/* Header */}
      <div className="px-4 py-3.5 border-b border-card-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-live" />
          <h3 className="text-sm font-bold">Live Feed</h3>
        </div>
        <span className="text-[10px] text-muted font-mono">GDELT — Auto-updating</span>
      </div>

      {/* News Items */}
      <div className="flex-1 overflow-y-auto">
        {loading && news.length === 0 && (
          <div className="p-6 text-center text-muted text-sm">
            <div className="w-4 h-4 border-2 border-accent-red/30 border-t-accent-red rounded-full animate-spin mx-auto mb-2" />
            Loading live news...
          </div>
        )}
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
        {!loading && news.length === 0 && (
          <div className="p-6 text-center text-muted text-sm">
            No news available at this time.
          </div>
        )}
      </div>
    </div>
  );
}
