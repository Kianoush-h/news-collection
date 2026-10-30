import fs from "fs";
import path from "path";
import { dbGet } from "./db";
import { pingIndexNow } from "./indexnow";

/**
 * The daily brief: one article a day, written automatically at 06:00
 * Toronto time from what the dashboard already knows — the night's GDELT
 * headlines, the price moves, the strait status, the fire count — and the
 * previous brief for continuity.
 *
 * Why it exists: the dashboards change every minute but have no new URLs,
 * and the four explainers were last touched in May. Search engines and the
 * LLM crawlers that read /llms-full.txt come back for new pages; the brief
 * gives them one every day, and gives subscribers something to receive.
 *
 * The model returns strict JSON (title, summary, key points, four sections,
 * the sources it leaned on). Nothing is published without parsing cleanly;
 * a failed generation simply leaves the day without a brief and is retried
 * on the next refresh. Briefs live in .data/briefs, the same persistent
 * volume as the cache.
 */

export interface BriefSection {
  heading: string;
  paragraphs: string[];
}

export interface BriefSource {
  title: string;
  url: string;
  source: string;
}

export interface Brief {
  /** YYYY-MM-DD in America/Toronto; also the URL slug. */
  date: string;
  /** "October 30, 2026" */
  dateLabel: string;
  title: string;
  summary: string;
  keyPoints: string[];
  sections: BriefSection[];
  sources: BriefSource[];
  readingTime: string;
  generatedAt: string;
  model: string;
}

const DIR = path.join(process.cwd(), ".data", "briefs");
const TZ = "America/Toronto";
const PUBLISH_HOUR = 6;
const SITE = "https://www.crisiswatch.ca";
const FAL_URL = "https://fal.run/fal-ai/any-llm";
const MODEL = "google/gemini-2.5-flash";

const g = globalThis as unknown as { __briefGenerating?: boolean };

export function todayInToronto(d = new Date()): string {
  // en-CA renders dates as YYYY-MM-DD.
  return new Intl.DateTimeFormat("en-CA", { timeZone: TZ, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}

export function hourInToronto(d = new Date()): number {
  const h = new Intl.DateTimeFormat("en-US", { timeZone: TZ, hour: "numeric", hour12: false }).format(d);
  return Number(h) % 24;
}

export function dateLabel(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d, 12)).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function fileFor(date: string): string {
  return path.join(DIR, `${date}.json`);
}

export function listBriefs(): Brief[] {
  try {
    if (!fs.existsSync(DIR)) return [];
    return fs
      .readdirSync(DIR)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
      .sort()
      .reverse()
      .map((f) => JSON.parse(fs.readFileSync(path.join(DIR, f), "utf-8")) as Brief);
  } catch (e) {
    console.error("[Brief] list failed:", e instanceof Error ? e.message : e);
    return [];
  }
}

export function getBrief(date: string): Brief | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  try {
    const f = fileFor(date);
    return fs.existsSync(f) ? (JSON.parse(fs.readFileSync(f, "utf-8")) as Brief) : null;
  } catch {
    return null;
  }
}

export function latestBrief(): Brief | null {
  return listBriefs()[0] ?? null;
}

// ─── Inputs from the live store ──────────────────────────────────────

interface Headline {
  title: string;
  body?: string;
  source?: string;
  url?: string;
  time: string;
  category?: string;
}

interface Quote {
  price: number;
  change: number;
  changePct: number;
  name?: string;
}

interface PricesShape {
  oil?: { brent?: Quote; wti?: Quote };
  gasoline?: Quote;
  gold?: Quote;
  naturalGas?: Quote;
  vix?: Quote;
}

function pct(q?: Quote): string {
  if (!q) return "n/a";
  const sign = q.changePct >= 0 ? "+" : "";
  return `${q.price.toFixed(2)} (${sign}${q.changePct.toFixed(1)}% on the day)`;
}

