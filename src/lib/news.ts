import type { Locale } from "@/i18n/config";
import { formatArticleDate } from "./format-date";

export { formatArticleDate };

// GitHub Pages is a static export — there is no database or admin portal on
// this branch. Add public news by hand-editing the per-locale arrays below
// (including any local image in /public) before publishing a new build.
export const NEWS_CATEGORIES = ["events", "achievements", "partnerships", "announcements"] as const;
export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export type Article = {
  id: number;
  slug: string;
  cat: NewsCategory;
  title: string;
  desc: string;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  publishedAt: Date;
};

const publishedArticles: Record<Locale, Article[]> = {
  ar: [],
  en: [],
};

export async function getPublishedArticles(locale: Locale): Promise<Article[]> {
  return publishedArticles[locale];
}

export async function getLatestArticles(count: number, locale: Locale): Promise<Article[]> {
  return publishedArticles[locale].slice(0, count);
}
