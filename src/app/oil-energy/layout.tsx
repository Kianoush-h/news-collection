import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "Oil & Energy — Crude, Gas, Stocks Live";
const description =
  "Live oil and energy markets: Brent and WTI crude, natural gas, gold, defense and energy stocks, commodities, and alternative shipping routes.";

export const metadata: Metadata = {
  title,
  description,
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
  alternates: alternates("/oil-energy"),
  openGraph: openGraph({ title, description, path: "/oil-energy" }),
  twitter: twitter({ title, description }),
};

export default function OilEnergyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
