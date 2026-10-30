import { NextRequest, NextResponse } from "next/server";
import { confirmSubscriber } from "@/lib/subscribers";
import { htmlPage } from "@/lib/page";

export const dynamic = "force-dynamic";

/** The link in the confirmation email: turns a pending row into a subscriber. */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("t");
  if (!token || !/^[0-9a-f]{32}$/.test(token)) {
    return htmlPage("Link not valid", "This confirmation link is incomplete. Subscribe again on the site to get a fresh one.");
  }
  const email = confirmSubscriber(token);
  if (!email) {
    return htmlPage("Link expired", "This confirmation link is no longer valid. Subscribe again on the site to get a fresh one.");
  }
  return htmlPage("You are on the list", `${email} will receive the daily brief every morning around 6 am Eastern. Every email has an unsubscribe link.`);
}
