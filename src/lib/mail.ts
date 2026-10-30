import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { listSubscribers } from "./subscribers";
import { escapeHtml as esc } from "./page";
import type { Brief } from "./brief";

/**
 * Email through SES: the confirmation link when someone subscribes, and the
 * daily brief to every confirmed address, one call per recipient so each
 * message carries its own unsubscribe link. Credentials come from the EC2
 * instance role; the only configuration is MAIL_FROM, a verified identity.
 *
 * In the SES sandbox only verified recipients receive mail; everyone else
 * is logged and skipped, so the site keeps working while production access
 * is pending.
 */
const SITE = process.env.NEXT_PUBLIC_BASE_URL || "https://www.crisiswatch.ca";
const FROM = process.env.MAIL_FROM || "Crisis Watch <crisiswatch@dilinx.com>";

let client: SESv2Client | null = null;
function ses(): SESv2Client {
  if (!client) client = new SESv2Client({ region: process.env.AWS_REGION || "us-east-1" });
  return client;
}

const FOOTER_STYLE = "font-size:12px;color:#777;line-height:1.5;margin:16px 4px 0";
const SHELL_OPEN =
  `<!doctype html><html><body style="margin:0;background:#f4f4f7;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif"><div style="max-width:620px;margin:0 auto;padding:24px 16px">` +
  `<div style="background:#fff;border-radius:12px;padding:28px 26px;border:1px solid #e6e6ee">`;
const SHELL_CLOSE = `</div></div></body></html>`;

export function confirmationHtml(confirmUrl: string): string {
  return (
    SHELL_OPEN +
    `<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#c0392b;font-weight:700">Crisis Watch</div>` +
    `<h1 style="margin:10px 0 6px;font-size:22px;line-height:1.3;color:#111">Confirm your subscription</h1>` +
    `<p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#444">Someone, hopefully you, asked for the Crisis Watch daily brief at this address. Click the button to confirm; if it was not you, ignore this email and nothing happens.</p>` +
    `<p style="margin:0"><a href="${esc(confirmUrl)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px">Yes, send me the daily brief</a></p>` +
    `</div><p style="${FOOTER_STYLE}">One email a morning, around 6 am Eastern. Unsubscribe any time with the link in every brief.</p>` +
    `</div></body></html>`
  );
}

export async function sendConfirmation(email: string, token: string): Promise<void> {
  const url = `${SITE}/api/confirm?t=${token}`;
  await ses().send(
    new SendEmailCommand({
      FromEmailAddress: FROM,
      Destination: { ToAddresses: [email] },
      ReplyToAddresses: ["contact@crisiswatch.ca"],
      Content: {
        Simple: {
          Subject: { Data: "Confirm your Crisis Watch daily brief", Charset: "UTF-8" },
          Body: {
            Html: { Data: confirmationHtml(url), Charset: "UTF-8" },
            Text: {
              Data: `Confirm your subscription to the Crisis Watch daily brief by opening this link:\n\n${url}\n\nIf you did not ask for this, ignore this email.`,
              Charset: "UTF-8",
            },
          },
        },
      },
    }),
  );
  console.log(`[Mail] confirmation sent to ${email}`);
}

export function briefHtml(b: Brief, unsubscribeUrl: string): string {
  const url = `${SITE}/brief/${b.date}`;
  const sections = b.sections
    .map(
      (s) =>
        `<h3 style="margin:22px 0 6px;font-size:16px;color:#111">${esc(s.heading)}</h3>` +
        s.paragraphs
          .map((p) => `<p style="margin:0 0 10px;line-height:1.55;color:#222">${esc(p)}</p>`)
          .join(""),
    )
    .join("");
  const points = b.keyPoints
    .map((k) => `<li style="margin:0 0 6px;line-height:1.5">${esc(k)}</li>`)
    .join("");
  return (
    SHELL_OPEN +
    `<div style="font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#c0392b;font-weight:700">Crisis Watch &middot; Daily brief &middot; ${esc(b.dateLabel)}</div>` +
    `<h1 style="margin:10px 0 6px;font-size:22px;line-height:1.3;color:#111">${esc(b.title)}</h1>` +
    `<p style="margin:0 0 18px;font-size:15px;line-height:1.55;color:#444">${esc(b.summary)}</p>` +
    `<ul style="margin:0 0 6px;padding-left:20px;color:#222">${points}</ul>` +
    sections +
    `<p style="margin:24px 0 0"><a href="${esc(url)}" style="display:inline-block;background:#111;color:#fff;text-decoration:none;padding:10px 16px;border-radius:8px;font-size:14px">Read on crisiswatch.ca</a></p>` +
    `</div><p style="${FOOTER_STYLE}">You get this because you confirmed a subscription at crisiswatch.ca. Figures come from public sources (Yahoo Finance, GDELT, NASA FIRMS) and are summarised automatically; check the dashboard for live values. ` +
    `<a href="${esc(unsubscribeUrl)}" style="color:#777">Unsubscribe</a></p>` +
    SHELL_CLOSE.replace("</div>", "")
  );
}

export function briefText(b: Brief, unsubscribeUrl: string): string {
  const lines = [
    `Crisis Watch - Daily brief - ${b.dateLabel}`,
    "",
    b.title,
    "",
    b.summary,
    "",
    ...b.keyPoints.map((k) => `- ${k}`),
    "",
  ];
  for (const s of b.sections) lines.push(s.heading.toUpperCase(), "", ...s.paragraphs, "");
  lines.push(`Read on the site: ${SITE}/brief/${b.date}`, "", `Unsubscribe: ${unsubscribeUrl}`);
  return lines.join("\n");
}

export async function sendBriefToSubscribers(b: Brief): Promise<{ sent: number; failed: number }> {
  const subs = listSubscribers();
  if (subs.length === 0) return { sent: 0, failed: 0 };
  let sent = 0;
  let failed = 0;
  for (const s of subs) {
    const unsub = `${SITE}/api/unsubscribe?t=${s.token}`;
    try {
      await ses().send(
        new SendEmailCommand({
          FromEmailAddress: FROM,
          Destination: { ToAddresses: [s.email] },
          ReplyToAddresses: ["contact@crisiswatch.ca"],
          Content: {
            Simple: {
              Subject: { Data: `${b.dateLabel}: ${b.title}`, Charset: "UTF-8" },
              Body: {
                Html: { Data: briefHtml(b, unsub), Charset: "UTF-8" },
                Text: { Data: briefText(b, unsub), Charset: "UTF-8" },
              },
              Headers: [
                { Name: "List-Unsubscribe", Value: `<${unsub}>` },
                { Name: "List-Unsubscribe-Post", Value: "List-Unsubscribe=One-Click" },
              ],
            },
          },
        }),
      );
      sent++;
    } catch (e) {
      failed++;
      console.error(`[Mail] ${s.email}: ${e instanceof Error ? e.message : e}`);
    }
  }
  console.log(`[Mail] brief ${b.date}: sent ${sent}, failed ${failed}`);
  return { sent, failed };
}
