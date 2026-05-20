import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "Oil & Energy Crisis Dashboard";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "Oil & Energy",
    title: "Live crude, gas, and defense markets",
    subtitle:
      "Brent, WTI, RBOB gasoline, natural gas, gold, and the equities that move with the conflict.",
    accent: "amber",
    badge: "MARKETS",
  });
}
