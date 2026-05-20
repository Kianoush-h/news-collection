import Link from "next/link";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

/**
 * Visible breadcrumb trail plus matching BreadcrumbList JSON-LD. Always
 * starts at the dashboard home; the last item is rendered as plain text
 * (current page) and is also the canonical leaf for Google.
 */
export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  const base = "https://crisiswatch.ca";
  const allItems: BreadcrumbItem[] = [{ name: "Home", href: "/" }, ...items];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: allItems.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${base}${item.href}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <nav
        aria-label="Breadcrumb"
        className="text-xs text-muted flex items-center gap-2 flex-wrap"
      >
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <span key={item.href} className="flex items-center gap-2">
              {isLast ? (
                <span
                  className="text-foreground/70 truncate max-w-[40ch]"
                  aria-current="page"
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-foreground transition-colors"
                >
                  {item.name}
                </Link>
              )}
              {!isLast && <span aria-hidden="true">/</span>}
            </span>
          );
        })}
      </nav>
    </>
  );
}
