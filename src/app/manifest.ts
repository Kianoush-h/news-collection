import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Crisis Watch — Live Iran-US War Dashboard",
    short_name: "Crisis Watch",
    description:
      "Real-time Iran-US conflict dashboard. Oil prices, Strait of Hormuz status, gas prices, and live news.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#06060b",
    theme_color: "#06060b",
    categories: ["news", "finance", "utilities"],
    lang: "en",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/icon",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
