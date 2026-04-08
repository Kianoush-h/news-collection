// Simple in-memory TTL cache for server-side API route caching
const store = new Map<string, { value: unknown; expiresAt: number }>();

export function cacheGet<T>(key: string): T | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }
  return entry.value as T;
}

export function cacheSet<T>(key: string, value: T, ttlMs: number): void {
  store.set(key, { value, expiresAt: Date.now() + ttlMs });
}

// Get cached value, or fetch and cache it
// If shouldCache returns false, the value is returned but not stored
export async function cached<T>(
  key: string,
  ttlMs: number,
  fetcher: () => Promise<T>,
  shouldCache?: (value: T) => boolean
): Promise<T> {
  const existing = cacheGet<T>(key);
  if (existing !== null) return existing;

  const value = await fetcher();
  if (!shouldCache || shouldCache(value)) {
    cacheSet(key, value, ttlMs);
  }
  return value;
}
