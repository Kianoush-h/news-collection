"use client";

import StatCard from "@/components/StatCard";
import NewsTicker from "@/components/NewsTicker";
import LiveChart from "@/components/LiveChart";
import { IconTarget, IconOil, IconBlock, IconGas, IconShip, IconTrendUp, IconMap } from "@/components/Icons";
import ShareButton from "@/components/ShareButton";
import { generateOilPriceHistory, generateGasPriceHistory } from "@/lib/mock-data";
import { useClientData } from "@/hooks/useClientData";
import Link from "next/link";

export default function Home() {
  const oilData = useClientData(generateOilPriceHistory);
  const gasData = useClientData(generateGasPriceHistory);

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

      {/* Alert Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-accent-red/20">
        <div className="absolute inset-0 bg-gradient-to-r from-red-950/40 via-red-900/20 to-orange-950/30" />
        <div className="relative px-5 py-4 flex items-start gap-4">
          <div className="mt-0.5 flex-shrink-0">
            <span className="flex h-6 w-6 items-center justify-center">
              <span className="absolute h-4 w-4 rounded-full bg-accent-red/30 animate-ping" />
              <span className="relative h-2.5 w-2.5 rounded-full bg-accent-red" />
            </span>
          </div>
          <div>
            <span className="text-accent-red font-bold text-xs uppercase tracking-widest">
              Breaking
            </span>
            <p className="text-sm text-foreground/90 mt-1 leading-relaxed">
              Trump&apos;s deadline for Iran to reopen Strait of Hormuz expires tonight
              at 8:00 PM ET. Iran has rejected the 45-day ceasefire proposal.
              Pentagon moves additional carrier strike group toward Persian Gulf.
            </p>
          </div>
        </div>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Day of Conflict"
          value="38"
          icon={<IconTarget className="w-4 h-4" />}
          subtext="Started Feb 28, 2026"
          accentColor="red"
        />
        <StatCard
          label="Brent Crude"
          value="$142.38"
          change="+$3.24 (+2.3%) today"
          changeType="up"
          icon={<IconOil className="w-4 h-4" />}
          accentColor="amber"
        />
        <StatCard
          label="Strait Status"
          value="CLOSED"
          change="Day 36 of blockade"
          changeType="up"
          icon={<IconBlock className="w-4 h-4" />}
          accentColor="red"
        />
        <StatCard
          label="US Gas Average"
          value="$5.89"
          change="+$0.12 today"
          changeType="up"
          icon={<IconGas className="w-4 h-4" />}
          accentColor="amber"
        />
      </div>

      {/* Charts + News */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          {oilData && (
            <LiveChart
              data={oilData}
              title="Brent Crude Oil"
              subtitle="Price per barrel since Feb 20"
              color="#ff3b3b"
              unit="$"
              height={260}
            />
          )}
          {gasData && (
            <LiveChart
              data={gasData}
              title="US Average Gas Price"
              subtitle="Price per gallon"
              color="#ffb800"
              unit="$"
              height={200}
            />
          )}
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
      {/* Arrow */}
      <svg className="absolute top-4 right-4 w-4 h-4 text-muted opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </Link>
  );
}
