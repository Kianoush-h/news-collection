import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "Strait of Hormuz Blockade Live Tracker";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "Strait of Hormuz",
    title: "The world's most critical oil chokepoint",
    subtitle:
      "Live blockade status, ship rerouting, oil-flow disruption, and IRGC naval activity.",
    accent: "cyan",
    badge: "BLOCKADE",
  });
}
