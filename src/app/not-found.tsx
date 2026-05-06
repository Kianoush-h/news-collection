import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found",
  description:
    "The page you are looking for could not be found. Return to the Crisis Watch dashboard.",
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 animate-slide-in">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 bg-accent-red/20 blur-3xl rounded-full" />
          <span className="relative text-7xl font-black tracking-tighter gradient-text-red">
            404
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">
            That page is off the map
          </h1>
          <p className="text-sm text-muted-light leading-relaxed">
            The route you followed doesn&apos;t exist on Crisis Watch. It may
            have been moved, retired, or never existed in the first place.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <Link
            href="/"
            className="glass-card p-3 hover:border-accent-blue/40 transition-colors text-sm font-semibold"
          >
            Conflict Overview
          </Link>
          <Link
            href="/blog"
            className="glass-card p-3 hover:border-accent-blue/40 transition-colors text-sm font-semibold"
          >
            Live Blog
          </Link>
          <Link
            href="/hormuz"
            className="glass-card p-3 hover:border-accent-blue/40 transition-colors text-sm font-semibold"
          >
            Strait of Hormuz
          </Link>
          <Link
            href="/conflict-map"
            className="glass-card p-3 hover:border-accent-blue/40 transition-colors text-sm font-semibold"
          >
            Conflict Map
          </Link>
        </div>
      </div>
    </div>
  );
}
