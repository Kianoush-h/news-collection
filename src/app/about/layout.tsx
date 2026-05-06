import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Crisis Watch — Methodology, Sources & Editorial Policy",
  description:
    "Crisis Watch aggregates real-time conflict data from Reuters, AP, GDELT, Al Jazeera, Yahoo Finance, and MarineTraffic. Read our methodology, update cadence, editorial policy, and contact information.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Crisis Watch — Methodology & Sources",
    description:
      "How Crisis Watch tracks the Iran-US conflict in real time. Data sources, refresh cadence, and editorial policy.",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
