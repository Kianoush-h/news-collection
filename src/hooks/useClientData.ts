"use client";

import { useState, useEffect } from "react";

/**
 * Only generates data on the client after mount to avoid hydration mismatch
 * from Math.random() producing different values on server vs client.
 */
export function useClientData<T>(generator: () => T): T | null {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    setData(generator());
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return data;
}
