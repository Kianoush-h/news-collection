"use client";

import StatCard from "@/components/StatCard";
import NewsTicker from "@/components/NewsTicker";
import LiveChart from "@/components/LiveChart";
import { IconTarget, IconOil, IconBlock, IconGas, IconShip, IconTrendUp, IconMap } from "@/components/Icons";
import ShareButton from "@/components/ShareButton";
import { useLiveData, useFetchOnce } from "@/hooks/useLiveData";
import { useState, useEffect } from "react";
import Link from "next/link";

interface PricesData {
  oil: { brent: { price: number; change: number; changePct: number }; wti: { price: number } };
  gasoline: { price: number; change: number };
  updatedAt: string;
}

interface MetaData {
  dayOfConflict: number;
  conflictStartDate: string;
  straitStatus: { status: string };
  dayOfBlockade: number;
}

interface HistoryData {
  data: { time: string; value: number }[];
}

interface NewsResponse {
  ticker: { id: number; headline: string; source: string; urgency: string }[];
}

export default function Home() {
  const { data: prices } = useLiveData<PricesData>("/api/prices", 60000);
  const { data: meta } = useLiveData<MetaData>("/api/meta", 3600000);
  const { data: newsData } = useLiveData<NewsResponse>("/api/news", 120000);
  const { data: oilHistory } = useFetchOnce<HistoryData>("/api/history?symbol=BZ=F&days=60");
  const { data: gasHistory } = useFetchOnce<HistoryData>("/api/history?symbol=RB=F&days=60");

  const [tickerIdx, setTickerIdx] = useState(0);
  const headlines = newsData?.ticker ?? [];

  useEffect(() => {
    if (headlines.length <= 1) return;
    const id = setInterval(() => {
      setTickerIdx((prev) => (prev + 1) % headlines.length);
    }, 10000);
    return () => clearInterval(id);
  }, [headlines.length]);

  const current = headlines[tickerIdx];

  const fmt = (v: number | undefined, prefix = "$") =>
    v != null ? `${prefix}${v.toFixed(2)}` : "—";
  const fmtChg = (v: number | undefined, pct: number | undefined) =>
    v != null && pct != null
      ? `${v >= 0 ? "+" : ""}$${v.toFixed(2)} (${pct >= 0 ? "+" : ""}${pct.toFixed(1)}%) today`
      : "";

  return (
    <div className="space-y-6 animate-slide-in">
      {/* Page Share */}
      <div className="flex justify-end">
        <ShareButton
          title="Crisis Watch — Live Iran-US War Dashboard"
          text="Real-time dashboard tracking the Iran-US conflict: oil prices, Strait of Hormuz, gas prices, and more."
          variant="pill"
        />
      </div>

      {/* Live Breaking Banner — rotates every 10s */}
      <div className="relative overflow-hidden rounded-2xl border border-accent-red/20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-red-900/20 to-orange-950/30" />
        <div className="relative px-5 py-4 flex items-start gap-4">
          <div className="mt-0.5 flex-shrink-0">
            <span className="flex h-6 w-6 items-center justify-center">
              <span className="absolute h-4 w-4 rounded-full bg-accent-red/30 animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-accent-red" />
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent-red font-bold text-xs uppercase tracking-widest">
                {current?.urgency === "breaking" ? "Breaking" : "Live"}
              </span>
              {current && (
                <span className="text-[10px] font-semibold text-accent-blue">
                  {current.source}
                </span>
              )}
              {headlines.length > 1 && (
                <span className="text-[10px] text-muted font-mono ml-auto tabular-nums">
                  {tickerIdx + 1}/{headlines.length}
                </span>
              )}
            </div>
            <p
              key={current?.id ?? 0}
              className="text-sm text-foreground/90 leading-relaxed animate-slide-in"
            >
              {current?.headline ?? "Loading live feed..."}
            </p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Day of Conflict"
          value={meta ? `${meta.dayOfConflict}` : "—"}
          icon={<IconTarget className="w-4 h-4" />}
          subtext={meta ? `Started ${meta.conflictStartDate}` : ""}
          accentColor="red"
        />
        <StatCard
          label="Brent Crude"
          value={fmt(prices?.oil.brent.price)}
          change={fmtChg(prices?.oil.brent.change, prices?.oil.brent.changePct)}
          changeType={prices?.oil.brent.change != null ? (prices.oil.brent.change >= 0 ? "up" : "down") : "neutral"}
          icon={<IconOil className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Strait Status"
          value={meta?.straitStatus.status ?? "—"}
          change={meta ? `Day ${meta.dayOfBlockade} of blockade` : ""}
          changeType="up"
          icon={<IconBlock className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="Gasoline Futures"
          value={fmt(prices?.gasoline.price)}
          change={prices?.gasoline.change != null ? `${prices.gasoline.change >= 0 ? "+" : ""}$${prices.gasoline.change.toFixed(2)} today` : ""}
          changeType={prices?.gasoline.change != null ? (prices.gasoline.change >= 0 ? "up" : "down") : "neutral"}
          icon={<IconGas className="w-4 h-4" />}
          accentColor="amber"
        />
      </div>

      {/* Charts + News */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <LiveChart
            data={oilHistory?.data ?? []}
            title="Brent Crude Oil"
            subtitle="Price per barrel — 60 day history"
            color="#ff3b3b"
            unit="$"
            height={260}
          />
          <LiveChart
            data={gasHistory?.data ?? []}
            title="RBOB Gasoline Futures"
            subtitle="Price per gallon"
            color="#ffb800"
            unit="$"
            height={200}
          />
        </div>
        <div className="lg:col-span-2">
          <NewsTicker />
        </div>
      </div>

      {/* Quick Nav Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickNav
          href="/hormuz"
          icon={<IconShip className="w-5 h-5" />}
          title="Strait of Hormuz"
          subtitle="Ship tracking & blockade status"
          gradient="from-cyan-500/20 to-teal-500/5"
          iconColor="text-accent-cyan"
        />
        <QuickNav
          href="/impact"
          icon={<IconTrendUp className="w-5 h-5" />}
          title="War Impact"
          subtitle="How it affects daily life"
          gradient="from-amber-500/20 to-orange-500/5"
          iconColor="text-accent-amber"
        />
        <QuickNav
          href="/conflict-map"
          icon={<IconMap className="w-5 h-5" />}
          title="Conflict Map"
          subtitle="Strikes, events & timeline"
          gradient="from-red-500/20 to-rose-500/5"
          iconColor="text-accent-red"
        />
        <QuickNav
          href="/oil-energy"
          icon={<IconOil className="w-5 h-5" />}
          title="Oil & Energy"
          subtitle="Markets & commodity prices"
          gradient="from-green-500/20 to-emerald-500/5"
          iconColor="text-accent-green"
        />
      </div>
    </div>
  );
}

function QuickNav({
  href,
  icon,
  title,
  subtitle,
  gradient,
  iconColor,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  iconColor: string;
}) {
  return (
    <Link
      href={href}
      className="glass-card group relative overflow-hidden p-4 hover:scale-[1.02] transition-all duration-200"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
      <div className="relative">
        <div className={`w-9 h-9 rounded-xl bg-white/[0.05] flex items-center justify-center mb-3 ${iconColor} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
        <div className="text-sm font-semibold text-foreground">{title}</div>
        <div className="text-[11px] text-muted mt-0.5">{subtitle}</div>
      </div>
      <svg className="absolute top-4 right-4 w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
