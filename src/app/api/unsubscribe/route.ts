import { NextRequest, NextResponse } from "next/server";
import { removeSubscriber } from "@/lib/subscribers";

export const dynamic = "force-dynamic";

function page(title: string, body: string): NextResponse {
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} — Crisis Watch</title>
<style>body{margin:0;background:#06060b;color:#f0f0f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:grid;place-items:center;min-height:100vh}main{max-width:420px;padding:32px;text-align:center}h1{font-size:22px;margin:0 0 10px}p{color:#8888a0;line-height:1.5}a{color:#4c8dff}</style></head>
<body><main><h1>${title}</h1><p>${body}</p><p><a href="https://crisiswatch.ca/">Back to Crisis Watch</a></p></main></body></html>`;
  return new NextResponse(html, { headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" } });
}

function handle(token: string | null): NextResponse {
  if (!token || !/^[0-9a-f]{32}$/.test(token)) return page("Link not valid", "This unsubscribe link is incomplete. Use the link at the bottom of any brief email.");
  const email = removeSubscriber(token);
  if (!email) return page("Already unsubscribed", "That address is no longer on the list. You will not receive further briefs.");
  return page("Unsubscribed", `${email} has been removed. Sorry to see you go.`);
}

export async function GET(req: NextRequest) {
  return handle(req.nextUrl.searchParams.get("t"));
}

// RFC 8058 one-click unsubscribe from mail clients posts to the same URL.
export async function POST(req: NextRequest) {
  return handle(req.nextUrl.searchParams.get("t"));
}
