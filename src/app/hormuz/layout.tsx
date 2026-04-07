import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Strait of Hormuz Live Tracker — Ship Blockade & Oil Flow",
  description:
    "Live tracking of the Strait of Hormuz blockade. See ship positions, oil flow data, reroute paths via Cape of Good Hope, and IRGC naval positions. Day 36 of the blockade.",
  keywords: [
    "Strait of Hormuz blockade",
    "Hormuz ship tracking",
    "oil tanker blockade",
    "IRGC navy",
    "oil flow Hormuz",
    "shipping reroute Cape of Good Hope",
    "Hormuz live map",
  ],
  openGraph: {
    title: "Strait of Hormuz Live Tracker — Crisis Watch",
    description:
      "Live map: ship positions, blockade zones, oil flow data. Day 36 of the IRGC blockade of the world's most critical oil chokepoint.",
  },
};

export default function HormuzLayout({ children }: { children: React.ReactNode }) {
  return children;
}
