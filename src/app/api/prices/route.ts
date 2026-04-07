import { NextResponse } from "next/server";
import { fetchAllPrices } from "@/lib/fetchers";

export async function GET() {
  try {
    const prices = await fetchAllPrices();
    return NextResponse.json(prices);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch prices", updatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
