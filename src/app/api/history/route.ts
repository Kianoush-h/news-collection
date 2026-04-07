import { NextResponse } from "next/server";
import { fetchHistory } from "@/lib/fetchers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? "BZ=F";
  const days = parseInt(searchParams.get("days") ?? "60", 10);

  try {
    const data = await fetchHistory(symbol, days);
    return NextResponse.json({ data, updatedAt: new Date().toISOString() });
  } catch {
    return NextResponse.json(
      { data: [], error: "Failed to fetch history", updatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
