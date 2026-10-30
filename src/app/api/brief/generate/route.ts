import { NextRequest, NextResponse } from "next/server";
import { ensureStarted } from "@/lib/db";
import { ensureTodaysBrief, listBriefs } from "@/lib/brief";

export const dynamic = "force-dynamic";

/**
 * Operator trigger: write (or rewrite) today's brief now instead of waiting
 * for the 06:00 run. Needs ?key= matching BRIEF_ADMIN_KEY. Without the key
 * it only reports what exists.
 */
export async function GET(req: NextRequest) {
  ensureStarted();
  const key = req.nextUrl.searchParams.get("key");
  const admin = process.env.BRIEF_ADMIN_KEY;
  if (!admin || key !== admin) {
    return NextResponse.json({ briefs: listBriefs().map((b) => ({ date: b.date, title: b.title })) });
  }
  const regenerate = req.nextUrl.searchParams.get("regen") === "1";
  const brief = await ensureTodaysBrief({ force: true, regenerate });
  if (!brief) return NextResponse.json({ ok: false, error: "generation failed or not enough data; see server log" }, { status: 503 });
  return NextResponse.json({ ok: true, date: brief.date, title: brief.title, readingTime: brief.readingTime, sources: brief.sources.length });
}
