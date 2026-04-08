import YahooFinance from "yahoo-finance2";
import { cached } from "./cache";

const yf = new YahooFinance({ suppressNotices: ["yahooSurvey"] });

// ─── Yahoo Finance ───────────────────────────────────────────────────

export interface QuoteData {
  price: number;
  change: number;
  changePct: number;
  name: string;
}

const PRICE_SYMBOLS = {
  brent: "BZ=F",
  wti: "CL=F",
  naturalGas: "NG=F",
  gold: "GC=F",
  gasoline: "RB=F",
  wheat: "ZW=F",
  copper: "HG=F",
  silver: "SI=F",
  vix: "^VIX",
  jetFuel: "HO=F", // Heating oil as jet fuel proxy
} as const;

const STOCK_SYMBOLS = ["XOM", "CVX", "COP", "LMT", "RTX", "NOC"] as const;

const STOCK_NAMES: Record<string, string> = {
  XOM: "ExxonMobil (XOM)",
  CVX: "Chevron (CVX)",
  COP: "ConocoPhillips (COP)",
  LMT: "Lockheed Martin (LMT)",
  RTX: "Raytheon (RTX)",
  NOC: "Northrop Grumman (NOC)",
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function parseQuote(q: any): QuoteData {
  return {
    price: q.regularMarketPrice ?? 0,
    change: q.regularMarketChange ?? 0,
    changePct: q.regularMarketChangePercent ?? 0,
    name: q.shortName ?? q.symbol ?? "",
  };
}

export async function fetchAllPrices() {
  return cached("prices:all", 60_000, async () => {
    const allSymbols = [
      ...Object.values(PRICE_SYMBOLS),
      ...STOCK_SYMBOLS,
    ];

    const results: Record<string, QuoteData> = {};

    // Fetch quotes one by one to avoid batch issues
    await Promise.all(
      allSymbols.map(async (sym) => {
        try {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const q: any = await yf.quote(sym);
          results[sym] = parseQuote(q);
        } catch {
          // Skip failed symbols
        }
      })
    );

    // Build response
    const get = (sym: string): QuoteData =>
      results[sym] ?? { price: 0, change: 0, changePct: 0, name: sym };

    return {
      oil: {
        brent: get(PRICE_SYMBOLS.brent),
        wti: get(PRICE_SYMBOLS.wti),
      },
      gasoline: get(PRICE_SYMBOLS.gasoline),
      gold: get(PRICE_SYMBOLS.gold),
      naturalGas: get(PRICE_SYMBOLS.naturalGas),
      wheat: get(PRICE_SYMBOLS.wheat),
      copper: get(PRICE_SYMBOLS.copper),
      silver: get(PRICE_SYMBOLS.silver),
      vix: get(PRICE_SYMBOLS.vix),
      jetFuel: get(PRICE_SYMBOLS.jetFuel),
      stocks: STOCK_SYMBOLS.map((sym) => {
        const q = get(sym);
        return {
          ticker: sym,
          name: STOCK_NAMES[sym] ?? sym,
          price: q.price,
          change: q.change,
          changePct: q.changePct,
        };
      }),
      updatedAt: new Date().toISOString(),
    };
  });
}

export async function fetchHistory(symbol: string, days: number = 60) {
  const cacheKey = `history:${symbol}:${days}`;
  return cached(cacheKey, 600_000, async () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result: any = await yf.chart(symbol, {
        period1: startDate,
        period2: endDate,
        interval: "1d",
      });

      const quotes: { date: Date; close: number | null }[] = result.quotes ?? [];
      return quotes.map((row) => ({
        time: `${row.date.getMonth() + 1}/${row.date.getDate()}`,
        value: Math.round((row.close ?? 0) * 100) / 100,
      }));
    } catch {
      return [];
    }
  });
}

// ─── GDELT News ──────────────────────────────────────────────────────

interface GdeltArticle {
  url: string;
  title: string;
  seendate: string;
  domain: string;
  language: string;
  sourcecountry: string;
  socialimage?: string;
}

