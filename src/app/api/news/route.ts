import { NextResponse } from "next/server";

// In production, replace with real API calls to NewsAPI, GDELT, etc.
// For now, returns mock data that simulates live updates

export async function GET() {
  const news = [
    {
      id: Date.now(),
      time: new Date().toISOString(),
      source: "Reuters",
      headline:
        "Iran's acting Supreme Leader rejects US ceasefire proposal, demands 'permanent solution'",
      urgency: "breaking",
    },
    {
      id: Date.now() - 1000,
      time: new Date(Date.now() - 18 * 60000).toISOString(),
      source: "AP",
      headline:
        "Pentagon moves additional carrier strike group toward Persian Gulf",
      urgency: "urgent",
    },
    {
      id: Date.now() - 2000,
      time: new Date(Date.now() - 34 * 60000).toISOString(),
      source: "Al Jazeera",
      headline:
        "Pakistan-mediated talks in Islamabad end without agreement on 45-day ceasefire",
      urgency: "breaking",
    },
  ];

  return NextResponse.json({ news, updatedAt: new Date().toISOString() });
}
