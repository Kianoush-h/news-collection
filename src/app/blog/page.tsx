import BlogClient from "./BlogClient";
import { dbGet, ensureStarted } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

// Revalidate every 5 minutes so the LiveBlogPosting JSON-LD picks up new
// headlines as the underlying news cache refreshes.
export const revalidate = 300;

const CONFLICT_START = "2026-02-28";

interface BlogPost {
  id: string;
  time: string;
  title: string;
  body: string;
  url?: string;
}

function dayOfConflict(): number {
  return Math.max(
    1,
    Math.ceil((Date.now() - new Date(CONFLICT_START).getTime()) / 86400000),
  );
}

export default async function BlogIndexPage() {
  ensureStarted();
  const news = dbGet<{ blog: BlogPost[] }>("news");
  const recent = (news?.blog ?? []).slice(0, 10);

  const liveBlogJsonLd = {
    "@context": "https://schema.org",
    "@type": "LiveBlogPosting",
    "@id": `${SITE_URL}/blog`,
    url: `${SITE_URL}/blog`,
    headline: `Iran-US Conflict Live Updates — Day ${dayOfConflict()}`,
    description:
      "Real-time coverage of the Iran-US war including Strait of Hormuz blockade, oil-market reaction, and diplomatic milestones.",
    coverageStartTime: `${CONFLICT_START}T00:00:00Z`,
    publisher: {
      "@type": "Organization",
      name: "Crisis Watch",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/icon`,
      },
    },
    liveBlogUpdate: recent.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      datePublished: p.time,
      url: p.url ?? `${SITE_URL}/blog`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(liveBlogJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <BlogClient />
    </>
  );
}
