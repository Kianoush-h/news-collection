"use client";

import StatCard from "@/components/StatCard";
import LiveChart from "@/components/LiveChart";
import { IconOil, IconFlame, IconGold } from "@/components/Icons";
import ShareButton from "@/components/ShareButton";
import { useClientData } from "@/hooks/useClientData";
import {
  generateOilPriceHistory,
  generateStockData,
  energyStocks,
  commodityPrices,
} from "@/lib/mock-data";

export default function OilEnergyPage() {
  const oilData = useClientData(generateOilPriceHistory);
  const natGasData = useClientData(() => generateStockData(4.3, 0.2));
  const goldData = useClientData(() => generateStockData(2833, 15));

  return (
    <div className="space-y-6 animate-slide-in">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
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
          value="$142.38"
          change="+$3.24 (+2.3%)"
          changeType="up"
          icon={<IconOil className="w-4 h-4" />}
          subtext="Highest since 2008"
          accentColor="red"
        />
        <StatCard
          label="WTI Crude"
          value="$138.92"
          change="+$2.87 (+2.1%)"
          changeType="up"
          icon={<IconOil className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Natural Gas"
          value="$8.45"
          change="+$0.34 (+4.2%)"
          changeType="up"
          icon={<IconFlame className="w-4 h-4" />}
          accentColor="green"
        />
        <StatCard
          label="Gold"
          value="$3,245"
          change="+$28 (+0.9%)"
          changeType="up"
          icon={<IconGold className="w-4 h-4" />}
          subtext="Safe haven demand"
          accentColor="amber"
        />
      </div>

      {/* Oil Chart */}
      {oilData && (
        <LiveChart
          data={oilData}
          title="Brent Crude Oil"
          subtitle="Price per barrel since Feb 20"
          color="#ff3b3b"
          unit="$"
          height={300}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {natGasData && (
          <LiveChart
            data={natGasData}
            title="Natural Gas"
            subtitle="$/MMBtu"
            color="#00d68f"
            unit="$"
            height={200}
          />
        )}
        {goldData && (
          <LiveChart
            data={goldData}
            title="Gold"
            subtitle="$/oz"
            color="#ffb800"
            unit="$"
            height={200}
          />
        )}
      </div>

      {/* Energy & Defense Stocks */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold">Energy & Defense Stocks</h3>
            <p className="text-[11px] text-muted mt-0.5">Performance since Feb 27 (pre-conflict)</p>
          </div>
          <span className="text-[10px] px-2 py-1 rounded-full bg-accent-green/10 text-accent-green font-bold">All Up</span>
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
              {energyStocks.map((stock) => (
                <tr key={stock.name} className="border-b border-card-border table-row-hover">
                  <td className="px-5 py-3.5 font-medium">{stock.name}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold tabular-nums">
                    ${stock.price.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right font-mono text-accent-green tabular-nums text-xs">
                    +${stock.change.toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent-green/10 text-accent-green">
                      {stock.pct}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Commodity Table */}
      <div className="glass-card overflow-hidden">
        <div className="px-5 py-4 border-b border-card-border">
          <h3 className="text-sm font-bold">Commodity Prices</h3>
          <p className="text-[11px] text-muted mt-0.5">Changes since pre-conflict levels</p>
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
              {commodityPrices.map((c) => (
                <tr key={c.name} className="border-b border-card-border table-row-hover">
                  <td className="px-5 py-3.5 font-medium">{c.name}</td>
                  <td className="px-5 py-3.5 text-right font-mono font-bold tabular-nums">{c.value}</td>
                  <td className="px-5 py-3.5 text-right font-mono text-accent-red tabular-nums text-xs">{c.change}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="font-mono text-xs px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red">
                      {c.pct}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Shipping Routes */}
      <div className="glass-card p-5">
        <h3 className="text-sm font-bold mb-4">Alternative Shipping Routes</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              label: "Cape of Good Hope Route",
              value: "+14 days",
              sub: "~11,000 extra nautical miles. $1M+ extra fuel per voyage.",
              color: "from-amber-500/10 to-transparent",
              textColor: "text-accent-amber",
            },
            {
              label: "Suez Canal Congestion",
              value: "+8 days",
              sub: "Wait times surging as more ships reroute through Suez.",
              color: "from-red-500/10 to-transparent",
              textColor: "text-accent-red",
            },
            {
              label: "Insurance Premium Increase",
              value: "+800%",
              sub: "Most insurers have suspended Persian Gulf coverage entirely.",
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
              <div className="text-[11px] text-muted mt-1 leading-relaxed">{item.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
