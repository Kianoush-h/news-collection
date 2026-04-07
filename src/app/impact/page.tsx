"use client";

import StatCard from "@/components/StatCard";
import LiveChart from "@/components/LiveChart";
import { IconGas, IconPlane, IconPackage, IconBarChart } from "@/components/Icons";
import ImpactCalculator from "@/components/ImpactCalculator";
import ShareButton from "@/components/ShareButton";
import { useClientData } from "@/hooks/useClientData";
import {
  generateGasPriceHistory,
  gasPricesByState,
  commodityPrices,
} from "@/lib/mock-data";

export default function ImpactPage() {
  const gasData = useClientData(generateGasPriceHistory);

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            <span className="gradient-text-amber">War Impact</span> on Daily Life
          </h1>
          <p className="text-muted text-sm mt-1">
            How the Iran-US conflict is affecting prices, travel, and everyday life
          </p>
        </div>
        <ShareButton title="War Impact on Daily Life — Gas Prices, Flights & Costs" variant="pill" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="US Avg Gas Price"
          value="$5.89/gal"
          change="+70% since Feb 27"
          changeType="up"
          icon={<IconGas className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Flights Disrupted"
          value="1,847"
          change="This week"
          changeType="up"
          icon={<IconPlane className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="Shipping Delays"
          value="14+ days"
          change="Cape reroute"
          changeType="up"
          icon={<IconPackage className="w-4 h-4" />}
          accentColor="cyan"
        />
        <StatCard
          label="Consumer Confidence"
          value="62.1"
          change="-28.4 pts from Feb"
          changeType="up"
          icon={<IconBarChart className="w-4 h-4" />}
          accentColor="red"
        />
      </div>

      {/* Gas Price Chart */}
      {gasData && (
        <LiveChart
          data={gasData}
          title="US Average Gas Price"
          subtitle="Price per gallon since Feb 20"
          color="#ffb800"
          unit="$"
          height={260}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Prices by State */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-card-border">
            <h3 className="text-sm font-bold">Gas Prices by State</h3>
            <p className="text-[11px] text-muted mt-0.5">Top 10 highest prices</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">#</th>
                  <th className="text-left px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">State</th>
                  <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Price/Gal</th>
                  <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Since Feb 27</th>
                </tr>
              </thead>
              <tbody>
                {gasPricesByState.map((row, i) => (
                  <tr key={row.state} className="border-b border-card-border table-row-hover">
                    <td className="px-5 py-2.5 text-muted font-mono text-xs">{i + 1}</td>
                    <td className="px-5 py-2.5 font-medium">{row.state}</td>
                    <td className="px-5 py-2.5 text-right font-mono font-bold tabular-nums">
                      ${row.price.toFixed(2)}
                    </td>
                    <td className="px-5 py-2.5 text-right font-mono text-accent-red tabular-nums text-xs">
                      {row.change}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Commodity Prices */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-card-border">
            <h3 className="text-sm font-bold">Commodity Prices</h3>
            <p className="text-[11px] text-muted mt-0.5">Changes since pre-conflict (Feb 27)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-card-border">
                  <th className="text-left px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Commodity</th>
                  <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Current</th>
                  <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Change</th>
                  <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">%</th>
                </tr>
              </thead>
              <tbody>
                {commodityPrices.map((row) => (
                  <tr key={row.name} className="border-b border-card-border table-row-hover">
                    <td className="px-5 py-3 font-medium">{row.name}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold tabular-nums">{row.value}</td>
                    <td className="px-5 py-3 text-right font-mono text-accent-red tabular-nums text-xs">{row.change}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red">
                        {row.pct}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Flight Disruptions */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">Flight & Travel Disruptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "No-Fly Zones Active",
              value: "Iran, Iraq, Syria",
              sub: "All commercial airspace closed",
              color: "from-red-500/10 to-transparent",
              textColor: "text-accent-red",
            },
            {
              label: "Airlines Affected",
              value: "38",
              sub: "Rerouting Middle East flights",
              color: "from-amber-500/10 to-transparent",
              textColor: "text-accent-amber",
            },
            {
              label: "Avg Ticket Price Change",
              value: "+34%",
              sub: "For routes through/near region",
              color: "from-red-500/10 to-transparent",
              textColor: "text-accent-red",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`relative overflow-hidden rounded-xl border border-card-border p-4 bg-gradient-to-br ${item.color}`}
            >
              <div className="text-[10px] text-muted uppercase tracking-wider font-semibold mb-2">
                {item.label}
              </div>
              <div className={`text-xl font-bold ${item.textColor}`}>
                {item.value}
              </div>
              <div className="text-[11px] text-muted mt-1">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Personal Impact Calculator */}
      <ImpactCalculator />
    </div>
  );
}
