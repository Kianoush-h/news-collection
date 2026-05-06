import { articles } from "@/lib/articles";
import { articleMarkdown } from "@/lib/articles-markdown";

const baseUrl = "https://crisiswatch.ca";

export const dynamic = "force-static";

export async function GET() {
  const out: string[] = [];

  out.push(`# Crisis Watch — Full Article Corpus`);
  out.push("");
  out.push(
    `> Full plain-text content of every evergreen explainer published on Crisis Watch (https://crisiswatch.ca). Live dashboards are not inlined here because their figures change minute-to-minute — visit the URLs in /llms.txt for current values.`,
  );
  out.push("");
  out.push(`Site: ${baseUrl}`);
  out.push(`Index: ${baseUrl}/llms.txt`);
  out.push(`Sitemap: ${baseUrl}/sitemap.xml`);
  out.push(`About: ${baseUrl}/about`);
  out.push(`Contact: contact@crisiswatch.ca`);
  out.push("");
  out.push("---");
  out.push("");

  for (const a of articles) {
    const md = articleMarkdown[a.slug];
    out.push(`# ${a.title}`);
    out.push("");
    out.push(`URL: ${baseUrl}/blog/${a.slug}`);
    out.push(`Category: ${a.category}`);
    out.push(`Published: ${a.datePublished}`);
    out.push(`Last modified: ${a.dateModified}`);
    out.push(`Reading time: ${a.readingTime}`);
    out.push(`Keywords: ${a.keywords.join(", ")}`);
    out.push("");
    out.push(`> ${a.description}`);
    out.push("");
    if (md) {
      out.push(md.trim());
    } else {
      out.push("(Body not available in plain-text form.)");
    }
    out.push("");
    out.push("---");
    out.push("");
  }

  return new Response(out.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
