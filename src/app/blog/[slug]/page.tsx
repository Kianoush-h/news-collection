import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles, getArticle } from "@/lib/articles";
import { alternates, openGraph, twitter, SITE_URL } from "@/lib/seo";
import Breadcrumbs from "@/components/Breadcrumbs";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

// Strip the markdown-style em-dash subtitle so the meta description stays
// inside Google's 155-160 character display window.
function shortDescription(text: string, max = 155): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(" ");
  return cut.slice(0, lastSpace > max - 25 ? lastSpace : max).trimEnd() + "…";
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return { title: "Article Not Found" };

  const path = `/blog/${article.slug}`;
  const desc = shortDescription(article.description);
  const og = openGraph({ title: article.title, description: desc, path, type: "article" });
  return {
    title: article.title,
    description: desc,
    keywords: article.keywords,
    alternates: alternates(path),
    openGraph: {
      ...og,
      type: "article",
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [`${SITE_URL}/about`],
    },
    twitter: twitter({ title: article.title, description: desc }),
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const url = `https://crisiswatch.ca/blog/${article.slug}`;

  const newsArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.description,
    datePublished: `${article.datePublished}T12:00:00Z`,
    dateModified: `${article.dateModified}T12:00:00Z`,
    author: {
      "@type": "Organization",
      name: "Crisis Watch Editorial Team",
      url: "https://crisiswatch.ca/about",
    },
    publisher: {
      "@type": "Organization",
      name: "Crisis Watch",
      logo: {
        "@type": "ImageObject",
        url: "https://crisiswatch.ca/icon",
      },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    keywords: article.keywords.join(", "),
  };

  const otherArticles = articles.filter((a) => a.slug !== article.slug);

  return (
    <article className="max-w-3xl mx-auto px-4 py-8 animate-slide-in">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(newsArticleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mb-6">
        <Breadcrumbs
          items={[
            { name: "Live Blog", href: "/blog" },
            { name: article.title, href: `/blog/${article.slug}` },
          ]}
        />
      </div>

      {/* Hero image — also the og:image and twitter:image for this article */}
      <figure className="mb-8 rounded-2xl overflow-hidden border border-card-border">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`/blog/${article.slug}/opengraph-image`}
          alt={`${article.title} — Crisis Watch hero illustration`}
          width={1200}
          height={630}
          loading="eager"
          decoding="async"
          className="w-full h-auto block"
        />
      </figure>

      <header className="space-y-4 mb-8">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-muted font-semibold">
          <span className="px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue">
            {article.category}
          </span>
          <span>·</span>
          <time dateTime={article.datePublished}>
            {new Date(article.datePublished).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </time>
          <span>·</span>
          <span>{article.readingTime}</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
          {article.title}
        </h1>

        <p className="text-base text-muted-light leading-relaxed">
          {article.description}
        </p>

        <div className="flex items-center gap-3 pt-2 border-t border-card-border text-xs text-muted">
          <span>
            By{" "}
            <Link
              href="/about"
              className="text-foreground/80 font-medium hover:text-accent-blue transition-colors"
            >
              Crisis Watch Editorial Team
            </Link>
          </span>
          {article.dateModified !== article.datePublished && (
            <>
              <span>·</span>
              <span>
                Updated{" "}
                <time dateTime={article.dateModified}>
                  {new Date(article.dateModified).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </span>
            </>
          )}
        </div>
      </header>

      <div className="prose-article space-y-5 text-[15px] leading-relaxed text-foreground/85">
        {article.body()}
      </div>

      {/* Related dashboards */}
      <aside className="mt-12 p-5 rounded-2xl border border-card-border bg-white/[0.02]">
        <h2 className="text-sm font-bold text-foreground mb-3">
          Live data referenced in this article
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <Link
            href="/hormuz"
            className="block p-3 rounded-lg bg-white/[0.03] border border-card-border hover:border-accent-blue/40 transition-colors"
          >
            <div className="font-semibold text-foreground">
              Strait of Hormuz Tracker
            </div>
            <div className="text-xs text-muted mt-0.5">
              Live blockade status, ship rerouting, oil flow.
            </div>
          </Link>
          <Link
            href="/oil-energy"
            className="block p-3 rounded-lg bg-white/[0.03] border border-card-border hover:border-accent-blue/40 transition-colors"
          >
            <div className="font-semibold text-foreground">
              Oil &amp; Energy Dashboard
            </div>
            <div className="text-xs text-muted mt-0.5">
              Brent, WTI, gas, gold, defense stocks.
            </div>
          </Link>
          <Link
            href="/impact"
            className="block p-3 rounded-lg bg-white/[0.03] border border-card-border hover:border-accent-blue/40 transition-colors"
          >
            <div className="font-semibold text-foreground">
              War Impact Dashboard
            </div>
            <div className="text-xs text-muted mt-0.5">
              Gas prices by state, flights, shipping.
            </div>
          </Link>
          <Link
            href="/conflict-map"
            className="block p-3 rounded-lg bg-white/[0.03] border border-card-border hover:border-accent-blue/40 transition-colors"
          >
            <div className="font-semibold text-foreground">
              Conflict Map &amp; Timeline
            </div>
            <div className="text-xs text-muted mt-0.5">
              Strikes, retaliations, diplomatic events.
            </div>
          </Link>
        </div>
      </aside>

      {/* Other articles */}
      {otherArticles.length > 0 && (
        <aside className="mt-8">
          <h2 className="text-sm font-bold text-foreground mb-3">
            Continue reading
          </h2>
          <div className="space-y-2">
            {otherArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}`}
                className="block p-3 rounded-lg bg-white/[0.02] border border-card-border hover:border-accent-blue/40 transition-colors"
              >
                <div className="font-semibold text-foreground text-sm">
                  {a.title}
                </div>
                <div className="text-xs text-muted mt-0.5 line-clamp-2">
                  {a.description}
                </div>
              </Link>
            ))}
          </div>
        </aside>
      )}
    </article>
  );
}
