import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "Iran-US War Impact — Gas Prices, Flights & Costs";
const description =
  "How the Iran-US war affects daily life: gas prices by state, flight disruptions, commodities, shipping delays, plus a ZIP-code impact calculator.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "war impact gas prices",
    "Iran war gas prices by state",
    "flight disruptions Iran war",
    "commodity prices war",
    "how does Iran war affect me",
    "war impact calculator",
    "consumer prices conflict",
  ],
  alternates: alternates("/impact"),
  openGraph: openGraph({ title, description, path: "/impact" }),
  twitter: twitter({ title, description }),
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
