import { buildOgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og-image-builder";
import { articles, getArticle } from "@/lib/articles";

export const alt = "Crisis Watch article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

const ACCENT_BY_CATEGORY: Record<string, "red" | "amber" | "cyan" | "blue"> = {
  Explainer: "cyan",
  Analysis: "amber",
  Reference: "blue",
};

export default async function OGImage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) {
    return buildOgImage({
      eyebrow: "Article",
      title: "Crisis Watch",
      accent: "red",
    });
  }
  return buildOgImage({
    eyebrow: article.category,
    title: article.title,
    subtitle: article.description,
    accent: ACCENT_BY_CATEGORY[article.category] ?? "red",
    badge: article.category.toUpperCase(),
  });
}
