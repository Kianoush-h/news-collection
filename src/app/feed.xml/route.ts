import { dbGet, ensureStarted } from "@/lib/db";
import { articles } from "@/lib/articles";

const baseUrl = "https://crisiswatch.ca";

interface BlogPost {
  id: string;
  time: string;
  category: string;
  title: string;
  body: string;
  source?: string;
  url?: string;
}

function escape(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function rfc822(iso: string): string {
  return new Date(iso).toUTCString();
}

export async function GET() {
  ensureStarted();
  const news = dbGet<{ blog: BlogPost[] }>("news");
  const livePosts = (news?.blog ?? []).slice(0, 30);

  const items: string[] = [];

  for (const a of articles) {
    const url = `${baseUrl}/blog/${a.slug}`;
    items.push(`    <item>
      <title>${escape(a.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${rfc822(`${a.dateModified}T12:00:00Z`)}</pubDate>
      <category>${escape(a.category)}</category>
      <description>${escape(a.description)}</description>
    </item>`);
  }

  for (const p of livePosts) {
    const link = p.url ?? `${baseUrl}/blog`;
    items.push(`    <item>
      <title>${escape(p.title)}</title>
      <link>${escape(link)}</link>
      <guid isPermaLink="false">${escape(p.id)}</guid>
      <pubDate>${rfc822(p.time)}</pubDate>
      <category>${escape(p.category)}</category>
      ${p.source ? `<source url="${baseUrl}/blog">${escape(p.source)}</source>` : ""}
      <description>${escape(p.body)}</description>
    </item>`);
  }

  const lastBuild = rfc822(new Date().toISOString());

  const xml = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Crisis Watch — Live Iran-US Conflict Updates</title>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Real-time tracking of the Iran-US conflict: oil prices, Strait of Hormuz blockade, gas prices, war timeline, and global impact.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <ttl>5</ttl>
${items.join("\n")}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=300, stale-while-revalidate=900",
    },
  });
}
