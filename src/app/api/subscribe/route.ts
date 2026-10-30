import { NextRequest, NextResponse } from "next/server";
import { addSubscriber, markConfirmationSent } from "@/lib/subscribers";
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
    // Still full: drop the oldest entries, never the whole table.
    if (hits.size > MAX_KEYS) {
      const oldest = [...hits.entries()].sort((a, b) => a[1].t - b[1].t).slice(0, hits.size - MAX_KEYS);
      for (const [k] of oldest) hits.delete(k);
    }
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
  try {
    ({ row } = addSubscriber(String(body.email ?? ""), String(body.source ?? "site").slice(0, 40)));
  } catch {
    return NextResponse.json({ error: "That does not look like an email address." }, { status: 400 });
  }

  // One answer for every valid address, whether it is new, pending or already
  // confirmed, so the endpoint cannot be used to find out who subscribes.
  // A confirmation goes out only when the per-address cooldown allows it.
  if (!row.confirmed && markConfirmationSent(row.token)) {
    sendConfirmation(row.email, row.token).catch((e) =>
      console.error("[Subscribe] confirmation mail failed:", e instanceof Error ? e.message : e),
    );
  }
  return NextResponse.json({ ok: true });
}
