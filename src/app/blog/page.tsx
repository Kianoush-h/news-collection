"use client";

import { useLiveData } from "@/hooks/useLiveData";
import ShareButton, { ShareRow } from "@/components/ShareButton";

interface BlogPost {
  id: string;
  time: string;
  category: "breaking" | "analysis" | "update" | "markets" | "diplomacy";
  title: string;
  body: string;
  source?: string;
  url?: string;
}

interface NewsResponse {
  blog: BlogPost[];
}

export default function BlogPage() {
  const { data, loading, refresh, lastUpdated } = useLiveData<NewsResponse>("/api/news", 180000);
  const posts = data?.blog ?? [];

  const categoryStyle = (cat: string) => {
    switch (cat) {
      case "breaking": return "bg-accent-red/15 text-accent-red";
      case "analysis": return "bg-accent-purple/15 text-accent-purple";
      case "markets": return "bg-accent-green/15 text-accent-green";
      case "diplomacy": return "bg-accent-blue/15 text-accent-blue";
      default: return "bg-accent-cyan/15 text-accent-cyan";
    }
  };

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const diff = Math.floor((Date.now() - d.getTime()) / 1000);
    if (diff < 60) return "Just now";
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  const formatCountdown = () => {
    if (!lastUpdated) return "—";
    const elapsed = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
    const remaining = Math.max(0, 180 - elapsed);
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="gradient-text-red">Live Blog</span> — Iran-US Conflict
          </h1>
          <p className="text-muted text-sm mt-1">
            Live coverage from GDELT — real articles from global news sources
          </p>
        </div>
        <ShareButton
          title="Crisis Watch Live Blog — Iran-US Conflict Updates"
          variant="pill"
        />
      </div>

      {/* Auto-update banner */}
      <div className="glass-card p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent-red animate-pulse-live flex-shrink-0" />
          <span className="text-sm font-semibold">Auto-Updating</span>
          <span className="text-xs text-muted hidden sm:inline">Refreshes every 3 minutes</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted">Next refresh in</span>
          <span className="font-mono text-sm text-accent-amber font-bold tabular-nums">
            {formatCountdown()}
          </span>
          <button
            onClick={refresh}
            className="text-xs bg-white/[0.05] hover:bg-white/[0.1] border border-card-border rounded-lg px-3 py-1.5 text-muted hover:text-foreground transition-all"
          >
            Refresh now
          </button>
        </div>
      </div>

      {/* Articles count */}
      <div className="text-xs text-muted">
        {loading && posts.length === 0 ? "Loading articles..." : `${posts.length} articles from global sources`}
      </div>

      {/* Blog Posts */}
      <div className="space-y-4">
        {loading && posts.length === 0 && (
          <div className="glass-card p-8 text-center text-muted">
            <div className="w-5 h-5 border-2 border-accent-red/30 border-t-accent-red rounded-full animate-spin mx-auto mb-3" />
            Fetching live articles from GDELT...
          </div>
        )}
        {posts.map((post) => (
          <article
            key={post.id}
            className="glass-card overflow-hidden"
          >
            <div className="p-5">
              {/* Meta row */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-[10px] font-mono text-muted tabular-nums">
                  {formatTime(post.time)}
                </span>
                <span className="w-1 h-1 rounded-full bg-card-border" />
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${categoryStyle(post.category)}`}>
                  {post.category}
                </span>
                {post.source && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-card-border" />
                    <span className="text-[10px] font-semibold text-accent-blue">
                      {post.source}
                    </span>
                  </>
                )}
              </div>

              {/* Title */}
              <h2 className="text-base font-bold leading-snug mb-2">
                {post.url ? (
                  <a href={post.url} target="_blank" rel="noopener noreferrer" className="hover:text-accent-blue transition-colors">
                    {post.title}
                  </a>
                ) : (
                  post.title
                )}
              </h2>

              {/* Body */}
              <p className="text-sm text-foreground/70 leading-relaxed">
                {post.body}
              </p>

              {/* Share row */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-card-border">
                <span className="text-[10px] text-muted">
                  {post.source ?? "Source"}
                </span>
                <ShareRow title={`${post.title} — Crisis Watch`} />
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
