import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscribers";
import { sendConfirmation } from "@/lib/mail";

export const dynamic = "force-dynamic";

/**
 * Client IP for throttling. The app sits behind an AWS load balancer, which
 * appends the real client address as the LAST entry of X-Forwarded-For;
 * anything the client put in the header itself comes before it.
 */
function clientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length) return parts[parts.length - 1];
  }
  return "unknown";
}

// A small per-IP throttle so a script cannot fill the list. Bounded so it
// cannot grow without limit; resets on restart, which only has to slow an
// abuser down.
const hits = new Map<string, { n: number; t: number }>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const MAX_KEYS = 5000;

function throttled(ip: string): boolean {
  const now = Date.now();
  if (hits.size > MAX_KEYS) {
    for (const [k, v] of hits) if (now - v.t > WINDOW_MS) hits.delete(k);
    if (hits.size > MAX_KEYS) hits.clear();
  }
  const h = hits.get(ip);
  if (!h || now - h.t > WINDOW_MS) {
    hits.set(ip, { n: 1, t: now });
    return false;
  }
  h.n++;
  return h.n > MAX_PER_WINDOW;
}

export async function POST(req: NextRequest) {
  if (throttled(clientIp(req))) {
    return NextResponse.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  let body: { email?: string; consent?: boolean; source?: string };
  try {
    body = (await req.json()) as typeof body;
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  if (!body.consent) return NextResponse.json({ error: "Consent is required." }, { status: 400 });

  let row;
  let existed;
  try {
    ({ row, existed } = addSubscriber(String(body.email ?? ""), String(body.source ?? "site").slice(0, 40)));
  } catch {
    return NextResponse.json({ error: "That does not look like an email address." }, { status: 400 });
  }

  if (row.confirmed) return NextResponse.json({ ok: true, confirmed: true });

  // New or still-unconfirmed: (re)send the confirmation link. The response
  // is the same either way so the endpoint does not reveal who is on the list.
  sendConfirmation(row.email, row.token).catch((e) =>
    console.error("[Subscribe] confirmation mail failed:", e instanceof Error ? e.message : e),
  );
  return NextResponse.json({ ok: true, pending: true, resent: existed });
}