function gatherContext(date: string): { prompt: string; sources: BriefSource[] } | null {
  const news = dbGet<{ blog: Headline[]; ticker: Headline[] }>("news");
  const prices = dbGet<PricesShape>("prices");
  const fires = dbGet<unknown[]>("fires");
  const strait = dbGet<{ status?: string; oilFlow?: string }>("derived:shipping");
  const headlines = [...(news?.ticker ?? []), ...(news?.blog ?? [])]
    .filter((h, i, arr) => h.title && arr.findIndex((x) => x.title === h.title) === i)
    .slice(0, 35);
  if (headlines.length < 5 || !prices) return null;

  const start = new Date("2026-02-28T00:00:00Z").getTime();
  const day = Math.max(1, Math.ceil((Date.now() - start) / 86400000));
  const previous = listBriefs().find((b) => b.date < date);

  const lines: string[] = [];
  lines.push(`Date: ${dateLabel(date)} (day ${day} of the Iran-US conflict that began February 28, 2026).`);
  lines.push(`Market snapshot (USD): Brent ${pct(prices.oil?.brent)}, WTI ${pct(prices.oil?.wti)}, RBOB gasoline ${pct(prices.gasoline)}, natural gas ${pct(prices.naturalGas)}, gold ${pct(prices.gold)}, VIX ${pct(prices.vix)}.`);
  if (strait?.status) lines.push(`Strait of Hormuz model: status ${strait.status}, oil flow ${strait.oilFlow ?? "n/a"}.`);
  if (fires?.length) lines.push(`NASA FIRMS: ${fires.length} thermal hotspots detected in the Middle East in the last 24 hours.`);
  if (previous) lines.push(`Yesterday's brief (${previous.dateLabel}) was titled "${previous.title}": ${previous.summary}`);
  lines.push("");
  lines.push("Headlines from the last 24 hours (newest first), from GDELT:");
  headlines.forEach((h, i) => {
    lines.push(`${i + 1}. [${h.source ?? "unknown"}] ${h.title}${h.body ? ` — ${h.body.slice(0, 200)}` : ""}${h.url ? ` <${h.url}>` : ""}`);
  });

  const sources: BriefSource[] = headlines
    .filter((h) => h.url)
    .slice(0, 12)
    .map((h) => ({ title: h.title, url: h.url!, source: h.source ?? "" }));

  const prompt = `You write the morning brief for Crisis Watch (crisiswatch.ca), an independent dashboard that tracks the Iran-US conflict, the Strait of Hormuz and the energy markets. Readers are informed general-public and market watchers.

Write today's brief from ONLY the material below. Rules:
- Neutral, factual, newsroom tone. No speculation, no opinion, no adjectives like "shocking".
- Attribute claims to the outlet in the headline list ("Reuters reports...", "according to Al Jazeera"). If the headlines conflict, say so.
- Use the market numbers exactly as given. Do not invent figures, casualties, or quotes.
- If the headlines are thin or unrelated to the conflict, say the day was quiet and keep it short rather than padding.
- 450 to 650 words in total across the sections.

Return STRICT JSON only, no markdown fences, with exactly this shape:
{
  "title": string (max 90 characters, a headline for the day, no date in it),
  "summary": string (one paragraph, 45-70 words, the day in a nutshell),
  "keyPoints": string[] (5 bullets, each under 22 words),
  "sections": [
    {"heading": "Overnight developments", "paragraphs": string[]},
    {"heading": "Markets and energy", "paragraphs": string[]},
    {"heading": "Shipping and the Strait", "paragraphs": string[]},
    {"heading": "What to watch today", "paragraphs": string[]}
  ],
  "usedHeadlines": number[] (the numbers of the headlines you relied on, up to 8)
}

MATERIAL:
${lines.join("\n")}`;

  return { prompt, sources };
}

// ─── The model call ──────────────────────────────────────────────────

interface ModelOut {
  title: string;
  summary: string;
  keyPoints: string[];
  sections: BriefSection[];
  usedHeadlines?: number[];
}

