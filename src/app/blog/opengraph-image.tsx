import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "Crisis Watch Live Blog — Iran-US Conflict";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "Live Blog",
    title: "Iran-US conflict updates, every few minutes",
    subtitle:
      "Auto-updating headlines from GDELT plus permanent explainer articles on the Strait of Hormuz, gas prices, and more.",
    accent: "purple",
    badge: "LIVE FEED",
  });
}
