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
 *
 * `imagePath` lets a page point at its own per-segment opengraph-image
 * route (e.g. "/hormuz/opengraph-image") so each share preview looks
 * distinct. Pass null to fall through to the segment's own auto-detected
 * opengraph-image.tsx (Next.js will fill it in).
 */
export function openGraph(opts: {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  imagePath?: string;
}): Metadata["openGraph"] {
  const imagePath = opts.imagePath ?? `${opts.path}/opengraph-image`.replace(/\/+/g, "/");
  return {
    type: opts.type ?? "website",
    siteName: "Crisis Watch",
    locale: "en_US",
    title: opts.title,
    description: opts.description,
    url: `${SITE_URL}${opts.path}`,
    images: [
      {
        url: imagePath,
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
  imagePath?: string;
}): Metadata["twitter"] {
  return {
    card: "summary_large_image",
    title: opts.title,
    description: opts.description,
    images: [opts.imagePath ?? "/twitter-image"],
  };
}
