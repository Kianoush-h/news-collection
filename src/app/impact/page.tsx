"use client";

import StatCard from "@/components/StatCard";
import LiveChart from "@/components/LiveChart";
import { IconGas, IconPlane, IconPackage, IconBarChart } from "@/components/Icons";
import ImpactCalculator from "@/components/ImpactCalculator";
import ShareButton from "@/components/ShareButton";
import { useLiveData, useFetchOnce } from "@/hooks/useLiveData";

interface PricesData {
  gasoline: { price: number; change: number; changePct: number };
  oil: { brent: { price: number; change: number; changePct: number }; wti: { price: number; change: number; changePct: number } };
  naturalGas: { price: number; change: number; changePct: number };
  gold: { price: number; change: number; changePct: number };
  wheat: { price: number; change: number; changePct: number };
  copper: { price: number; change: number; changePct: number };
}

interface MetaData {
  flightsDisrupted: number;
  consumerConfidence: number;
  gasPricesByState: { state: string; price: number; change: string }[];
  flightInfo: { label: string; value: string; sub: string; color: string; textColor: string }[];
}

interface HistoryData {
  data: { time: string; value: number }[];
}

export default function ImpactPage() {
  const { data: prices } = useLiveData<PricesData>("/api/prices", 60000);
  const { data: meta } = useLiveData<MetaData>("/api/meta", 3600000);
  const { data: gasHistory } = useFetchOnce<HistoryData>("/api/history?symbol=RB=F&days=60");

  const fmt = (v: number | undefined, prefix = "$") =>
    v != null ? `${prefix}${v.toFixed(2)}` : "—";
  const dir = (v: number | undefined) => (v != null ? (v >= 0 ? "up" : "down") : "neutral") as "up" | "down" | "neutral";

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
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
          label="Gasoline Futures"
          value={fmt(prices?.gasoline.price)}
          change={prices?.gasoline.changePct != null ? `${prices.gasoline.changePct >= 0 ? "+" : ""}${prices.gasoline.changePct.toFixed(1)}% today` : ""}
          changeType={dir(prices?.gasoline.change)}
          icon={<IconGas className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Flights Disrupted"
          value={meta ? meta.flightsDisrupted.toLocaleString() : "—"}
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
          value={meta ? `${meta.consumerConfidence}` : "—"}
          change="-28.4 pts from Feb"
          changeType="up"
          icon={<IconBarChart className="w-4 h-4" />}
          accentColor="red"
        />
      </div>

      {/* Gas Price Chart — LIVE */}
      <LiveChart
        data={gasHistory?.data ?? []}
        title="RBOB Gasoline Futures"
        subtitle="Price per gallon — 60 day history"
        color="#ffb800"
        unit="$"
        height={260}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gas Prices by State — curated */}
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
                {(meta?.gasPricesByState ?? []).map((row, i) => (
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

        {/* Commodity Prices — LIVE */}
        <div className="glass-card overflow-hidden">
          <div className="px-5 py-4 border-b border-card-border">
            <h3 className="text-sm font-bold">Commodity Prices</h3>
            <p className="text-[11px] text-muted mt-0.5">Live futures data</p>
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
                {prices && [
                  { name: "Brent Crude", ...prices.oil.brent },
                  { name: "WTI Crude", ...prices.oil.wti },
                  { name: "Natural Gas", ...prices.naturalGas },
                  { name: "Gold", ...prices.gold },
                  { name: "Wheat", ...prices.wheat },
                  { name: "Copper", ...prices.copper },
                ].map((row) => (
                  <tr key={row.name} className="border-b border-card-border table-row-hover">
                    <td className="px-5 py-3 font-medium">{row.name}</td>
                    <td className="px-5 py-3 text-right font-mono font-bold tabular-nums">${row.price.toFixed(2)}</td>
                    <td className={`px-5 py-3 text-right font-mono tabular-nums text-xs ${row.change >= 0 ? "text-accent-red" : "text-accent-green"}`}>
                      {row.change >= 0 ? "+" : ""}${row.change.toFixed(2)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${row.changePct >= 0 ? "bg-accent-red/10 text-accent-red" : "bg-accent-green/10 text-accent-green"}`}>
                        {row.changePct >= 0 ? "+" : ""}{row.changePct.toFixed(1)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Flight Disruptions — curated */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">Flight & Travel Disruptions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(meta?.flightInfo ?? []).map((item) => (
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
