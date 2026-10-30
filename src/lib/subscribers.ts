import fs from "fs";
import path from "path";
import crypto from "crypto";

/**
 * Daily-brief subscribers, kept in the same persistent .data directory as
 * the cache. A few hundred rows in a JSON file is the right size for this;
 * a database would be more moving parts than the list justifies.
 *
 * Consent is explicit (a checkbox on the form) and every email carries a
 * one-click unsubscribe link keyed by the row token, as CASL requires.
 */
const FILE = path.join(process.cwd(), ".data", "subscribers.json");

export interface Subscriber {
  email: string;
  token: string;
  createdAt: string;
  source: string;
}

function readAll(): Subscriber[] {
  try {
    if (!fs.existsSync(FILE)) return [];
    return JSON.parse(fs.readFileSync(FILE, "utf-8")) as Subscriber[];
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

export function listSubscribers(): Subscriber[] {
  return readAll();
}

export function subscriberCount(): number {
  return readAll().length;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Adds the address; returns false when it was already there. */
export function addSubscriber(email: string, source: string): boolean {
  const e = email.trim().toLowerCase();
  if (!EMAIL.test(e) || e.length > 254) throw new Error("invalid email");
  const rows = readAll();
  if (rows.some((r) => r.email === e)) return false;
  rows.push({
    email: e,
    token: crypto.randomBytes(16).toString("hex"),
    createdAt: new Date().toISOString(),
    source,
  });
  writeAll(rows);
  return true;
}

/** Removes by token; returns the email that was removed, or null. */
export function removeSubscriber(token: string): string | null {
  const rows = readAll();
  const hit = rows.find((r) => r.token === token);
  if (!hit) return null;
  writeAll(rows.filter((r) => r.token !== token));
  return hit.email;
}
