import { NextResponse } from "next/server";
import { dbGet, ensureStarted } from "@/lib/db";

export async function GET() {
  ensureStarted();
  const news = dbGet("news");
  if (!news) {
    return NextResponse.json(
      { ticker: [], blog: [], error: "Data loading", updatedAt: new Date().toISOString() },
      { status: 503 }
    );
  }
  return NextResponse.json(news);
}
