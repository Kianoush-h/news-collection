"use client";

import { useState } from "react";

/**
 * "Get the daily brief by email." One field, one consent checkbox, one
 * button. Posts to /api/subscribe and tells the reader exactly what
 * happened; no modal, no second step.
 */
export default function SubscribeBox({ source = "site", compact = false }: { source?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [state, setState] = useState<"idle" | "busy" | "done" | "dup" | "error">("idle");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent) {
      setMsg("Please tick the box so we are allowed to email you.");
      setState("error");
      return;
    }
    setState("busy");
    setMsg("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent: true, source }),
      });
      const data = (await res.json()) as { ok?: boolean; confirmed?: boolean; pending?: boolean; error?: string };
      if (res.ok && data.ok) {
        setState(data.confirmed ? "dup" : "done");
        setMsg(
          data.confirmed
            ? "You are already on the list."
            : "Almost done: we sent a confirmation link to that address. Click it and the next brief lands around 6 am Eastern.",
        );
        setEmail("");
      } else {
        setState("error");
        setMsg(data.error ?? "Something went wrong. Try again in a minute.");
      }
    } catch {
      setState("error");
      setMsg("Network error. Try again in a minute.");
    }
  }

  return (
    <div className={`rounded-2xl border border-card-border bg-card-bg ${compact ? "p-4" : "p-5 sm:p-6"}`}>
      <div className="flex items-start gap-3">
        <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent-blue/15 text-accent-blue">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l9 6 9-6M4 6h16a1 1 0 011 1v10a1 1 0 01-1 1H4a1 1 0 01-1-1V7a1 1 0 011-1z" />
          </svg>
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-bold tracking-tight">Get the daily brief by email</h3>
          <p className="mt-1 text-xs leading-relaxed text-muted-light">
            One email a morning: what happened overnight, where oil and gas went, what to watch. Free, no tracking pixels, unsubscribe in one click.
          </p>
          {state === "done" || state === "dup" ? (
            <p className="mt-3 text-sm text-accent-green">{msg}</p>
          ) : (
            <form onSubmit={submit} className="mt-3 space-y-2">
              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="min-w-0 flex-1 rounded-lg border border-card-border bg-background/60 px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent-blue focus:outline-none"
                  aria-label="Email address"
                />
                <button
                  type="submit"
                  disabled={state === "busy"}
                  className="rounded-lg bg-accent-blue px-4 py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                >
                  {state === "busy" ? "Adding…" : "Subscribe"}
                </button>
              </div>
              <label className="flex items-start gap-2 text-[11px] leading-snug text-muted-light">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 accent-[#4c8dff]"
                />
                <span>
                  I agree to receive the Crisis Watch daily brief by email. I can unsubscribe at any time with the link in every email. See the{" "}
                  <a href="/privacy" className="underline hover:text-foreground">privacy policy</a>.
                </span>
              </label>
              {state === "error" && <p className="text-xs text-accent-red">{msg}</p>}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
