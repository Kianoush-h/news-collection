import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://crisiswatch.ca"),
  title: {
    default: "Crisis Watch — Live Iran-US War Dashboard | Real-Time Updates",
    template: "%s | Crisis Watch",
  },
  description:
    "Live dashboard tracking the Iran-US conflict in real-time. Oil prices, Strait of Hormuz blockade status, gas prices, war timeline, and how it affects your daily life. Updated every 60 seconds.",
  keywords: [
    "Iran war",
    "Iran US conflict",
    "Strait of Hormuz",
    "oil prices today",
    "gas prices war",
    "Iran war live updates",
    "Iran US war dashboard",
    "oil crisis 2026",
    "Hormuz blockade",
    "war impact gas prices",
    "Iran ceasefire",
    "Trump Iran deadline",
    "crude oil price live",
    "defense stocks",
    "Iran war map",
    "Iran war timeline",
    "Middle East conflict tracker",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    title: "Crisis Watch — Live Iran-US War Dashboard",
    description:
      "Real-time tracking of the Iran-US conflict. Oil prices, Strait of Hormuz status, gas prices, war map, and daily life impact. Updated every 60 seconds.",
    siteName: "Crisis Watch",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Crisis Watch — Live Iran-US War Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Crisis Watch — Live Iran-US War Dashboard",
    description:
      "Real-time tracking: oil prices, Strait of Hormuz blockade, gas prices, war map & timeline. How does the Iran-US conflict affect you?",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        />
        {/* Structured Data for Google Rich Results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Crisis Watch",
              description:
                "Real-time dashboard tracking the Iran-US conflict, oil prices, Strait of Hormuz, and global impact.",
              applicationCategory: "NewsApplication",
              operatingSystem: "Web",
              offers: {
                "@type": "Offer",
                price: "0",
                priceCurrency: "USD",
              },
              author: {
                "@type": "Organization",
                name: "Crisis Watch",
              },
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LiveBlogPosting",
              headline: "Iran-US Conflict Live Updates — Day 38",
              description:
                "Live coverage of the Iran-US war including Strait of Hormuz blockade, oil prices, and ceasefire negotiations.",
              coverageStartTime: "2026-02-28T00:00:00Z",
              liveBlogUpdate: [
                {
                  "@type": "BlogPosting",
                  headline:
                    "Iran rejects 45-day ceasefire, demands permanent solution",
                  datePublished: "2026-04-06T18:00:00Z",
                },
                {
                  "@type": "BlogPosting",
                  headline:
                    "Trump sets 8pm ET deadline for Strait of Hormuz reopening",
                  datePublished: "2026-04-07T10:00:00Z",
                },
              ],
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex bg-background text-foreground">
        <Sidebar />
        <div className="flex-1 flex flex-col ml-[260px]">
          <Header />
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>
      </body>
    </html>
  );
}
