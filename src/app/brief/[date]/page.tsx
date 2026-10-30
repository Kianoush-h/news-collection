import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubscribeBox from "@/components/SubscribeBox";
import { ensureStarted } from "@/lib/db";
import { getBrief, listBriefs } from "@/lib/brief";
import { alternates, openGraph, twitter, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ date: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { date } = await params;
  const b = getBrief(date);
  if (!b) return { title: "Brief not found" };
  const path = `/brief/${b.date}`;
  const title = `${b.title} — Daily Brief, ${b.dateLabel}`;
  const desc = b.summary.length > 155 ? b.summary.slice(0, 152).trimEnd() + "…" : b.summary;
  return {
    title,
    description: desc,
    alternates: alternates(path),
    openGraph: {
      ...openGraph({ title: b.title, description: desc, path, type: "article", imagePath: "/opengraph-image" }),
      type: "article",
      publishedTime: `${b.date}T10:00:00Z`,
      modifiedTime: b.generatedAt,
      authors: [`${SITE_URL}/about`],
    },
    twitter: twitter({ title: b.title, description: desc }),
  };
}

export default async function BriefPage({ params }: PageProps) {
  ensureStarted();
  const { date } = await params;
  const b = getBrief(date);
  if (!b) notFound();

  const all = listBriefs();
  const idx = all.findIndex((x) => x.date === b.date);
  const newer = idx > 0 ? all[idx - 1] : null;
  const older = idx >= 0 && idx < all.length - 1 ? all[idx + 1] : null;
  const url = `${SITE_URL}/brief/${b.date}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: b.title,
    description: b.summary,
    datePublished: `${b.date}T10:00:00Z`,
    dateModified: b.generatedAt,
    author: { "@type": "Organization", name: "Crisis Watch", url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", name: "Crisis Watch", logo: { "@type": "ImageObject", url: `${SITE_URL}/icon` } },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    articleSection: "Daily brief",
    isBasedOn: b.sources.map((s) => s.url),
  };

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 animate-slide-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />

      <div className="mb-6">
        <Breadcrumbs items={[{ name: "Daily Brief", href: "/brief" }, { name: b.dateLabel, href: `/brief/${b.date}` }]} />
      </div>

      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted font-semibold">
          <span className="px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red">Daily brief</span>
          <span>·</span>
          <time dateTime={b.date}>{b.dateLabel}</time>
          <span>·</span>
          <span>{b.readingTime}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">{b.title}</h1>
        <p className="text-base text-muted-light leading-relaxed">{b.summary}</p>
      </header>

      <section className="mb-8 rounded-2xl border border-card-border bg-card-bg p-5">
        <h2 className="text-[10px] uppercase tracking-widest text-muted font-bold">Key points</h2>
        <ul className="mt-3 space-y-2 text-[15px] text-foreground/90">
          {b.keyPoints.map((k) => (
            <li key={k} className="flex gap-3">
              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
              <span>{k}</span>
            </li>
          ))}
        </ul>
      </section>

      <div className="prose-article space-y-5 text-[15px] leading-relaxed text-foreground/85">
        {b.sections.map((s) => (
          <section key={s.heading} className="space-y-3">
            <h2 className="text-lg font-bold tracking-tight text-foreground">{s.heading}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>
        ))}
      </div>

      {b.sources.length > 0 && (
        <section className="mt-10 rounded-2xl border border-card-border bg-card-bg p-5">
          <h2 className="text-[10px] uppercase tracking-widest text-muted font-bold">Sources used</h2>
          <ul className="mt-3 space-y-1.5 text-sm">
            {b.sources.map((s) => (
              <li key={s.url} className="truncate">
                <a href={s.url} target="_blank" rel="noopener nofollow" className="text-accent-blue hover:underline">
                  {s.title}
                </a>
                {s.source && <span className="text-muted"> — {s.source}</span>}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] leading-snug text-muted">
            This brief is generated automatically from the headlines above and the live figures on this site, then published without manual editing. Prices are the values shown on the dashboard at generation time.
          </p>
        </section>
      )}

      <div className="mt-10">
        <SubscribeBox source={`brief-${b.date}`} compact />
      </div>

      <nav className="mt-8 flex items-center justify-between text-sm">
        {older ? (
          <Link href={`/brief/${older.date}`} className="text-accent-blue hover:underline">
            ← {older.dateLabel}
          </Link>
        ) : (
          <span />
        )}
        <Link href="/brief" className="text-muted-light hover:text-foreground">
          All briefs
        </Link>
        {newer ? (
          <Link href={`/brief/${newer.date}`} className="text-accent-blue hover:underline">
            {newer.dateLabel} →
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
