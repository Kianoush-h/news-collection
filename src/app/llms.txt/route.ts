import { articles } from "@/lib/articles";
import { listBriefs } from "@/lib/brief";

const baseUrl = "https://crisiswatch.ca";

// The brief list grows daily, so this is rendered per request (cached 1 h).
export const dynamic = "force-dynamic";

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

  lines.push(`## Daily brief (new every morning, 06:00 America/Toronto)`);
  lines.push("");
  lines.push(
    `- [All briefs](${baseUrl}/brief): one article per day summarising overnight developments, the oil and gas moves, the Strait of Hormuz and what to watch, with the headlines it was built from. Full text of recent briefs is in /llms-full.txt.`,
  );
  for (const b of listBriefs().slice(0, 7)) {
    lines.push(`- [${b.dateLabel}: ${b.title}](${baseUrl}/brief/${b.date}): ${b.summary}`);
  }
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
