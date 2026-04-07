import { Metadata } from "next";

export const metadata: Metadata = {
  title: "War Impact on Daily Life — Gas Prices, Flights & Costs",
  description:
    "See how the Iran-US war affects you. Gas prices by state, flight disruptions, commodity prices, shipping delays, and a personal impact calculator by ZIP code.",
  keywords: [
    "war impact gas prices",
    "Iran war gas prices by state",
    "flight disruptions Iran war",
    "commodity prices war",
    "how does Iran war affect me",
    "war impact calculator",
    "consumer prices conflict",
  ],
  openGraph: {
    title: "War Impact on Daily Life — Crisis Watch",
    description:
      "Gas prices up 70%. 1,847 flights disrupted. Enter your ZIP code to see how the Iran-US conflict affects your area.",
  },
};

export default function ImpactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
