import { formatArticleDate } from "./format-date";

export const NEWS_CATEGORIES = ["فعاليات", "إنجازات", "شراكات", "إعلانات"] as const;
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

// GitHub Pages is static. Add public news here (including any local image in
// /public) before publishing a new build.
const publishedArticles: Article[] = [];

export { formatArticleDate };

export async function getPublishedArticles(): Promise<Article[]> {
  return publishedArticles;
}

export async function getLatestArticles(count: number): Promise<Article[]> {
  return publishedArticles.slice(0, count);
}
