import { NextResponse } from "next/server";
import { fetchNews } from "@/lib/fetchers";

export async function GET() {
  try {
    const news = await fetchNews();
    return NextResponse.json(news);
  } catch {
    return NextResponse.json(
      { ticker: [], blog: [], error: "Failed to fetch news", updatedAt: new Date().toISOString() },
      { status: 500 }
    );
  }
}
