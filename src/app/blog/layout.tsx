import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "Live Blog — Iran-US War Updates";
const description =
  "Auto-updating live blog covering the Iran-US conflict: breaking updates, analysis, Strait of Hormuz news, oil prices, and ceasefire talks.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Iran war live blog",
    "Iran US conflict updates",
    "Iran war latest news",
    "Strait of Hormuz news",
    "Iran ceasefire updates",
    "oil prices live updates",
    "Iran war breaking news",
  ],
  alternates: alternates("/blog"),
  openGraph: openGraph({ title, description, path: "/blog" }),
  twitter: twitter({ title, description }),
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
