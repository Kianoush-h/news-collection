import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Oil & Energy Crisis Dashboard — Crude, Gas, Stocks Live",
  description:
    "Live oil and energy market data. Brent crude at $142, natural gas, gold prices, energy & defense stock performance, commodity prices, and alternative shipping routes.",
  keywords: [
    "oil price today",
    "crude oil price live",
    "Brent crude price",
    "WTI crude price",
    "energy stocks Iran war",
    "defense stocks 2026",
    "oil crisis dashboard",
    "natural gas price",
    "gold price war",
    "ExxonMobil stock",
    "Lockheed Martin stock",
  ],
  openGraph: {
    title: "Oil & Energy Crisis Dashboard — Crisis Watch",
    description:
      "Live: Brent $142/barrel, gas $5.89/gal. Energy & defense stocks, commodity prices, shipping route analysis.",
  },
};

export default function OilEnergyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
