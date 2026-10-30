import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Daily-brief subscribers, kept in the same persistent .data directory as
 * the cache. A few hundred rows in a JSON file is the right size for this;
 * a database would be more moving parts than the list justifies.
 *
 * Double opt-in: a row starts unconfirmed and only receives the brief after
 * the address clicks the link in the confirmation email, so nobody can put
 * someone else on the list. Every email carries a one-click unsubscribe
 * link keyed by the row token, as CASL requires. Unconfirmed rows older
 * than two days are dropped.
 */
const FILE = path.join(process.cwd(), ".data", "subscribers.json");
// Unconfirmed rows (and their confirmation-send counters) expire after two
// days, so a stranger burning an address's four sends only delays the real
// owner until the row ages out, never permanently.
const PENDING_TTL_MS = 2 * 24 * 60 * 60 * 1000;

export interface Subscriber {
  email: string;
  token: string;
  createdAt: string;
  source: string;
  confirmed: boolean;
  confirmedAt?: string;
  /** When the last confirmation email went out, and how many have. */
  confirmSentAt?: string;
  confirmSends?: number;
}

const CONFIRM_COOLDOWN_MS = 10 * 60 * 1000;
const CONFIRM_MAX_SENDS = 4;

function readAll(): Subscriber[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    const rows = JSON.parse(fs.readFileSync(FILE, "utf-8")) as Subscriber[];
    const cutoff = Date.now() - PENDING_TTL_MS;
    return rows.filter((r) => r.confirmed || new Date(r.createdAt).getTime() > cutoff);
  } catch {
    return [];
  }
}

function writeAll(rows: Subscriber[]): void {
  fs.mkdirSync(path.dirname(FILE), { recursive: true });
  const tmp = FILE + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 1));
  fs.renameSync(tmp, FILE);
}

/** Confirmed addresses only: the ones the brief goes to. */
export function listSubscribers(): Subscriber[] {
  return readAll().filter((r) => r.confirmed);
}

export function subscriberCount(): number {
  return listSubscribers().length;
}

// Strict on purpose: a plain mailbox@domain.tld with no quoting, brackets or
// control characters, so the address is safe to echo back on a page.
const EMAIL = /^[A-Za-z0-9._%+-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;

export function isValidEmail(email: string): boolean {
  return EMAIL.test(email) && email.length <= 254;
}

/**
 * Adds or re-finds the address. Returns the row and whether it is already
 * confirmed, so the caller knows whether to send a confirmation email.
 */
export function addSubscriber(email: string, source: string): { row: Subscriber; existed: boolean } {
  const e = email.trim().toLowerCase();
  if (!isValidEmail(e)) throw new Error("invalid email");
  const rows = readAll();
  const hit = rows.find((r) => r.email === e);
  if (hit) return { row: hit, existed: true };
  const row: Subscriber = {
    email: e,
    token: crypto.randomBytes(16).toString("hex"),
    createdAt: new Date().toISOString(),
    source,
    confirmed: false,
  };
  rows.push(row);
  writeAll(rows);
  return { row, existed: false };
}

/**
 * Records that a confirmation email is about to go to this row, or says no:
 * at most one every ten minutes and four in total, so a stranger typing
 * someone else's address cannot flood that inbox.
 */
export function markConfirmationSent(token: string): boolean {
  const rows = readAll();
  const hit = rows.find((r) => r.token === token);
  if (!hit || hit.confirmed) return false;
  const sends = hit.confirmSends ?? 0;
  if (sends >= CONFIRM_MAX_SENDS) return false;
  if (hit.confirmSentAt && Date.now() - new Date(hit.confirmSentAt).getTime() < CONFIRM_COOLDOWN_MS) return false;
  hit.confirmSentAt = new Date().toISOString();
  hit.confirmSends = sends + 1;
  writeAll(rows);
  return true;
}

/** Marks the row confirmed; returns the email, or null for an unknown token. */
export function confirmSubscriber(token: string): string | null {
  const rows = readAll();
  const hit = rows.find((r) => r.token === token);
  if (!hit) return null;
  if (!hit.confirmed) {
    hit.confirmed = true;
    hit.confirmedAt = new Date().toISOString();
    writeAll(rows);
  }
  return hit.email;
}

/** Removes by token; returns the email that was removed, or null. */
export function removeSubscriber(token: string): string | null {
  const rows = readAll();
  const hit = rows.find((r) => r.token === token);
  if (!hit) return null;
  writeAll(rows.filter((r) => r.token !== token));
  return hit.email;
}
