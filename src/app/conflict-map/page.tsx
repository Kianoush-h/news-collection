"use client";

import StatCard from "@/components/StatCard";
import ShareButton from "@/components/ShareButton";
import { IconCalendar, IconTarget, IconMissile, IconDove } from "@/components/Icons";
import { useLiveData } from "@/hooks/useLiveData";
import dynamic from "next/dynamic";

const ConflictMapView = dynamic(() => import("@/components/ConflictMapView"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] glass-card flex items-center justify-center text-muted">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-accent-red/30 border-t-accent-red rounded-full animate-spin" />
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

interface MetaData {
  dayOfConflict: number;
  majorStrikes: string;
  retaliations: string;
  ceasefireAttempts: number;
  conflictEvents: {
    date: string;
    title: string;
    description: string;
    type: string;
    lat: number;
    lng: number;
    severity: string;
  }[];
}

export default function ConflictMapPage() {
  const { data: meta } = useLiveData<MetaData>("/api/meta", 3600000);
  const events = meta?.conflictEvents ?? [];

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="gradient-text-red">Conflict</span> Live Map & Timeline
          </h1>
          <p className="text-muted text-sm mt-1">
            Interactive map of strikes, events, and diplomatic developments
          </p>
        </div>
        <ShareButton title="Iran-US Conflict Live Map & Timeline — Strikes & Events" variant="pill" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Days of Conflict"
          value={meta ? `${meta.dayOfConflict}` : "—"}
          subtext="Feb 28 — Present"
          icon={<IconCalendar className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="Major Strikes"
          value={meta?.majorStrikes ?? "—"}
          change="By US/Israel on Iran"
          icon={<IconTarget className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="Iranian Retaliations"
          value={meta?.retaliations ?? "—"}
          change="Missiles & drones"
          icon={<IconMissile className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Ceasefire Attempts"
          value={meta ? `${meta.ceasefireAttempts}` : "—"}
          change="All rejected"
          changeType="up"
          icon={<IconDove className="w-4 h-4" />}
          accentColor="blue"
        />
      </div>

      {/* Map */}
      <ConflictMapView />

      {/* Timeline */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-bold">Conflict Timeline</h3>
          <p className="text-[11px] text-muted mt-0.5">Key events since the start of hostilities</p>
        </div>
        <div className="p-5">
          <div className="relative">
            <div className="absolute left-[18px] top-2 bottom-2 w-px bg-gradient-to-b from-accent-red via-accent-amber to-accent-blue" />

            <div className="space-y-8">
              {events.map((event, i) => {
                const severityColor =
                  event.severity === "critical"
                    ? "bg-accent-red"
                    : event.severity === "high"
                    ? "bg-accent-amber"
                    : "bg-accent-blue";

                const severityGlow =
                  event.severity === "critical"
                    ? "shadow-accent-red/30"
                    : event.severity === "high"
                    ? "shadow-accent-amber/30"
                    : "shadow-accent-blue/30";

                const typeLabel =
                  event.type === "strike"
                    ? "Military"
                    : event.type === "blockade"
                    ? "Naval"
                    : event.type === "diplomatic"
                    ? "Diplomatic"
                    : "Economic";

                const typeColor =
                  event.type === "strike"
                    ? "bg-red-500/10 text-accent-red"
                    : event.type === "blockade"
                    ? "bg-cyan-500/10 text-accent-cyan"
                    : event.type === "diplomatic"
                    ? "bg-blue-500/10 text-accent-blue"
                    : "bg-amber-500/10 text-accent-amber";

                return (
                  <div
                    key={i}
                    className="relative flex gap-4 pl-10 group animate-slide-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <div
                      className={`absolute left-[13px] top-1 w-3 h-3 rounded-full ${severityColor} ring-[3px] ring-background shadow-lg ${severityGlow}`}
                    />

                    <div className="flex-1 pb-2">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-xs font-mono text-muted-light tabular-nums">
                          {event.date}
                        </span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${typeColor}`}>
                          {typeLabel}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                            event.severity === "critical"
                              ? "bg-accent-red/10 text-accent-red"
                              : event.severity === "high"
                              ? "bg-accent-amber/10 text-accent-amber"
                              : "bg-accent-blue/10 text-accent-blue"
                          }`}
                        >
                          {event.severity}
                        </span>
                      </div>
                      <h4 className="text-sm font-semibold text-foreground group-hover:text-foreground/80 transition-colors">
                        {event.title}
                      </h4>
                      <p className="text-xs text-muted leading-relaxed mt-1">
                        {event.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Critical Event Countdown */}
      <div className="relative overflow-hidden rounded-2xl border border-accent-red/20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/50 via-red-900/20 to-orange-950/30" />
        <div className="relative p-8 text-center">
          <div className="inline-flex items-center gap-2 bg-accent-red/10 rounded-full px-3 py-1 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-accent-red animate-pulse-live" />
            <span className="text-[10px] text-accent-red font-bold uppercase tracking-widest">
              Next Critical Event
            </span>
          </div>
          <h3 className="text-xl font-bold">
            Trump&apos;s Strait of Hormuz Deadline
          </h3>
          <div className="text-muted text-sm mt-2">
            April 7, 2026 — 8:00 PM ET (Midnight GMT)
          </div>
          <div className="max-w-xl mx-auto mt-4 text-xs text-foreground/50 italic leading-relaxed">
            &ldquo;If Iran does not reopen the Strait of Hormuz by 8pm tonight, we will
            begin striking their power plants and bridges.&rdquo;
            <span className="not-italic text-muted ml-1">— President Trump</span>
          </div>
        </div>
      </div>
    </div>
  );
}
