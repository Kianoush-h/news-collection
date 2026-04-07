"use client";

import StatCard from "@/components/StatCard";
import LiveChart from "@/components/LiveChart";
import { IconOil, IconShip, IconAnchor, IconClock } from "@/components/Icons";
import { generateShippingVolume, shipTrackingData } from "@/lib/mock-data";
import { useClientData } from "@/hooks/useClientData";
import ShareButton from "@/components/ShareButton";
import dynamic from "next/dynamic";

const HormuzMap = dynamic(() => import("@/components/HormuzMap"), {
  ssr: false,
  loading: () => (
    <div className="h-[420px] glass-card flex items-center justify-center text-muted">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 border-2 border-accent-cyan/30 border-t-accent-cyan rounded-full animate-spin" />
        <span className="text-sm">Loading map...</span>
      </div>
    </div>
  ),
});

export default function HormuzPage() {
  const shippingData = useClientData(generateShippingVolume);

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-blue">Strait of Hormuz</span> Tracker
          </h1>
          <p className="text-muted text-sm mt-1">
            Real-time monitoring of the world&apos;s most critical oil chokepoint
          </p>
        </div>
        <ShareButton title="Strait of Hormuz Live Tracker — Ship Blockade & Oil Flow" variant="pill" />
      </div>

      {/* Blockade Status Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-accent-red/20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 to-transparent" />
        <div className="relative px-5 py-4">
          <div className="flex items-center gap-3 mb-2">
            <span className="flex h-5 w-5 items-center justify-center">
              <span className="absolute h-3 w-3 rounded-full bg-accent-red/40 animate-ping" />
              <span className="relative h-2 w-2 rounded-full bg-accent-red" />
            </span>
            <span className="font-bold text-accent-red text-sm tracking-wide">STRAIT STATUS: BLOCKED</span>
            <span className="text-xs text-muted">Day 36 of IRGC naval blockade</span>
          </div>
          <p className="text-sm text-foreground/70 leading-relaxed">
            IRGC Navy has deployed mines, fast-attack boats, and anti-ship missiles.
            Commercial shipping insurance suspended for the region.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Oil Flow"
          value="0.3 mb/d"
          change="Down from 21 mb/d"
          changeType="up"
          icon={<IconOil className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="Ships Rerouted"
          value="78"
          change="Via Cape of Good Hope"
          icon={<IconShip className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          label="Ships Waiting"
          value="42"
          change="Anchored off Oman"
          icon={<IconAnchor className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Avg Delay"
          value="14+ days"
          change="Via alternative route"
          changeType="up"
          icon={<IconClock className="w-4 h-4" />}
          accentColor="red"
        />
      </div>

      {/* Map */}
      <HormuzMap />

      {/* Chart */}
      {shippingData && (
        <LiveChart
          data={shippingData}
          title="Daily Oil Flow Through Strait"
          subtitle="Million Barrels/Day"
          color="#00d4ff"
          unit=" mb/d"
          height={260}
        />
      )}

      {/* Traffic Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-bold">Shipping Traffic Comparison</h3>
          <p className="text-[11px] text-muted mt-0.5">Pre-conflict vs current figures</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Metric</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Pre-Conflict</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Current</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody>
              {shipTrackingData.map((row) => (
                <tr key={row.name} className="border-b border-card-border table-row-hover">
                  <td className="px-5 py-3.5 font-medium text-foreground/90">{row.name}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-muted tabular-nums">{row.before}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold tabular-nums">{row.now}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`inline-flex text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                      row.status === "critical"
                        ? "bg-accent-red/10 text-accent-red"
                        : "bg-accent-amber/10 text-accent-amber"
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
