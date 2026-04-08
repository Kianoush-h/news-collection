import { NextResponse } from "next/server";
import { dbGet, ensureStarted } from "@/lib/db";

export async function GET() {
  ensureStarted();
  const prices = dbGet("prices");
  if (!prices) {
    return NextResponse.json({ error: "Data loading — first refresh in progress", updatedAt: new Date().toISOString() }, { status: 503 });
  }
  return NextResponse.json(prices);
}
