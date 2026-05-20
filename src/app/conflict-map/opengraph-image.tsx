import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "Iran-US Conflict Live Map and Timeline";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "Conflict Map",
    title: "Live map and timeline of the Iran-US war",
    subtitle:
      "Airstrikes, missile attacks, naval actions, and diplomatic events since February 28.",
    accent: "red",
    badge: "LIVE MAP",
  });
}
