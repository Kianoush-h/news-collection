"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  unstable_retry,
}: {
  error: Error & { digest?: string };
  unstable_retry: () => void;
}) {
  useEffect(() => {
    console.error("[Crisis Watch] Route error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-slide-in">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-accent-red/20 blur-3xl rounded-full" />
          <span className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-red/15 border border-accent-red/30">
            <svg
              className="w-6 h-6 text-accent-red"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 9v4M12 17h.01M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            </svg>
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            Something broke on this page
          </h1>
          <p className="text-sm text-muted-light leading-relaxed">
            Live data feeds occasionally hiccup. Retry usually fixes it. If it
            doesn&apos;t, the home dashboard is always available.
          </p>
          {error.digest && (
            <p className="text-[10px] font-mono text-muted pt-2">
              ref: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-center pt-2">
          <button
            onClick={() => unstable_retry()}
            className="px-4 py-2 rounded-xl bg-accent-red/15 border border-accent-red/30 text-sm font-semibold text-accent-red hover:bg-accent-red/25 transition-colors"
          >
            Try again
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl glass-card text-sm font-semibold hover:border-accent-blue/40 transition-colors"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}
