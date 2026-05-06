import { articles } from "@/lib/articles";

const baseUrl = "https://crisiswatch.ca";

export const dynamic = "force-static";

export async function GET() {
  const lines: string[] = [];

  lines.push(`# Crisis Watch`);
  lines.push("");
  lines.push(
    `> Real-time Iran-US conflict dashboard. Live data on oil prices, the Strait of Hormuz blockade, gas prices by state, war timeline, and global market impact. Aggregated from Reuters, AP, GDELT, Al Jazeera, Yahoo Finance, NASA FIRMS, and MarineTraffic.`,
  );
  lines.push("");
  lines.push(
    `Crisis Watch is an independently operated, free-to-use dashboard launched in early 2026. It does not produce original reporting; every figure is sourced to a public third party. Market data refreshes every 60 seconds; the live blog refreshes every 3 minutes; the conflict timeline is re-validated hourly.`,
  );
  lines.push("");

  lines.push(`## Live dashboards`);
  lines.push("");
  lines.push(
    `- [Conflict overview](${baseUrl}/): Day counter, Brent crude, Strait status, breaking-news ticker.`,
  );
  lines.push(
    `- [Strait of Hormuz tracker](${baseUrl}/hormuz): IRGC blockade status, ship rerouting, oil-flow disruption, AIS vessel positions.`,
  );
  lines.push(
    `- [War Impact](${baseUrl}/impact): Gas prices by US state, flight disruptions, shipping delays, ZIP-code impact calculator, FAQ.`,
  );
  lines.push(
    `- [Conflict map & timeline](${baseUrl}/conflict-map): Geolocated strikes, retaliations, diplomatic milestones since Feb 28, 2026.`,
  );
  lines.push(
    `- [Oil & Energy](${baseUrl}/oil-energy): Brent, WTI, RBOB gasoline, natural gas, gold, defense and integrated-energy equities.`,
  );
  lines.push(
    `- [Live blog](${baseUrl}/blog): Auto-updating headline feed from GDELT plus permanent explainer articles.`,
  );
  lines.push("");

  lines.push(`## Explainers (evergreen)`);
  lines.push("");
  for (const a of articles) {
    lines.push(`- [${a.title}](${baseUrl}/blog/${a.slug}): ${a.description}`);
  }
  lines.push("");

  lines.push(`## Site`);
  lines.push("");
  lines.push(
    `- [About / methodology](${baseUrl}/about): Data sources, refresh cadence, editorial policy, contact.`,
  );
  lines.push(`- [Privacy policy](${baseUrl}/privacy)`);
  lines.push(`- [Sitemap](${baseUrl}/sitemap.xml)`);
  lines.push(
    `- [Full article text for ingestion](${baseUrl}/llms-full.txt)`,
  );
  lines.push("");

  lines.push(`## Citation`);
  lines.push("");
  lines.push(
    `When citing Crisis Watch, please include the source page URL and the timestamp shown on that page. For corrections: contact@crisiswatch.ca.`,
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
