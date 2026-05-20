import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "About Crisis Watch — Methodology and Sources";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "About",
    title: "Methodology, data sources, editorial policy",
    subtitle:
      "How Crisis Watch aggregates Reuters, AP, GDELT, Al Jazeera, Yahoo Finance, NASA FIRMS, and MarineTraffic into one dashboard.",
    accent: "blue",
    badge: "METHODOLOGY",
  });
}
