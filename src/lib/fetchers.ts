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
  return cached("news:feed", 120_000, async () => {
    const query = "(iran OR hormuz OR persian gulf OR tehran)";
    const url = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(query)}&mode=artlist&maxrecords=30&format=json&sort=DateDesc`;

    try {
      const res = await fetch(url);
      if (!res.ok) return { ticker: [], blog: [] };

      const data = await res.json();
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

      return { ticker, blog, updatedAt: new Date().toISOString() };
    } catch {
      return { ticker: [], blog: [], updatedAt: new Date().toISOString() };
    }
  });
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