async function askModel(prompt: string): Promise<ModelOut> {
  const key = process.env.FAL_KEY;
  if (!key) throw new Error("FAL_KEY is not set");
  const res = await fetch(FAL_URL, {
    method: "POST",
    headers: { Authorization: `Key ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model: MODEL, prompt, temperature: 0.35, max_tokens: 3500 }),
  });
  if (!res.ok) throw new Error(`fal ${res.status}: ${(await res.text()).slice(0, 200)}`);
  const data = (await res.json()) as { output?: string };
  let text = (data.output ?? "").trim();
  text = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start < 0 || end < 0) throw new Error("model returned no JSON object");
  const out = JSON.parse(text.slice(start, end + 1)) as ModelOut;
  if (!out.title || !out.summary || !Array.isArray(out.keyPoints) || !Array.isArray(out.sections)) {
    throw new Error("model JSON is missing fields");
  }
  out.sections = out.sections
    .filter((s) => s && s.heading && Array.isArray(s.paragraphs) && s.paragraphs.length > 0)
    .map((s) => ({ heading: String(s.heading), paragraphs: s.paragraphs.map(String) }));
  if (out.sections.length === 0) throw new Error("model JSON has no sections");
  return out;
}

function words(b: { summary: string; sections: BriefSection[] }): number {
  const text = [b.summary, ...b.sections.flatMap((s) => s.paragraphs)].join(" ");
  return text.split(/\s+/).filter(Boolean).length;
}

// ─── Generation ──────────────────────────────────────────────────────

async function generate(date: string): Promise<Brief> {
  const ctx = gatherContext(date);
  if (!ctx) throw new Error("not enough live data to write a brief yet");
  const out = await askModel(ctx.prompt);
  const used = new Set((out.usedHeadlines ?? []).map((n) => n - 1));
  const sources = ctx.sources.filter((_, i) => used.size === 0 || used.has(i)).slice(0, 8);
  const brief: Brief = {
    date,
    dateLabel: dateLabel(date),
    title: out.title.trim().slice(0, 120),
    summary: out.summary.trim(),
    keyPoints: out.keyPoints.map((k) => String(k).trim()).filter(Boolean).slice(0, 6),
    sections: out.sections,
    sources,
    readingTime: `${Math.max(2, Math.round(words(out) / 220))} min read`,
    generatedAt: new Date().toISOString(),
    model: MODEL,
  };
  fs.mkdirSync(DIR, { recursive: true });
  const tmp = fileFor(date) + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(brief, null, 1));
  fs.renameSync(tmp, fileFor(date));
  console.log(`[Brief] wrote ${date}: "${brief.title}" (${brief.readingTime})`);
  return brief;
}

/**
 * Called from the refresh loop and from the admin route. Writes today's
 * brief once it is 06:00 in Toronto and the day has none; `force` ignores
 * the clock, `regenerate` replaces an existing one.
 */
export async function ensureTodaysBrief(opts: { force?: boolean; regenerate?: boolean } = {}): Promise<Brief | null> {
  const date = todayInToronto();
  const existing = getBrief(date);
  if (existing && !opts.regenerate) return existing;
  if (!opts.force && hourInToronto() < PUBLISH_HOUR) return null;
  if (g.__briefGenerating) return null;
  g.__briefGenerating = true;
  try {
    const brief = await generate(date);
    // Fire-and-forget: the brief exists even if the engines or SES are down.
    void pingIndexNow([`${SITE}/brief/${date}`, `${SITE}/brief`, `${SITE}/`, `${SITE}/feed.xml`, `${SITE}/llms-full.txt`]);
    if (!opts.regenerate) {
      import("./mail")
        .then((m) => m.sendBriefToSubscribers(brief))
        .catch((e) => console.error("[Brief] mail failed:", e instanceof Error ? e.message : e));
    }
    return brief;
  } catch (e) {
    console.error(`[Brief] generation failed for ${date}:`, e instanceof Error ? e.message : e);
    return null;
  } finally {
    g.__briefGenerating = false;
  }
}

/** Plain text of a brief, for /llms-full.txt and search snippets. */
export function briefMarkdown(b: Brief): string {
  const out: string[] = [];
  out.push(`# ${b.title}`, "", `URL: ${SITE}/brief/${b.date}`, `Published: ${b.date}`, `Category: Daily brief`, "", `> ${b.summary}`, "");
  out.push("Key points:", ...b.keyPoints.map((k) => `- ${k}`), "");
  for (const s of b.sections) out.push(`## ${s.heading}`, "", ...s.paragraphs, "");
  if (b.sources.length) out.push("Sources:", ...b.sources.map((s) => `- ${s.source ? s.source + ": " : ""}${s.title} <${s.url}>`), "");
  return out.join("\n");
}
