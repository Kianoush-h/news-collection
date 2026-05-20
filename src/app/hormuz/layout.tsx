import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "Strait of Hormuz Blockade Live Tracker";
const description =
  "Live tracker of the Strait of Hormuz blockade: ship positions, oil flow disruption, reroute paths via the Cape of Good Hope, and IRGC naval status.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Strait of Hormuz blockade",
    "Hormuz ship tracking",
    "oil tanker blockade",
    "IRGC navy",
    "oil flow Hormuz",
    "shipping reroute Cape of Good Hope",
    "Hormuz live map",
  ],
  alternates: alternates("/hormuz"),
  openGraph: openGraph({ title, description, path: "/hormuz" }),
  twitter: twitter({ title, description }),
};

export default function HormuzLayout({ children }: { children: React.ReactNode }) {
  return children;
}
