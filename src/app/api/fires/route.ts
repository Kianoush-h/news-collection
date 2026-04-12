import { NextResponse } from "next/server";
import { dbGet, ensureStarted } from "@/lib/db";

export async function GET() {
  ensureStarted();
  const fires = dbGet("fires");
  if (!fires) {
    return NextResponse.json(
      { fires: [], error: "Data loading", updatedAt: new Date().toISOString() },
      { status: 503 }
    );
  }
  return NextResponse.json({ fires, updatedAt: new Date().toISOString() });
}
