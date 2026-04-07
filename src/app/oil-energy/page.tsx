"use client";

import StatCard from "@/components/StatCard";
import LiveChart from "@/components/LiveChart";
import { IconOil, IconFlame, IconGold } from "@/components/Icons";
import ShareButton from "@/components/ShareButton";
import { useLiveData, useFetchOnce } from "@/hooks/useLiveData";

interface PricesData {
  oil: { brent: { price: number; change: number; changePct: number }; wti: { price: number; change: number; changePct: number } };
  naturalGas: { price: number; change: number; changePct: number };
  gold: { price: number; change: number; changePct: number };
  wheat: { price: number; change: number; changePct: number };
  copper: { price: number; change: number; changePct: number };
  silver: { price: number; change: number; changePct: number };
  stocks: { name: string; ticker: string; price: number; change: number; changePct: number }[];
}

interface MetaData {
  shippingRoutes: { label: string; value: string; sub: string; color: string; textColor: string }[];
}

interface HistoryData {
  data: { time: string; value: number }[];
}

export default function OilEnergyPage() {
  const { data: prices } = useLiveData<PricesData>("/api/prices", 60000);
  const { data: meta } = useLiveData<MetaData>("/api/meta", 3600000);
  const { data: oilHistory } = useFetchOnce<HistoryData>("/api/history?symbol=BZ=F&days=60");
  const { data: gasHistory } = useFetchOnce<HistoryData>("/api/history?symbol=NG=F&days=60");
  const { data: goldHistory } = useFetchOnce<HistoryData>("/api/history?symbol=GC=F&days=60");

  const fmt = (v: number | undefined, prefix = "$") =>
    v != null ? `${prefix}${v.toFixed(2)}` : "—";
  const fmtChg = (v: number | undefined, pct: number | undefined) =>
    v != null && pct != null
      ? `${v >= 0 ? "+" : ""}$${v.toFixed(2)} (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%)`
      : "";
  const dir = (v: number | undefined) => (v != null ? (v >= 0 ? "up" : "down") : "neutral") as "up" | "down" | "neutral";

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            <span className="gradient-text-green">Oil & Energy</span> Crisis Dashboard
          </h1>
          <p className="text-muted text-sm mt-1">
            Real-time energy markets, commodity prices, and stock performance
          </p>
        </div>
        <ShareButton title="Oil & Energy Crisis Dashboard — Crude, Gas, Stocks Live" variant="pill" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Brent Crude"
          value={fmt(prices?.oil.brent.price)}
          change={fmtChg(prices?.oil.brent.change, prices?.oil.brent.changePct)}
          changeType={dir(prices?.oil.brent.change)}
          icon={<IconOil className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="WTI Crude"
          value={fmt(prices?.oil.wti.price)}
          change={fmtChg(prices?.oil.wti.change, prices?.oil.wti.changePct)}
          changeType={dir(prices?.oil.wti.change)}
          icon={<IconOil className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Natural Gas"
          value={fmt(prices?.naturalGas.price)}
          change={fmtChg(prices?.naturalGas.change, prices?.naturalGas.changePct)}
          changeType={dir(prices?.naturalGas.change)}
          icon={<IconFlame className="w-4 h-4" />}
          accentColor="green"
        />
        <StatCard
          label="Gold"
          value={prices?.gold.price != null ? `$${Math.round(prices.gold.price).toLocaleString()}` : "—"}
          change={fmtChg(prices?.gold.change, prices?.gold.changePct)}
          changeType={dir(prices?.gold.change)}
          icon={<IconGold className="w-4 h-4" />}
          subtext="Safe haven demand"
          accentColor="amber"
        />
      </div>

      {/* Oil Chart */}
      <LiveChart
        data={oilHistory?.data ?? []}
        title="Brent Crude Oil"
        subtitle="Price per barrel — 60 day history"
        color="#ff3b3b"
        unit="$"
        height={300}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <LiveChart
          data={gasHistory?.data ?? []}
          title="Natural Gas"
          subtitle="$/MMBtu"
          color="#00d68f"
          unit="$"
          height={200}
        />
        <LiveChart
          data={goldHistory?.data ?? []}
          title="Gold"
          subtitle="$/oz"
          color="#ffb800"
          unit="$"
          height={200}
        />
      </div>

      {/* Energy & Defense Stocks — LIVE */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">Energy & Defense Stocks</h3>
            <p className="text-[11px] text-muted mt-0.5">Live quotes from Yahoo Finance</p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-accent-green/10 text-accent-green font-bold">Live</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Stock</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Price</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Change</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">%</th>
              </tr>
            </thead>
            <tbody>
              {(prices?.stocks ?? []).map((stock) => (
                <tr key={stock.ticker} className="border-b border-card-border table-row-hover">
                  <td className="px-5 py-3.5 font-medium">{stock.name}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold tabular-nums">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className={`px-5 py-3.5 text-right font-mono tabular-nums text-xs ${stock.change >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                    {stock.change >= 0 ? "+" : ""}${stock.change.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${stock.changePct >= 0 ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"}`}>
                      {stock.changePct >= 0 ? "+" : ""}{stock.changePct.toFixed(1)}%
                    </span>
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
          <p className="text-[11px] text-muted mt-0.5">Live futures prices</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-card-border">
                <th className="text-left px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Commodity</th>
                <th className="text-right px-5 py-3 text-[11px] text-muted font-semibold uppercase tracking-wider">Price</th>
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
              ].map((c) => (
                <tr key={c.name} className="border-b border-card-border table-row-hover">
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold tabular-nums">${c.price.toFixed(2)}</td>
                  <td className={`px-5 py-3.5 text-right font-mono tabular-nums text-xs ${c.change >= 0 ? "text-accent-green" : "text-accent-red"}`}>
                    {c.change >= 0 ? "+" : ""}${c.change.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${c.changePct >= 0 ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"}`}>
                      {c.changePct >= 0 ? "+" : ""}{c.changePct.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Routes — curated */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">Alternative Shipping Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(meta?.shippingRoutes ?? []).map((item) => (
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
              <div className="text-[11px] text-muted mt-1 leading-relaxed">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
