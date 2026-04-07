// Generates realistic mock data for the dashboards
// In production, these would be replaced with real API calls

export function generateOilPriceHistory() {
  const data = [];
  let price = 89;
  const startDate = new Date("2026-02-20");

  for (let i = 0; i < 46; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    // War started Feb 28 — prices spike
    if (i >= 8) {
      price += Math.random() * 3 + 0.5;
    } else {
      price += (Math.random() - 0.5) * 1.5;
    }
    // Strait closure ~Mar 2 — bigger spike
    if (i >= 10) {
      price += Math.random() * 1.2;
    }

    data.push({
      time: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.round(price * 100) / 100,
    });
  }
  return data;
}

export function generateGasPriceHistory() {
  const data = [];
  let price = 3.45;
  const startDate = new Date("2026-02-20");

  for (let i = 0; i < 46; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);

    if (i >= 8) price += Math.random() * 0.08 + 0.02;
    else price += (Math.random() - 0.5) * 0.03;

    data.push({
      time: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.round(price * 100) / 100,
    });
  }
  return data;
}

export function generateShippingVolume() {
  const data = [];
  let volume = 21; // million barrels/day

  for (let i = 0; i < 46; i++) {
    const date = new Date("2026-02-20");
    date.setDate(date.getDate() + i);

    if (i >= 10) {
      volume = Math.max(0.5, volume - Math.random() * 2);
    } else {
      volume += (Math.random() - 0.5) * 0.5;
    }

    data.push({
      time: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.round(volume * 10) / 10,
    });
  }
  return data;
}

export function generateStockData(baseline: number, volatility: number) {
  const data = [];
  let price = baseline;

  for (let i = 0; i < 46; i++) {
    const date = new Date("2026-02-20");
    date.setDate(date.getDate() + i);
    price += (Math.random() - 0.4) * volatility;
    data.push({
      time: `${date.getMonth() + 1}/${date.getDate()}`,
      value: Math.round(price * 100) / 100,
    });
  }
  return data;
}

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

export const energyStocks = [
  { name: "ExxonMobil (XOM)", price: 189.45, change: +32.4, pct: "+20.6%" },
  { name: "Chevron (CVX)", price: 234.12, change: +41.2, pct: "+21.4%" },
  { name: "ConocoPhillips (COP)", price: 178.34, change: +28.7, pct: "+19.2%" },
  { name: "Lockheed Martin (LMT)", price: 612.78, change: +87.3, pct: "+16.6%" },
  { name: "Raytheon (RTX)", price: 145.23, change: +22.1, pct: "+17.9%" },
  { name: "Northrop Grumman (NOC)", price: 578.90, change: +65.4, pct: "+12.7%" },
];

export const commodityPrices = [
  { name: "Brent Crude", value: "$142.38", change: "+$53.12", pct: "+59.5%", since: "Feb 27" },
  { name: "WTI Crude", value: "$138.92", change: "+$49.87", pct: "+56.0%", since: "Feb 27" },
  { name: "Natural Gas", value: "$8.45", change: "+$4.12", pct: "+95.2%", since: "Feb 27" },
  { name: "Gold", value: "$3,245", change: "+$412", pct: "+14.5%", since: "Feb 27" },
  { name: "Wheat", value: "$892", change: "+$145", pct: "+19.4%", since: "Feb 27" },
  { name: "Jet Fuel", value: "$4.89/gal", change: "+$1.92", pct: "+64.6%", since: "Feb 27" },
];

export const shipTrackingData = [
  { name: "Oil Tankers in Strait", before: 85, now: 3, status: "critical" },
  { name: "Ships Rerouted (Cape)", before: 2, now: 78, status: "warning" },
  { name: "Ships Waiting (Oman)", before: 0, now: 42, status: "warning" },
  { name: "Avg Transit Delay", before: "0 days", now: "14+ days", status: "critical" },
];
