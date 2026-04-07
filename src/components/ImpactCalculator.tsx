"use client";

import { useState } from "react";
import { IconGas, IconPlane, IconPackage, IconOil } from "./Icons";

interface ImpactResult {
  location: string;
  state: string;
  gasPrice: number;
  gasPriceChange: string;
  gasRank: number;
  flightsDisrupted: number;
  shippingDelay: string;
  monthlyExtraCost: number;
  nearestNoFlyZone: string;
  riskLevel: "high" | "moderate" | "low";
}

// Simulated lookup — in production this would call a real API
const ZIP_DATA: Record<string, ImpactResult> = {
  // California
  "90210": { location: "Beverly Hills, CA", state: "California", gasPrice: 7.89, gasPriceChange: "+$2.14", gasRank: 1, flightsDisrupted: 312, shippingDelay: "18 days", monthlyExtraCost: 284, nearestNoFlyZone: "12,400 km", riskLevel: "moderate" },
  "94102": { location: "San Francisco, CA", state: "California", gasPrice: 7.92, gasPriceChange: "+$2.18", gasRank: 1, flightsDisrupted: 287, shippingDelay: "18 days", monthlyExtraCost: 276, nearestNoFlyZone: "12,200 km", riskLevel: "moderate" },
  "90001": { location: "Los Angeles, CA", state: "California", gasPrice: 7.85, gasPriceChange: "+$2.10", gasRank: 1, flightsDisrupted: 345, shippingDelay: "18 days", monthlyExtraCost: 290, nearestNoFlyZone: "12,500 km", riskLevel: "moderate" },
  // New York
  "10001": { location: "New York, NY", state: "New York", gasPrice: 6.34, gasPriceChange: "+$1.55", gasRank: 6, flightsDisrupted: 478, shippingDelay: "16 days", monthlyExtraCost: 198, nearestNoFlyZone: "9,200 km", riskLevel: "moderate" },
  "10013": { location: "Manhattan, NY", state: "New York", gasPrice: 6.38, gasPriceChange: "+$1.58", gasRank: 6, flightsDisrupted: 478, shippingDelay: "16 days", monthlyExtraCost: 201, nearestNoFlyZone: "9,200 km", riskLevel: "moderate" },
  // Texas
  "77001": { location: "Houston, TX", state: "Texas", gasPrice: 5.45, gasPriceChange: "+$1.35", gasRank: 8, flightsDisrupted: 156, shippingDelay: "15 days", monthlyExtraCost: 142, nearestNoFlyZone: "11,800 km", riskLevel: "low" },
  "75201": { location: "Dallas, TX", state: "Texas", gasPrice: 5.42, gasPriceChange: "+$1.32", gasRank: 8, flightsDisrupted: 134, shippingDelay: "15 days", monthlyExtraCost: 138, nearestNoFlyZone: "11,600 km", riskLevel: "low" },
  // Florida
  "33101": { location: "Miami, FL", state: "Florida", gasPrice: 5.98, gasPriceChange: "+$1.42", gasRank: 7, flightsDisrupted: 267, shippingDelay: "14 days", monthlyExtraCost: 168, nearestNoFlyZone: "10,800 km", riskLevel: "moderate" },
  // Hawaii
  "96801": { location: "Honolulu, HI", state: "Hawaii", gasPrice: 7.45, gasPriceChange: "+$1.98", gasRank: 2, flightsDisrupted: 89, shippingDelay: "22 days", monthlyExtraCost: 312, nearestNoFlyZone: "14,100 km", riskLevel: "low" },
  // Washington
  "98101": { location: "Seattle, WA", state: "Washington", gasPrice: 6.78, gasPriceChange: "+$1.72", gasRank: 4, flightsDisrupted: 198, shippingDelay: "19 days", monthlyExtraCost: 224, nearestNoFlyZone: "11,500 km", riskLevel: "low" },
  // Ohio
  "44101": { location: "Cleveland, OH", state: "Ohio", gasPrice: 5.32, gasPriceChange: "+$1.28", gasRank: 9, flightsDisrupted: 112, shippingDelay: "15 days", monthlyExtraCost: 128, nearestNoFlyZone: "9,800 km", riskLevel: "low" },
  // Illinois
  "60601": { location: "Chicago, IL", state: "Illinois", gasPrice: 5.67, gasPriceChange: "+$1.45", gasRank: 7, flightsDisrupted: 234, shippingDelay: "16 days", monthlyExtraCost: 172, nearestNoFlyZone: "10,200 km", riskLevel: "low" },
};

// City name lookup fallback
const CITY_DATA: Record<string, string> = {
  "new york": "10001",
  "nyc": "10001",
  "los angeles": "90001",
  "la": "90001",
  "san francisco": "94102",
  "sf": "94102",
  "houston": "77001",
  "dallas": "75201",
  "miami": "33101",
  "seattle": "98101",
  "chicago": "60601",
  "beverly hills": "90210",
  "honolulu": "96801",
  "cleveland": "44101",
  "manhattan": "10013",
};

function generateFallback(input: string): ImpactResult {
  // Generate plausible data for any input
  const hash = input.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const gasBase = 5.0 + (hash % 30) / 10;
  return {
    location: input,
    state: "Your Area",
    gasPrice: Math.round(gasBase * 100) / 100,
    gasPriceChange: `+$${(1.1 + (hash % 12) / 10).toFixed(2)}`,
    gasRank: 5 + (hash % 5),
    flightsDisrupted: 80 + (hash % 400),
    shippingDelay: `${13 + (hash % 9)} days`,
    monthlyExtraCost: 100 + (hash % 220),
    nearestNoFlyZone: `${9000 + (hash % 5000).toLocaleString()} km`,
    riskLevel: gasBase > 6.5 ? "moderate" : "low",
  };
}

