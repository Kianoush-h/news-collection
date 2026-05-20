import fs from "fs";
import path from "path";
import {
  fetchAllPrices,
  fetchHistory,
  fetchNews,
  fetchFireData,
  computeGasByState,
  estimateShippingDisruption,
} from "./fetchers";

// ─── In-memory store with disk persistence ───────────────────────────
// Data is refreshed every 5 minutes from external APIs.
// API routes read from this store (instant, no external calls).
// On restart, loads from disk so data is immediately available.

const DB_DIR = path.join(process.cwd(), ".data");
const DB_PATH = path.join(DB_DIR, "cache.json");
const REFRESH_INTERVAL = 5 * 60 * 1000; // 5 minutes

interface DbState {
  store: Record<string, unknown>;
  lastRefresh: number;
}

// Next.js can bundle this module into multiple per-route compiled outputs.
// Each bundle would otherwise get its own copy of `state`, so the refresh
// loop running in one bundle would write data the API routes (in another
// bundle) can't read. Pin everything to globalThis so every module copy
// shares the same store, lastRefresh timestamp, in-flight lock, and timer.
const globalForDb = globalThis as unknown as {
  __dbState?: DbState;
  __dbRefreshing?: boolean;
  __dbStarted?: boolean;
  __dbTimer?: ReturnType<typeof setInterval>;
};

if (!globalForDb.__dbState) {
  globalForDb.__dbState = { store: {}, lastRefresh: 0 };
}

const state: DbState = globalForDb.__dbState;

// ─── Disk persistence ────────────────────────────────────────────────

function loadFromDisk(): void {
  try {
    if (fs.existsSync(DB_PATH)) {
      const raw = fs.readFileSync(DB_PATH, "utf-8");
      const parsed = JSON.parse(raw) as DbState;
      // Mutate the shared state object in place so other module copies
      // already holding a reference to it see the loaded data.
      state.store = parsed.store;
      state.lastRefresh = parsed.lastRefresh;
      console.log(
        `[DB] Loaded from disk — ${Object.keys(state.store).length} keys, last refresh: ${new Date(state.lastRefresh).toISOString()}`,
      );
    }
  } catch (e) {
    console.error("[DB] Failed to load from disk:", e);
  }
}

function saveToDisk(): void {
  try {
    if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
    fs.writeFileSync(DB_PATH, JSON.stringify(state));
  } catch (e) {
    console.error("[DB] Failed to save to disk:", e);
  }
}

// ─── Public API ──────────────────────────────────────────────────────

export function dbGet<T>(key: string): T | null {
  return (state.store[key] as T) ?? null;
}

export function dbSet(key: string, value: unknown): void {
  state.store[key] = value;
}

export function dbLastRefresh(): number {
  return state.lastRefresh;
}

// ─── Refresh all data from external APIs ─────────────────────────────

async function refreshAll(): Promise<void> {
  if (globalForDb.__dbRefreshing) return;
  globalForDb.__dbRefreshing = true;
  const start = Date.now();

  try {
    // Fetch prices, news, and fire data in parallel
    const [prices, news, fires] = await Promise.all([
      fetchAllPrices().catch((e: Error) => {
        console.error("[DB] Prices fetch failed:", e.message);
        return null;
      }),
      fetchNews().catch((e: Error) => {
        console.error("[DB] News fetch failed:", e.message);
        return null;
      }),
      fetchFireData().catch((e: Error) => {
        console.error("[DB] Fire data fetch failed:", e.message);
        return null;
      }),
    ]);

    if (prices) dbSet("prices", prices);
    // Only store news if we got actual articles (don't overwrite with empty on rate limit)
    if (news && news.ticker && news.ticker.length > 0) {
      dbSet("news", news);
    } else {
      console.log("[DB] GDELT returned 0 articles — keeping previous data");
    }

    // Store fire data
    if (fires && fires.length > 0) {
      dbSet("fires", fires);
    }

    // Fetch chart histories sequentially to avoid overwhelming Yahoo Finance
    const historySymbols = ["BZ=F", "CL=F", "NG=F", "GC=F", "RB=F", "HO=F"];
    for (const sym of historySymbols) {
      try {
        const data = await fetchHistory(sym, 60);
        if (data && data.length > 0) dbSet(`history:${sym}`, data);
      } catch {
        // skip
      }
    }

    // Compute derived data
    const brentPrice = prices?.oil?.brent?.price ?? dbGet<number>("derived:brentPrice") ?? 80;
    const rbobPrice = prices?.gasoline?.price ?? 2.80;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const vixPrice = (prices as any)?.vix?.price ?? 20;

    dbSet("derived:brentPrice", brentPrice);
    dbSet("derived:gasByState", computeGasByState(rbobPrice));
    dbSet("derived:shipping", estimateShippingDisruption(brentPrice));
    dbSet("derived:vix", vixPrice);
    dbSet("derived:consumerConfidence",
      Math.round(Math.max(40, Math.min(105, 120 - vixPrice * 2)) * 10) / 10
    );

    // Conflict metrics from news data (only update if we got articles)
    if (news?.metrics && news.metrics.totalArticles > 0) {
      dbSet("derived:metrics", news.metrics);
    }

    state.lastRefresh = Date.now();
    saveToDisk();

    const elapsed = ((Date.now() - start) / 1000).toFixed(1);
    console.log(
      `[DB] Refresh complete in ${elapsed}s — prices: ${!!prices}, news: ${news?.ticker?.length ?? 0} articles`
    );
  } catch (e) {
    console.error("[DB] Refresh error:", e);
  } finally {
    globalForDb.__dbRefreshing = false;
  }
}

// ─── Start the refresh loop ──────────────────────────────────────────

export function ensureStarted(): void {
  if (globalForDb.__dbStarted) return;
  globalForDb.__dbStarted = true;

  loadFromDisk();

  // If data is stale (> 10 min) or empty, refresh now
  const stale = Date.now() - state.lastRefresh > 10 * 60 * 1000;
  const empty = !state.store.prices;

  if (stale || empty) {
    console.log(`[DB] Scheduling initial refresh (stale: ${stale}, empty: ${empty})`);
    // Defer refresh so it doesn't block the first API response
    setTimeout(() => refreshAll(), 500);
  } else {
    console.log(`[DB] Using cached data from ${new Date(state.lastRefresh).toISOString()}`);
  }

  // Start periodic refresh
  if (globalForDb.__dbTimer) clearInterval(globalForDb.__dbTimer);
  globalForDb.__dbTimer = setInterval(refreshAll, REFRESH_INTERVAL);
  console.log(`[DB] Refresh loop started — every ${REFRESH_INTERVAL / 1000}s`);
}
