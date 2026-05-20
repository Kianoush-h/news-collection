import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";

export const alt = "Crisis Watch Privacy Policy";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default async function OGImage() {
  return buildOgImage({
    eyebrow: "Privacy",
    title: "What we collect and how we use it",
    subtitle:
      "Anonymous analytics only — no accounts, no ad profiles, no data sold. Your ZIP code stays in your browser.",
    accent: "green",
    badge: "PRIVACY",
  });
}
