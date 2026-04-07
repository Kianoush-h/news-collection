import { NextResponse } from "next/server";

// In production, replace with real API calls to Alpha Vantage, Yahoo Finance, etc.
// Mock data simulates real-time price fluctuations

function jitter(base: number, range: number) {
  return Math.round((base + (Math.random() - 0.5) * range) * 100) / 100;
}

export async function GET() {
  const prices = {
    brentCrude: jitter(142.38, 2),
    wtiCrude: jitter(138.92, 2),
    naturalGas: jitter(8.45, 0.3),
    gold: jitter(3245, 20),
    usGasAvg: jitter(5.89, 0.1),
    wheat: jitter(892, 10),
    jetFuel: jitter(4.89, 0.15),
    updatedAt: new Date().toISOString(),
  };

  return NextResponse.json(prices);
}
