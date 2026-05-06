"use client";

import { useSyncExternalStore } from "react";

const noopSubscribe = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

/**
 * Returns false during SSR and the first hydration pass, then true on the client.
 * Use to gate code paths that touch window/document or render-only-on-client UI
 * (portals, browser-API-dependent values) without setState-in-effect.
 */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    getClientSnapshot,
    getServerSnapshot,
  );
}
