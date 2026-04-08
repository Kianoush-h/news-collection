import { NextResponse } from "next/server";
import {
  fetchAllPrices,
  fetchNews,
  computeGasByState,
  estimateShippingDisruption,
} from "@/lib/fetchers";

const CONFLICT_START = "2026-02-28";
const BLOCKADE_START = "2026-03-02";

function daysSince(dateStr: string): number {
  return Math.max(1, Math.ceil((Date.now() - new Date(dateStr).getTime()) / 86400000));
}

export async function GET() {
  try {
    // Fetch real data in parallel
    // fetchNews is cached — shares the same GDELT call with /api/news
    const [prices, newsData] = await Promise.all([
      fetchAllPrices().catch(() => null),
      fetchNews().catch(() => null),
    ]);
    const metrics = newsData?.metrics ?? null;

    const brentPrice = prices?.oil?.brent?.price ?? 80;
    const rbobPrice = prices?.gasoline?.price ?? 2.80;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vixPrice = (prices as any)?.vix?.price ?? 20;

    // Compute dynamic data
    const shipping = estimateShippingDisruption(brentPrice);
    const gasPricesByState = computeGasByState(rbobPrice);

    // Consumer confidence: inversely correlated with VIX
    // VIX 12-15 = calm (confidence ~100), VIX 30+ = panic (confidence ~55)
    const consumerConfidence = Math.round(Math.max(40, Math.min(105, 120 - vixPrice * 2)) * 10) / 10;

    // Flight disruptions estimated from GDELT article volume
    const flightArticles = metrics?.flightDisruption ?? 0;
    const flightsDisrupted = Math.max(100, flightArticles * 45); // scale factor

    return NextResponse.json({
      dayOfConflict: daysSince(CONFLICT_START),
      dayOfBlockade: daysSince(BLOCKADE_START),
      conflictStartDate: CONFLICT_START,

      // Strait & shipping — derived from oil prices
      straitStatus: shipping,
      shipTrackingData: shipping.shipTrackingData,

      // Conflict metrics — from GDELT article analysis
      majorStrikes: metrics ? `${metrics.militaryOps}+` : "—",
      retaliations: metrics ? `${Math.round(metrics.militaryOps * 0.35)}+` : "—",
      ceasefireAttempts: metrics ? Math.max(1, Math.round(metrics.diplomacy / 10)) : 0,
      totalArticles: metrics?.totalArticles ?? 0,

      // Timeline — from GDELT real articles
      conflictEvents: metrics?.timelineEvents ?? [],

      // Gas by state — computed from RBOB futures + state taxes
      gasPricesByState,

      // Consumer metrics — derived from VIX & GDELT
      flightsDisrupted,
      consumerConfidence,

      // Flight info — derived from real data
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

      // Shipping routes — derived from disruption level
      shippingRoutes: [
        {
          label: "Cape Reroute Delay",
          value: `+${shipping.avgDelay}`,
          sub: `~11,000 extra nautical miles. ${shipping.shipsRerouted} ships currently rerouted.`,
          color: "from-amber-500/10 to-transparent",
          textColor: "text-accent-amber",
        },
        {
          label: "Shipping Disruption",
          value: `${shipping.disruptionLevel}%`,
          sub: `Strait status: ${shipping.status}. Oil flow: ${shipping.oilFlow}.`,
          color: shipping.disruptionLevel > 50 ? "from-red-500/10 to-transparent" : "from-amber-500/10 to-transparent",
          textColor: shipping.disruptionLevel > 50 ? "text-accent-red" : "text-accent-amber",
        },
        {
          label: "Insurance Risk Level",
          value: shipping.disruptionLevel > 70 ? "Extreme" : shipping.disruptionLevel > 30 ? "High" : "Elevated",
          sub: shipping.disruptionLevel > 70 ? "Most insurers suspended Gulf coverage" : "Premiums significantly elevated",
          color: "from-red-500/10 to-transparent",
          textColor: "text-accent-red",
        },
      ],

      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    console.error("Meta API error:", e);
    return NextResponse.json(
      { error: "Failed to compute metrics", updatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
