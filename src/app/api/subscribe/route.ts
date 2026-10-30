import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

// A small per-IP throttle so a script cannot fill the list. Resets on
// restart, which is fine: it only has to slow an abuser down.
const hits = new Map<string, { n: number; t: number }>();
function throttled(ip: string): boolean {
  const now = Date.now();
  const h = hits.get(ip);
  if (!h || now - h.t > 10 * 60 * 1000) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > 8;
}

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });

  let body: { email?: string; consent?: boolean; source?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (!body.consent) return NextResponse.json({ error: "Consent is required." }, { status: 400 });
  try {
    const added = addSubscriber(String(body.email ?? ""), String(body.source ?? "site").slice(0, 40));
    return NextResponse.json({ ok: true, duplicate: !added });
  } catch {
    return NextResponse.json({ error: "That does not look like an email address." }, { status: 400 });
  }
}
