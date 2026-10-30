import { NextRequest, NextResponse } from "next/server";
import { removeSubscriber } from "@/lib/subscribers";
import { htmlPage } from "@/lib/page";

export const dynamic = "force-dynamic";

function handle(token: string | null): NextResponse {
  if (!token || !/^[0-9a-f]{32}$/.test(token)) {
    return htmlPage("Link not valid", "This unsubscribe link is incomplete. Use the link at the bottom of any brief email.");
  }
  const email = removeSubscriber(token);
  if (!email) return htmlPage("Already unsubscribed", "That address is no longer on the list. You will not receive further briefs.");
  return htmlPage("Unsubscribed", `${email} has been removed. Sorry to see you go.`);
}

export async function GET(req: NextRequest) {
  return handle(req.nextUrl.searchParams.get("t"));
}

// RFC 8058 one-click unsubscribe from mail clients posts to the same URL.
export async function POST(req: NextRequest) {
  return handle(req.nextUrl.searchParams.get("t"));
}
