import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Live Blog — Iran-US War Updates Every Few Minutes",
  description:
    "Auto-updating live blog covering the Iran-US conflict. New analysis, breaking updates, and expert takes every few minutes. Strait of Hormuz, oil prices, ceasefire talks, and more.",
  keywords: [
    "Iran war live blog",
    "Iran US conflict updates",
    "Iran war latest news",
    "Strait of Hormuz news",
    "Iran ceasefire updates",
    "oil prices live updates",
    "Iran war breaking news",
  ],
  openGraph: {
    title: "Live Blog — Iran-US War Updates | Crisis Watch",
    description: "Auto-updating live blog. New analysis every few minutes. Breaking updates on the Iran-US conflict.",
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
