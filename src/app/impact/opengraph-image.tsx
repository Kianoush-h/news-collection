import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "Iran-US War Impact on Daily Life";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "War Impact",
    title: "How the conflict affects your daily life",
    subtitle:
      "Gas prices by state, flight disruptions, shipping delays, and a ZIP-code impact calculator.",
    accent: "amber",
    badge: "IMPACT",
  });
}
