import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { preload } from "react-dom";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { formatArticleDate, getPublishedArticleByLocaleAndSlug } from "@/lib/news";
import { defaultLocale } from "@/i18n/config";
import { isLocale, localizePath } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";
import "./article.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const result = await getPublishedArticleByLocaleAndSlug(locale, decodeURIComponent(slug));
  if (result.kind !== "found") {
    return { title: dict.news.articleFallbackTitle };
  }
  return {
    title: `${result.article.title} — ${dict.metadata.siteSuffix}`,
    description: result.article.desc,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const result = await getPublishedArticleByLocaleAndSlug(locale, decodeURIComponent(slug));

  if (result.kind === "not-found") notFound();
  if (result.kind === "redirect") redirect(localizePath(locale, `/news/${result.slug}`));

  const article = result.article;

  // Cover image is this page's LCP element; hint the browser early.
  if (article.image) preload(article.image, { as: "image" });

  const BackIcon = locale === "ar" ? ChevronRight : ChevronLeft;

  return (
    <div style={{ paddingTop: "6rem", background: "white", minHeight: "100vh" }}>
      <div className="article-wrap">
        <Link href={localizePath(locale, "/news")} className="article-back">
          <BackIcon size={16} />
          {dict.news.backToNews}
        </Link>

        <span className="article-cat">{dict.categories[article.cat]}</span>
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <Calendar size={14} />
          {formatArticleDate(article.publishedAt, locale)}
        </div>

        {article.image && (
          <img src={article.image} alt={article.title} className="article-cover" />
        )}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        <hr className="article-divider" />

        <Link href={localizePath(locale, "/news")} className="article-back">
          <BackIcon size={16} />
          {dict.news.backToAllNews}
        </Link>
      </div>
    </div>
  );
}
