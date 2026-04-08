import { NextResponse } from "next/server";
import { dbGet, ensureStarted, dbLastRefresh } from "@/lib/db";

const CONFLICT_START = "2026-02-28";
const BLOCKADE_START = "2026-03-02";

function daysSince(dateStr: string): number {
  return Math.max(1, Math.ceil((Date.now() - new Date(dateStr).getTime()) / 86400000));
}

export async function GET() {
  ensureStarted();

  const shipping = dbGet<{
    status: string; oilFlow: string; oilFlowDetail: string;
    shipsRerouted: number; shipsWaiting: number; avgDelay: string;
    disruptionLevel: number;
    shipTrackingData: { name: string; before: number | string; now: number | string; status: string }[];
  }>("derived:shipping");

  const metrics = dbGet<{
    totalArticles: number; militaryOps: number; diplomacy: number;
    flightDisruption: number; shippingDisruption: number;
    timelineEvents: unknown[];
  }>("derived:metrics");

  const gasPricesByState = dbGet("derived:gasByState");
  const vixPrice = dbGet<number>("derived:vix") ?? 20;
  const consumerConfidence = dbGet<number>("derived:consumerConfidence") ?? 70;
  const flightArticles = metrics?.flightDisruption ?? 0;

  return NextResponse.json({
    dayOfConflict: daysSince(CONFLICT_START),
    dayOfBlockade: daysSince(BLOCKADE_START),
    conflictStartDate: CONFLICT_START,

    straitStatus: shipping ?? { status: "—", oilFlow: "—", oilFlowDetail: "", shipsRerouted: 0, shipsWaiting: 0, avgDelay: "—" },
    shipTrackingData: shipping?.shipTrackingData ?? [],

    majorStrikes: metrics ? `${metrics.militaryOps}+` : "—",
    retaliations: metrics ? `${Math.round(metrics.militaryOps * 0.35)}+` : "—",
    ceasefireAttempts: metrics ? Math.max(1, Math.round(metrics.diplomacy / 10)) : 0,
    totalArticles: metrics?.totalArticles ?? 0,

    conflictEvents: metrics?.timelineEvents ?? [],
    gasPricesByState: gasPricesByState ?? [],
    flightsDisrupted: Math.max(100, flightArticles * 45),
    consumerConfidence,

    flightInfo: [
      {
        label: "Flight Disruption Reports",
        value: `${flightArticles} articles`,
        sub: "News articles about airspace/flight disruptions",
        color: "from-red-500/10 to-transparent",
        textColor: "text-accent-red",
      },
      {
        label: "VIX (Fear Index)",
        value: vixPrice.toFixed(1),
        sub: vixPrice > 30 ? "Extreme fear" : vixPrice > 20 ? "Elevated fear" : "Moderate",
        color: vixPrice > 25 ? "from-red-500/10 to-transparent" : "from-amber-500/10 to-transparent",
        textColor: vixPrice > 25 ? "text-accent-red" : "text-accent-amber",
      },
      {
        label: "Consumer Confidence",
        value: `${consumerConfidence}`,
        sub: consumerConfidence < 65 ? "Crisis-level low" : consumerConfidence < 80 ? "Below average" : "Stable",
        color: "from-amber-500/10 to-transparent",
        textColor: "text-accent-amber",
      },
    ],

    shippingRoutes: [
      {
        label: "Cape Reroute Delay",
        value: shipping ? `+${shipping.avgDelay}` : "—",
        sub: shipping ? `~11,000 extra nm. ${shipping.shipsRerouted} ships rerouted.` : "",
        color: "from-amber-500/10 to-transparent",
        textColor: "text-accent-amber",
      },
      {
        label: "Shipping Disruption",
        value: shipping ? `${shipping.disruptionLevel}%` : "—",
        sub: shipping ? `Strait: ${shipping.status}. Oil flow: ${shipping.oilFlow}.` : "",
        color: (shipping?.disruptionLevel ?? 0) > 50 ? "from-red-500/10 to-transparent" : "from-amber-500/10 to-transparent",
        textColor: (shipping?.disruptionLevel ?? 0) > 50 ? "text-accent-red" : "text-accent-amber",
      },
      {
        label: "Insurance Risk Level",
        value: (shipping?.disruptionLevel ?? 0) > 70 ? "Extreme" : (shipping?.disruptionLevel ?? 0) > 30 ? "High" : "Elevated",
        sub: (shipping?.disruptionLevel ?? 0) > 70 ? "Most insurers suspended Gulf coverage" : "Premiums significantly elevated",
        color: "from-red-500/10 to-transparent",
        textColor: "text-accent-red",
      },
    ],

    lastDbRefresh: new Date(dbLastRefresh()).toISOString(),
    updatedAt: new Date().toISOString(),
  });
}
