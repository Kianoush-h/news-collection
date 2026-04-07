"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseLiveDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => void;
}

export function useLiveData<T>(
  url: string,
  intervalMs: number = 60000
): UseLiveDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const mountedRef = useRef(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (mountedRef.current) {
        setData(json);
        setError(null);
        setLastUpdated(new Date());
        setLoading(false);
      }
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : "Fetch failed");
        setLoading(false);
      }
    }
  }, [url]);

  useEffect(() => {
    mountedRef.current = true;
    fetchData();
    const id = setInterval(fetchData, intervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(id);
    };
  }, [fetchData, intervalMs]);

  return { data, loading, error, lastUpdated, refresh: fetchData };
}

// Convenience: fetch once (e.g. for chart history that doesn't need polling)
export function useFetchOnce<T>(url: string): UseLiveDataResult<T> {
  return useLiveData<T>(url, 600_000); // refresh every 10 min
}
