// Curated editorial data — content that cannot come from free APIs.
// Update this file manually as the situation evolves.

export const CONFLICT_START = "2026-02-28";
export const BLOCKADE_START = "2026-03-02";

export function getDayOfConflict(): number {
  const start = new Date(CONFLICT_START);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86400000));
}

export function getDayOfBlockade(): number {
  const start = new Date(BLOCKADE_START);
  const now = new Date();
  return Math.max(1, Math.ceil((now.getTime() - start.getTime()) / 86400000));
}

export const straitStatus = {
  status: "CLOSED" as const,
  oilFlow: "0.3 mb/d",
  oilFlowDetail: "Down from 21 mb/d",
  shipsRerouted: 78,
  shipsWaiting: 42,
  avgDelay: "14+ days",
};

export const conflictEvents = [
  {
    date: "Feb 28",
    title: "US-Israeli Airstrikes Begin",
    description:
      "Coordinated surprise strikes on military and government targets across Iran. Supreme Leader Khamenei killed.",
    type: "strike" as const,
    lat: 35.6892,
    lng: 51.389,
    severity: "critical" as const,
  },
  {
    date: "Mar 1",
    title: "Iran Retaliatory Missile Strikes",
    description:
      "Iran launches over 300 ballistic missiles and drones targeting Israel and US bases in Iraq and Qatar.",
    type: "strike" as const,
    lat: 31.7683,
    lng: 35.2137,
    severity: "critical" as const,
  },
  {
    date: "Mar 2",
    title: "Strait of Hormuz Closed",
    description:
      "IRGC Navy deploys mines and fast-attack boats, effectively closing the strait to commercial shipping.",
    type: "blockade" as const,
    lat: 26.5667,
    lng: 56.25,
    severity: "critical" as const,
  },
  {
    date: "Mar 5",
    title: "US Strikes on IRGC Naval Bases",
    description:
      "US Navy and Air Force strike IRGC Navy bases along the Persian Gulf coast.",
    type: "strike" as const,
    lat: 27.1832,
    lng: 56.2666,
    severity: "high" as const,
  },
  {
    date: "Mar 10",
    title: "Iran Strikes US Base in Qatar",
    description:
      "Ballistic missiles hit Al Udeid Air Base. US reports 12 casualties.",
    type: "strike" as const,
    lat: 25.1174,
    lng: 51.315,
    severity: "critical" as const,
  },
  {
    date: "Mar 15",
    title: "Oil Hits $120/barrel",
    description:
      "Brent crude surpasses $120 as global oil reserves begin to feel the impact of the strait closure.",
    type: "economic" as const,
    lat: 26.0,
    lng: 56.0,
    severity: "high" as const,
  },
  {
    date: "Mar 20",
    title: "Houthi Attacks on Saudi Oil",
    description:
      "Yemen's Houthis launch drone attacks on Saudi Aramco facilities in solidarity with Iran.",
    type: "strike" as const,
    lat: 25.3548,
    lng: 49.9884,
    severity: "high" as const,
  },
  {
    date: "Mar 25",
    title: "China Offers Mediation",
    description:
      "Beijing announces willingness to mediate, citing economic damage to Chinese energy imports.",
    type: "diplomatic" as const,
    lat: 39.9042,
    lng: 116.4074,
    severity: "medium" as const,
  },
  {
    date: "Apr 1",
    title: "Pakistan-Mediated Talks Begin",
    description:
      "Indirect talks between Iran and US representatives begin in Islamabad.",
    type: "diplomatic" as const,
    lat: 33.6844,
    lng: 73.0479,
    severity: "medium" as const,
  },
  {
    date: "Apr 6",
    title: "Iran Rejects 45-Day Ceasefire",
    description:
      "Iran demands permanent solution including sanctions relief and reconstruction.",
    type: "diplomatic" as const,
    lat: 35.6892,
    lng: 51.389,
    severity: "critical" as const,
  },
  {
    date: "Apr 7",
    title: "Trump's 8pm ET Deadline",
    description:
      "Trump demands Iran reopen Strait of Hormuz by 8pm ET or face bombing of infrastructure.",
    type: "diplomatic" as const,
    lat: 38.8977,
    lng: -77.0365,
    severity: "critical" as const,
  },
];

export const shipTrackingData = [
  { name: "Oil Tankers in Strait", before: 85, now: 3, status: "critical" as const },
  { name: "Ships Rerouted (Cape)", before: 2, now: 78, status: "warning" as const },
  { name: "Ships Waiting (Oman)", before: 0, now: 42, status: "warning" as const },
  { name: "Avg Transit Delay", before: "0 days", now: "14+ days", status: "critical" as const },
];

export const gasPricesByState = [
  { state: "California", price: 7.89, change: "+$2.14" },
  { state: "Hawaii", price: 7.45, change: "+$1.98" },
  { state: "Nevada", price: 6.92, change: "+$1.87" },
  { state: "Washington", price: 6.78, change: "+$1.72" },
  { state: "Oregon", price: 6.65, change: "+$1.69" },
  { state: "New York", price: 6.34, change: "+$1.55" },
  { state: "Florida", price: 5.98, change: "+$1.42" },
  { state: "Texas", price: 5.45, change: "+$1.35" },
  { state: "Ohio", price: 5.32, change: "+$1.28" },
  { state: "Mississippi", price: 5.12, change: "+$1.18" },
];

export const curatedMetrics = {
  flightsDisrupted: 1847,
  consumerConfidence: 62.1,
  majorStrikes: "240+",
  retaliations: "85+",
  ceasefireAttempts: 3,
  breakingAlert:
    "Trump's deadline for Iran to reopen Strait of Hormuz expires tonight at 8:00 PM ET. Iran has rejected the 45-day ceasefire proposal. Pentagon moves additional carrier strike group toward Persian Gulf.",
  flightInfo: [
    {
      label: "No-Fly Zones Active",
      value: "Iran, Iraq, Syria",
      sub: "All commercial airspace closed",
      color: "from-red-500/10 to-transparent",
      textColor: "text-accent-red",
    },
    {
      label: "Airlines Affected",
      value: "38",
      sub: "Rerouting Middle East flights",
      color: "from-amber-500/10 to-transparent",
      textColor: "text-accent-amber",
    },
    {
      label: "Avg Ticket Price Change",
      value: "+34%",
      sub: "For routes through/near region",
      color: "from-red-500/10 to-transparent",
      textColor: "text-accent-red",
    },
  ],
  shippingRoutes: [
    {
      label: "Cape of Good Hope Route",
      value: "+14 days",
      sub: "~11,000 extra nautical miles. $1M+ extra fuel per voyage.",
      color: "from-amber-500/10 to-transparent",
      textColor: "text-accent-amber",
    },
    {
      label: "Suez Canal Congestion",
      value: "+8 days",
      sub: "Wait times surging as more ships reroute through Suez.",
      color: "from-red-500/10 to-transparent",
      textColor: "text-accent-red",
    },
    {
      label: "Insurance Premium Increase",
      value: "+800%",
      sub: "Most insurers have suspended Persian Gulf coverage entirely.",
      color: "from-red-500/10 to-transparent",
      textColor: "text-accent-red",
    },
  ],
};
