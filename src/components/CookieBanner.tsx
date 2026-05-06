"use client";

import { useEffect, useSyncExternalStore } from "react";
import Link from "next/link";

const STORAGE_KEY = "cw_consent_v1";
const CHANGE_EVENT = "cw_consent_change";

type Consent = "accepted" | "rejected";

function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "rejected" ? v : null;
  } catch {
    return null;
  }
}

function subscribeConsent(callback: () => void): () => void {
  window.addEventListener("storage", callback);
  window.addEventListener(CHANGE_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(CHANGE_EVENT, callback);
  };
}

const getServerSnapshot = (): Consent | null => null;

function setGtagConsent(value: Consent) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  if (typeof w.gtag !== "function") return;
  const granted = value === "accepted" ? "granted" : "denied";
  w.gtag("consent", "update", {
    analytics_storage: granted,
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  });
}

export default function CookieBanner() {
  const consent = useSyncExternalStore(
    subscribeConsent,
    readConsent,
    getServerSnapshot,
  );

  useEffect(() => {
    if (consent !== null) setGtagConsent(consent);
  }, [consent]);

  const decide = (choice: Consent) => {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      // ignore — banner will reappear on next visit
    }
    setGtagConsent(choice);
    window.dispatchEvent(new Event(CHANGE_EVENT));
  };

  if (consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
      className="fixed inset-x-3 bottom-3 sm:left-auto sm:right-4 sm:bottom-4 sm:max-w-sm z-[60] animate-slide-in"
    >
      <div className="glass-card p-4 shadow-2xl shadow-black/40">
        <h2 className="text-sm font-bold mb-1">Anonymous analytics</h2>
        <p className="text-xs text-muted-light leading-relaxed">
          Crisis Watch uses Google Analytics to understand which dashboards are
          useful. No ads, no profiles, no data sold. See our{" "}
          <Link href="/privacy" className="text-accent-blue hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => decide("accepted")}
            className="flex-1 px-3 py-2 rounded-lg bg-accent-blue/15 border border-accent-blue/30 text-xs font-semibold text-accent-blue hover:bg-accent-blue/25 transition-colors"
          >
            Allow analytics
          </button>
          <button
            onClick={() => decide("rejected")}
            className="flex-1 px-3 py-2 rounded-lg bg-white/[0.04] border border-card-border text-xs font-semibold text-muted-light hover:bg-white/[0.08] hover:text-foreground transition-colors"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
