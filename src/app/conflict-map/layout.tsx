import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "Iran-US Conflict Live Map & Timeline";
const description =
  "Interactive map of the Iran-US war. Airstrikes, missile attacks, naval actions, and diplomatic events on a live map with a full conflict timeline.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Iran war map",
    "Iran US conflict map",
    "Iran airstrikes map",
    "Iran war timeline",
    "Middle East conflict map",
    "Iran missile strikes",
    "war events timeline 2026",
  ],
  alternates: alternates("/conflict-map"),
  openGraph: openGraph({ title, description, path: "/conflict-map" }),
  twitter: twitter({ title, description }),
};

export default function ConflictMapLayout({ children }: { children: React.ReactNode }) {
  return children;
}
