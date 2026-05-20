import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "About — Methodology & Data Sources";
const description =
  "How Crisis Watch tracks the Iran-US conflict in real time. Data sources, refresh cadence, editorial policy, and contact information.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Crisis Watch methodology",
    "Iran war data sources",
    "conflict dashboard editorial policy",
    "Reuters AP GDELT aggregator",
    "Crisis Watch contact",
  ],
  alternates: alternates("/about"),
  openGraph: openGraph({ title, description, path: "/about" }),
  twitter: twitter({ title, description }),
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
