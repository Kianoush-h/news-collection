import type { Metadata } from "next";
import Link from "next/link";
import Breadcrumbs from "@/components/Breadcrumbs";
import SubscribeBox from "@/components/SubscribeBox";
import { ensureStarted } from "@/lib/db";
import { listBriefs } from "@/lib/brief";
import { alternates, openGraph, twitter, SITE_URL } from "@/lib/seo";

export const dynamic = "force-dynamic";

const title = "Daily Brief — Iran-US Conflict, Every Morning";
const description =
  "A new brief every morning at 6 am Eastern: overnight developments, oil and gas moves, the Strait of Hormuz, and what to watch. Written from the day's headlines and live market data.";

export const metadata: Metadata = {
  title,
  description,
  alternates: alternates("/brief"),
  openGraph: openGraph({ title, description, path: "/brief", imagePath: "/opengraph-image" }),
  twitter: twitter({ title, description }),
};

export default function BriefIndexPage() {
  ensureStarted();
  const briefs = listBriefs();
  const [latest, ...rest] = briefs;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Crisis Watch Daily Brief",
    url: `${SITE_URL}/brief`,
    description,
    hasPart: briefs.slice(0, 30).map((b) => ({
      "@type": "NewsArticle",
      headline: b.title,
      datePublished: `${b.date}T10:00:00Z`,
      url: `${SITE_URL}/brief/${b.date}`,
    })),
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8 animate-slide-in">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <Breadcrumbs items={[{ name: "Daily Brief", href: "/brief" }]} />

      <header className="space-y-3">
        <div className="text-[10px] uppercase tracking-widest text-accent-red font-bold">Daily brief</div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">The conflict, every morning in five minutes</h1>
        <p className="text-sm text-muted-light leading-relaxed">
          Published around 6 am Eastern from the night&apos;s headlines and the live market data on this site. Sources are listed under every brief.
        </p>
      </header>

      {latest ? (
        <Link
          href={`/brief/${latest.date}`}
          className="block rounded-2xl border border-card-border bg-card-bg p-5 sm:p-6 transition-colors hover:border-card-border-hover"
        >
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted font-semibold">
            <span className="px-2 py-0.5 rounded-full bg-accent-red/10 text-accent-red">Latest</span>
            <time dateTime={latest.date}>{latest.dateLabel}</time>
            <span>·</span>
            <span>{latest.readingTime}</span>
          </div>
          <h2 className="mt-3 text-xl font-bold tracking-tight leading-snug">{latest.title}</h2>
          <p className="mt-2 text-sm text-muted-light leading-relaxed">{latest.summary}</p>
          <ul className="mt-4 space-y-1.5 text-sm text-foreground/85">
            {latest.keyPoints.slice(0, 3).map((k) => (
              <li key={k} className="flex gap-2">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent-blue" />
                <span>{k}</span>
              </li>
            ))}
          </ul>
          <span className="mt-4 inline-block text-sm font-semibold text-accent-blue">Read the brief →</span>
        </Link>
      ) : (
        <div className="rounded-2xl border border-card-border bg-card-bg p-6 text-sm text-muted-light">
          The first brief is written at 6 am Eastern. Check back then, or subscribe below to get it by email.
        </div>
      )}

      <SubscribeBox source="brief-index" />

      {rest.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-widest text-muted">Earlier briefs</h2>
          <ul className="divide-y divide-card-border rounded-2xl border border-card-border bg-card-bg">
            {rest.map((b) => (
              <li key={b.date}>
                <Link href={`/brief/${b.date}`} className="flex items-baseline gap-4 px-5 py-3.5 hover:bg-white/[0.03]">
                  <time dateTime={b.date} className="w-28 shrink-0 text-xs text-muted tabular-nums">
                    {b.dateLabel}
                  </time>
                  <span className="text-sm font-medium leading-snug">{b.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