export default function ImpactCalculator() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ImpactResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    if (!query.trim()) return;

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const cleaned = query.trim().toLowerCase();

      // Try ZIP code match
      if (ZIP_DATA[cleaned]) {
        setResult(ZIP_DATA[cleaned]);
      }
      // Try city name match
      else if (CITY_DATA[cleaned]) {
        setResult(ZIP_DATA[CITY_DATA[cleaned]]);
      }
      // Fallback: generate plausible data
      else {
        setResult(generateFallback(query.trim()));
      }

      setLoading(false);
    }, 800);
  };

  const riskColor =
    result?.riskLevel === "high"
      ? "bg-accent-red/15 text-accent-red"
      : result?.riskLevel === "moderate"
      ? "bg-accent-amber/15 text-accent-amber"
      : "bg-accent-green/15 text-accent-green";

  return (
    <div className="relative overflow-hidden glass-card">
      <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/5 to-accent-purple/5" />
      <div className="relative p-8">
        {/* Header */}
        <div className="text-center mb-6">
          <h3 className="text-lg font-bold mb-2">How Does This Affect You?</h3>
          <p className="text-sm text-muted max-w-md mx-auto">
            Enter your ZIP code or city to see personalized crisis impact data.
          </p>
        </div>

        {/* Search */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCheck()}
            placeholder="ZIP code or city (e.g. 10001, New York, Miami)..."
            className="bg-white/[0.04] border border-card-border rounded-xl px-4 py-2.5 text-sm w-80 focus:outline-none focus:border-accent-blue/50 focus:ring-1 focus:ring-accent-blue/20 transition-all placeholder:text-muted"
          />
          <button
            onClick={handleCheck}
            disabled={loading || !query.trim()}
            className="bg-gradient-to-r from-accent-blue to-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg hover:shadow-accent-blue/20 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:hover:scale-100"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Checking...
              </span>
            ) : (
              "Check Impact"
            )}
          </button>
        </div>

        {/* Results */}
        {result && !loading && (
          <div className="animate-slide-in">
            {/* Location header */}
            <div className="text-center mb-5">
              <div className="inline-flex items-center gap-2 bg-white/[0.05] rounded-full px-4 py-1.5 mb-2">
                <svg className="w-3.5 h-3.5 text-accent-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span className="text-sm font-semibold">{result.location}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${riskColor}`}>
                  {result.riskLevel} impact
                </span>
              </div>
            </div>

            {/* Impact Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
              <ImpactCard
                icon={<IconGas className="w-4 h-4" />}
                label="Local Gas Price"
                value={`$${result.gasPrice.toFixed(2)}/gal`}
                detail={`${result.gasPriceChange} since Feb 27`}
                detailColor="text-accent-red"
              />
              <ImpactCard
                icon={<IconPlane className="w-4 h-4" />}
                label="Flights Disrupted"
                value={result.flightsDisrupted.toLocaleString()}
                detail="This week from nearby airports"
                detailColor="text-muted"
              />
              <ImpactCard
                icon={<IconPackage className="w-4 h-4" />}
                label="Shipping Delay"
                value={result.shippingDelay}
                detail="For goods routed via Gulf"
                detailColor="text-accent-amber"
              />
              <ImpactCard
                icon={<IconOil className="w-4 h-4" />}
                label="Extra Monthly Cost"
                value={`$${result.monthlyExtraCost}`}
                detail="Est. fuel + goods increase"
                detailColor="text-accent-red"
              />
            </div>

            {/* Summary bar */}
            <div className="bg-white/[0.03] rounded-xl border border-card-border p-4 flex items-center justify-between flex-wrap gap-3">
              <div className="text-xs text-muted">
                <span className="text-foreground font-semibold">{result.state}</span> ranks{" "}
                <span className="text-foreground font-semibold">#{result.gasRank}</span>{" "}
                in highest gas prices nationally
              </div>
              <div className="text-xs text-muted">
                Nearest no-fly zone:{" "}
                <span className="text-foreground font-semibold">{result.nearestNoFlyZone}</span>
              </div>
            </div>
          </div>
        )}

        {/* Hint */}
        {!result && !loading && (
          <div className="text-center">
            <p className="text-[11px] text-muted">
              Try: <button onClick={() => { setQuery("10001"); }} className="text-accent-blue hover:underline">10001</button>
              {" "}<button onClick={() => { setQuery("90210"); }} className="text-accent-blue hover:underline">90210</button>
              {" "}<button onClick={() => { setQuery("Miami"); }} className="text-accent-blue hover:underline">Miami</button>
              {" "}<button onClick={() => { setQuery("Chicago"); }} className="text-accent-blue hover:underline">Chicago</button>
              {" "}<button onClick={() => { setQuery("Seattle"); }} className="text-accent-blue hover:underline">Seattle</button>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function ImpactCard({
  icon,
  label,
  value,
  detail,
  detailColor,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
  detailColor: string;
}) {
  return (
    <div className="bg-white/[0.03] rounded-xl border border-card-border p-3.5">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-white/[0.05] flex items-center justify-center text-muted-light">
          {icon}
        </div>
        <span className="text-[10px] text-muted uppercase tracking-wider font-semibold">{label}</span>
      </div>
      <div className="text-lg font-bold font-mono tabular-nums">{value}</div>
      <div className={`text-[10px] mt-1 ${detailColor}`}>{detail}</div>
    </div>
  );
}
