import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iran-US Conflict Live Map & Timeline — Strikes & Events",
  description:
    "Interactive map of the Iran-US war. See all airstrikes, missile attacks, naval actions, and diplomatic events on a live map with a full conflict timeline from Day 1.",
  keywords: [
    "Iran war map",
    "Iran US conflict map",
    "Iran airstrikes map",
    "Iran war timeline",
    "Middle East conflict map",
    "Iran missile strikes",
    "war events timeline 2026",
  ],
  openGraph: {
    title: "Iran-US Conflict Live Map & Timeline — Crisis Watch",
    description:
      "Interactive map: 240+ strikes, 85+ retaliations, 3 failed ceasefires. Full timeline from Feb 28 to today.",
  },
};

export default function ConflictMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
