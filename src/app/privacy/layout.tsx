import type { Metadata } from "next";
import { alternates, openGraph, twitter } from "@/lib/seo";

const title = "Privacy Policy";
const description =
  "Privacy Policy for Crisis Watch — what we collect, how we use it, cookies, third-party data sources, retention, and your rights.";

export const metadata: Metadata = {
  title,
  description,
  keywords: [
    "Crisis Watch privacy policy",
    "Crisis Watch cookies",
    "data collection",
    "Google Analytics opt-out",
    "GDPR Iran war dashboard",
  ],
  alternates: alternates("/privacy"),
  openGraph: openGraph({ title, description, path: "/privacy" }),
  twitter: twitter({ title, description }),
};

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
