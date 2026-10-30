import { NextResponse } from "next/server";

/** HTML-escape for text placed into a page or an email. */
export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * A tiny standalone page for the subscribe / unsubscribe confirmations,
 * served by API routes without the app shell. Everything interpolated is
 * escaped, including values that came from our own store.
 */
export function htmlPage(title: string, body: string): NextResponse {
  const t = escapeHtml(title);
  const b = escapeHtml(body);
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${t} — Crisis Watch</title>
<style>body{margin:0;background:#06060b;color:#f0f0f5;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;display:grid;place-items:center;min-height:100vh}main{max-width:420px;padding:32px;text-align:center}h1{font-size:22px;margin:0 0 10px}p{color:#8888a0;line-height:1.5}a{color:#4c8dff}</style></head>
<body><main><h1>${t}</h1><p>${b}</p><p><a href="https://www.crisiswatch.ca/">Back to Crisis Watch</a></p></main></body></html>`;
  return new NextResponse(html, {
    headers: { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
  });
}
