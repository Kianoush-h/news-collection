import type { Metadata } from "next";

export const SITE_URL = "https://crisiswatch.ca";

/**
 * Build the per-route alternates block. Re-declares the RSS alternate type
 * on every page because Next.js's metadata merging REPLACES (not merges)
 * the alternates field when a child route declares its own canonical.
 */
export function alternates(path: string): Metadata["alternates"] {
  return {
    canonical: path,
    types: {
      "application/rss+xml": [
        { url: "/feed.xml", title: "Crisis Watch — Live Iran-US Conflict Updates" },
      ],
    },
  };
}

/**
 * Build the openGraph block with site defaults. Each page passes its own
 * title and description; everything else (images, type, url, locale) is
 * filled in from sane defaults so social cards never go bare.
 */
export function openGraph(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}): Metadata["openGraph"] {
  return {
    type: opts.type ?? "website",
    siteName: "Crisis Watch",
    locale: "en_US",
    title: opts.title,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: opts.title,
      },
    ],
  };
}

/**
 * Build the twitter block. Always summary_large_image with a card image so
 * Twitter / X never renders the generic blue link card.
 */
export function twitter(opts: {
  title: string;
  description: string;
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: opts.title,
    description: opts.description,
    images: ["/twitter-image"],
  };
}
