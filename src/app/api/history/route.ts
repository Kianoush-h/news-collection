import { NextResponse } from "next/server";
import { dbGet, ensureStarted } from "@/lib/db";

export async function GET(request: Request) {
  ensureStarted();
  const { searchParams } = new URL(request.url);
  const symbol = searchParams.get("symbol") ?? "BZ=F";

  const data = dbGet<{ time: string; value: number }[]>(`history:${symbol}`);
  if (!data) {
    return NextResponse.json({ data: [], error: "Data loading — first refresh in progress", updatedAt: new Date().toISOString() }, { status: 503 });
  }
  return NextResponse.json({ data, updatedAt: new Date().toISOString() });
}