function relativeTime(dateStr: string): string {
  // GDELT dates: "20260407T123000Z"
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(9, 11);
  const min = dateStr.slice(11, 13);
  const sec = dateStr.slice(13, 15);
  const d = new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
  const diff = Math.floor((Date.now() - d.getTime()) / 1000);

  if (diff < 60) return "Just now";
  if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function domainToSource(domain: string): string {
  const map: Record<string, string> = {
    "reuters.com": "Reuters",
    "apnews.com": "AP",
    "aljazeera.com": "Al Jazeera",
    "bbc.com": "BBC",
    "bbc.co.uk": "BBC",
    "cnn.com": "CNN",
    "nytimes.com": "NY Times",
    "washingtonpost.com": "WaPo",
    "theguardian.com": "Guardian",
    "bloomberg.com": "Bloomberg",
    "cnbc.com": "CNBC",
    "ft.com": "FT",
    "npr.org": "NPR",
    "foxnews.com": "Fox News",
    "nbcnews.com": "NBC",
    "cbsnews.com": "CBS",
    "abcnews.go.com": "ABC",
  };
  // Try matching domain
  for (const [key, val] of Object.entries(map)) {
    if (domain.includes(key)) return val;
  }
  // Fallback: capitalize domain
  return domain.replace(/\.com$|\.org$|\.co\.uk$/, "").replace(/\./g, " ");
}

function classifyUrgency(
  title: string,
  ageMinutes: number
): "breaking" | "urgent" | "normal" {
  const lower = title.toLowerCase();
  if (
    lower.includes("breaking") ||
    lower.includes("just in") ||
    lower.includes("alert")
  )
    return "breaking";
  if (ageMinutes < 60) return "urgent";
  if (ageMinutes < 180) return "urgent";
  return "normal";
}

function classifyCategory(
  title: string
): "breaking" | "analysis" | "markets" | "diplomacy" | "update" {
  const lower = title.toLowerCase();
  if (
    lower.includes("breaking") ||
    lower.includes("strike") ||
    lower.includes("attack") ||
    lower.includes("bomb") ||
    lower.includes("missile") ||
    lower.includes("kill")
  )
    return "breaking";
  if (
    lower.includes("oil") ||
    lower.includes("price") ||
    lower.includes("stock") ||
    lower.includes("market") ||
    lower.includes("trade") ||
    lower.includes("economy")
  )
    return "markets";
  if (
    lower.includes("talk") ||
    lower.includes("ceasefire") ||
    lower.includes("diplomac") ||
    lower.includes("negotiat") ||
    lower.includes("sanction") ||
    lower.includes("un ") ||
    lower.includes("united nations")
  )
    return "diplomacy";
  if (
    lower.includes("analysis") ||
    lower.includes("opinion") ||
    lower.includes("why") ||
    lower.includes("what it means") ||
    lower.includes("explain")
  )
    return "analysis";
  return "update";
}

export async function fetchNews() {
  return cached(
    "news:feed",
    120_000,
    async () => {
    // Fetch 250 articles — used for both news feed AND conflict metrics
    const query = "(iran OR hormuz OR persian gulf OR tehran)";
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=250&format=json&sort=DateDesc`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "CrisisWatch/1.0 (https://crisiswatch.ca)",
          "Accept": "application/json",
        },
      });
      clearTimeout(timeout);

      if (!res.ok) {
        console.error(`GDELT returned ${res.status}: ${res.statusText}`);
        return { ticker: [], blog: [], error: `GDELT HTTP ${res.status}` };
      }

      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("GDELT returned non-JSON:", text.slice(0, 200));
        return { ticker: [], blog: [], error: "GDELT non-JSON response" };
      }

      const articles: GdeltArticle[] = data.articles ?? [];

      // Deduplicate by title similarity
      const seen = new Set<string>();
      const unique = articles.filter((a) => {
        const key = a.title.toLowerCase().slice(0, 50);
        if (seen.has(key)) return false;
        seen.add(key);
        return a.language === "English";
      });

      // Ticker items (top 10)
      const ticker = unique.slice(0, 10).map((a, i) => {
        const ageMs = Date.now() - parseGdeltDate(a.seendate).getTime();
        const ageMin = ageMs / 60000;
        return {
          id: i + 1,
          time: relativeTime(a.seendate),
          source: domainToSource(a.domain),
          headline: a.title,
          urgency: classifyUrgency(a.title, ageMin),
          url: a.url,
        };
      });

      // Blog items (all unique articles)
      const blog = unique.map((a) => ({
        id: a.url.slice(-12).replace(/[^a-z0-9]/gi, ""),
        time: parseGdeltDate(a.seendate).toISOString(),
        category: classifyCategory(a.title),
        title: a.title,
        body: `Reported by ${domainToSource(a.domain)}. ${a.title}`,
        source: domainToSource(a.domain),
        url: a.url,
      }));

      // Derive conflict metrics from the same articles
      let militaryOps = 0, diplomacyCount = 0, flightDisruption = 0, shippingDisruption = 0;
      const timelineEvents: {
        date: string; title: string; description: string;
        type: string; severity: string; lat: number; lng: number;
      }[] = [];
      const seenTimeline = new Set<string>();

      unique.forEach((a) => {
        const t = a.title.toLowerCase();
        if (t.includes("strike") || t.includes("bomb") || t.includes("attack") || t.includes("missile") || t.includes("military")) militaryOps++;
        if (t.includes("ceasefire") || t.includes("talk") || t.includes("negotiat") || t.includes("peace") || t.includes("diplomac") || t.includes("sanction")) diplomacyCount++;
        if (t.includes("flight") || t.includes("airspace") || t.includes("airline") || t.includes("aviation") || t.includes("airport")) flightDisruption++;
        if (t.includes("ship") || t.includes("tanker") || t.includes("hormuz") || t.includes("reroute") || t.includes("strait") || t.includes("blockade")) shippingDisruption++;

        const key = a.title.slice(0, 40).toLowerCase();
        if (!seenTimeline.has(key) && timelineEvents.length < 15) {
          seenTimeline.add(key);
          const type = t.includes("strike") || t.includes("attack") || t.includes("missile")
            ? "strike"
            : t.includes("hormuz") || t.includes("blockade") || t.includes("ship")
            ? "blockade"
            : t.includes("ceasefire") || t.includes("talk") || t.includes("peace")
            ? "diplomatic"
            : "economic";
          const severity = t.includes("breaking") || t.includes("kill") || t.includes("dead")
            ? "critical"
            : t.includes("strike") || t.includes("attack") || t.includes("missile")
            ? "high"
            : "medium";
          const coords = guessCoordinates(t);
          const d = parseGdeltDate(a.seendate);
          timelineEvents.push({
            date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            title: a.title,
            description: `Source: ${domainToSource(a.domain)}`,
            type, severity,
            lat: coords.lat, lng: coords.lng,
          });
        }
      });

      const metrics = {
        totalArticles: unique.length,
        militaryOps,
        diplomacy: diplomacyCount,
        flightDisruption,
        shippingDisruption,
        timelineEvents,
      };

      console.log(`GDELT: ${ticker.length} ticker, ${blog.length} blog, ${unique.length} total articles, ${timelineEvents.length} timeline`);
      return { ticker, blog, metrics, updatedAt: new Date().toISOString() };
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("GDELT fetch failed:", msg);
      return { ticker: [], blog: [], error: msg, updatedAt: new Date().toISOString() };
    }
    },
    // Only cache if we got actual results — don't cache errors
    (result) => result.ticker.length > 0
  );
}

function parseGdeltDate(dateStr: string): Date {
  const year = dateStr.slice(0, 4);
  const month = dateStr.slice(4, 6);
  const day = dateStr.slice(6, 8);
  const hour = dateStr.slice(9, 11);
  const min = dateStr.slice(11, 13);
  const sec = dateStr.slice(13, 15);
  return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}Z`);
}

// ─── GDELT Conflict Metrics ─────────────────────────────────────────

export async function fetchConflictMetrics() {
  return cached(
    "conflict:metrics",
    300_000, // 5 min cache
    async () => {
      const query = "(iran OR hormuz OR persian gulf)";
      const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=250&format=json&sort=DateDesc`;

      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 15000);
        const res = await fetch(url, {
          signal: controller.signal,
          headers: { "User-Agent": "CrisisWatch/1.0", Accept: "application/json" },
        });
        clearTimeout(timeout);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        const articles: GdeltArticle[] = (data.articles ?? []).filter(
          (a: GdeltArticle) => a.language === "English"
        );

        // Classify articles by keywords
        let militaryOps = 0, diplomacy = 0, flightDisruption = 0, shippingDisruption = 0;
        const timelineEvents: {
          date: string; title: string; description: string;
          type: string; severity: string; lat: number; lng: number;
        }[] = [];

        const seenTitles = new Set<string>();

        articles.forEach((a) => {
          const t = a.title.toLowerCase();
          if (t.includes("strike") || t.includes("bomb") || t.includes("attack") || t.includes("missile") || t.includes("military")) militaryOps++;
          if (t.includes("ceasefire") || t.includes("talk") || t.includes("negotiat") || t.includes("peace") || t.includes("diplomac") || t.includes("sanction")) diplomacy++;
          if (t.includes("flight") || t.includes("airspace") || t.includes("airline") || t.includes("aviation") || t.includes("airport")) flightDisruption++;
          if (t.includes("ship") || t.includes("tanker") || t.includes("hormuz") || t.includes("reroute") || t.includes("strait") || t.includes("blockade")) shippingDisruption++;

          // Build timeline from unique high-signal articles
          const key = a.title.slice(0, 40).toLowerCase();
          if (!seenTitles.has(key) && timelineEvents.length < 15) {
            seenTitles.add(key);
            const type = t.includes("strike") || t.includes("attack") || t.includes("missile") || t.includes("bomb")
              ? "strike"
              : t.includes("hormuz") || t.includes("blockade") || t.includes("ship") || t.includes("tanker")
              ? "blockade"
              : t.includes("ceasefire") || t.includes("talk") || t.includes("peace") || t.includes("negotiat")
              ? "diplomatic"
              : "economic";
            const severity = t.includes("breaking") || t.includes("kill") || t.includes("dead")
              ? "critical"
              : t.includes("strike") || t.includes("attack") || t.includes("missile")
              ? "high"
              : "medium";

            const coords = guessCoordinates(t);
            const d = parseGdeltDate(a.seendate);

            timelineEvents.push({
              date: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
              title: a.title,
              description: `Source: ${domainToSource(a.domain)}`,
              type,
              severity,
              lat: coords.lat,
              lng: coords.lng,
            });
          }
        });

        console.log(`Conflict metrics: ${militaryOps} military, ${diplomacy} diplo, ${flightDisruption} flight, ${shippingDisruption} shipping, ${timelineEvents.length} timeline events`);

        return {
          totalArticles: articles.length,
          militaryOps,
          diplomacy,
          flightDisruption,
          shippingDisruption,
          timelineEvents,
        };
      } catch (e) {
        console.error("Conflict metrics fetch failed:", e instanceof Error ? e.message : e);
        return {
          totalArticles: 0, militaryOps: 0, diplomacy: 0,
          flightDisruption: 0, shippingDisruption: 0, timelineEvents: [],
        };
      }
    },
    (r) => r.totalArticles > 0
  );
}

function guessCoordinates(title: string): { lat: number; lng: number } {
  const t = title.toLowerCase();
  if (t.includes("tehran") || t.includes("iran")) return { lat: 35.69, lng: 51.39 };
  if (t.includes("hormuz") || t.includes("strait")) return { lat: 26.57, lng: 56.25 };
  if (t.includes("israel") || t.includes("jerusalem") || t.includes("tel aviv")) return { lat: 31.77, lng: 35.21 };
  if (t.includes("qatar") || t.includes("doha")) return { lat: 25.29, lng: 51.53 };
  if (t.includes("iraq") || t.includes("baghdad")) return { lat: 33.31, lng: 44.37 };
  if (t.includes("saudi") || t.includes("riyadh")) return { lat: 24.71, lng: 46.68 };
  if (t.includes("pakistan") || t.includes("islamabad")) return { lat: 33.68, lng: 73.05 };
  if (t.includes("china") || t.includes("beijing")) return { lat: 39.90, lng: 116.41 };
  if (t.includes("washington") || t.includes("pentagon") || t.includes("white house")) return { lat: 38.90, lng: -77.04 };
  if (t.includes("united nations") || t.includes("new york")) return { lat: 40.75, lng: -73.97 };
  if (t.includes("london") || t.includes("britain") || t.includes("uk")) return { lat: 51.51, lng: -0.13 };
  if (t.includes("persian gulf") || t.includes("gulf")) return { lat: 27.0, lng: 51.5 };
  if (t.includes("yemen") || t.includes("houthi")) return { lat: 15.37, lng: 44.19 };
  if (t.includes("syria") || t.includes("damascus")) return { lat: 33.51, lng: 36.29 };
  // Default: Middle East center
  return { lat: 29.0 + Math.random() * 5, lng: 50.0 + Math.random() * 8 };
}

// ─── Gas Prices by State (computed from RBOB futures) ────────────────

// State gas tax per gallon (2025 data, includes state excise + avg local taxes)
const STATE_GAS_TAXES: { state: string; tax: number }[] = [
  { state: "California", tax: 0.87 },
  { state: "Hawaii", tax: 0.51 },
  { state: "Pennsylvania", tax: 0.77 },
  { state: "Washington", tax: 0.49 },
  { state: "Oregon", tax: 0.40 },
  { state: "New York", tax: 0.50 },
  { state: "Illinois", tax: 0.59 },
  { state: "Florida", tax: 0.36 },
  { state: "Michigan", tax: 0.45 },
  { state: "Nevada", tax: 0.39 },
  { state: "Connecticut", tax: 0.44 },
  { state: "New Jersey", tax: 0.42 },
  { state: "Ohio", tax: 0.39 },
  { state: "Texas", tax: 0.20 },
  { state: "Mississippi", tax: 0.18 },
];

const FEDERAL_GAS_TAX = 0.184;
const DISTRIBUTION_MARKUP = 0.45; // refining + distribution + retail margin
const RACK_MARKUP = 1.12; // wholesale markup factor

export function computeGasByState(rbobPrice: number) {
  return STATE_GAS_TAXES
    .map((s) => {
      const retail = rbobPrice * RACK_MARKUP + s.tax + FEDERAL_GAS_TAX + DISTRIBUTION_MARKUP;
      const preConflictEstimate = 2.80 * RACK_MARKUP + s.tax + FEDERAL_GAS_TAX + DISTRIBUTION_MARKUP;
      const diff = retail - preConflictEstimate;
      return {
        state: s.state,
        price: Math.round(retail * 100) / 100,
        change: `${diff >= 0 ? "+" : ""}$${diff.toFixed(2)}`,
      };
    })
    .sort((a, b) => b.price - a.price)
    .slice(0, 10);
}

// ─── Shipping & Strait Estimates (derived from oil price) ────────────

export function estimateShippingDisruption(brentPrice: number) {
  // Normal Brent baseline ~$75. Higher price = more disruption.
  const priceRatio = Math.max(0, (brentPrice - 75) / 75);
  const disruptionLevel = Math.min(1, priceRatio); // 0 to 1

  const oilFlow = Math.max(0.3, 21 - disruptionLevel * 20.7);
  const shipsRerouted = Math.round(disruptionLevel * 85);
  const shipsWaiting = Math.round(disruptionLevel * 50);
  const delayDays = Math.round(disruptionLevel * 16);

  const status = disruptionLevel > 0.7 ? "CLOSED"
    : disruptionLevel > 0.3 ? "RESTRICTED"
    : "OPEN";

  return {
    status,
    oilFlow: `${oilFlow.toFixed(1)} mb/d`,
    oilFlowDetail: `Normal: 21 mb/d`,
    shipsRerouted,
    shipsWaiting,
    avgDelay: delayDays > 0 ? `${delayDays}+ days` : "Normal",
    disruptionLevel: Math.round(disruptionLevel * 100),
    shipTrackingData: [
      { name: "Oil Tankers in Strait", before: 85, now: Math.round(85 - disruptionLevel * 82), status: disruptionLevel > 0.5 ? "critical" as const : "warning" as const },
      { name: "Ships Rerouted (Cape)", before: 2, now: shipsRerouted, status: "warning" as const },
      { name: "Ships Waiting (Oman)", before: 0, now: shipsWaiting, status: "warning" as const },
      { name: "Avg Transit Delay", before: "0 days", now: delayDays > 0 ? `${delayDays}+ days` : "0 days", status: disruptionLevel > 0.5 ? "critical" as const : "warning" as const },
    ],
  };
}
