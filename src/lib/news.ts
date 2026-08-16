import { cache } from "react";
import { desc, eq, ne, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import {
  articles,
  articleTranslations,
  NEWS_CATEGORIES,
  ARTICLE_LOCALES,
  type ArticleRow,
  type ArticleTranslationRow,
  type NewsCategory,
  type ArticleLocale,
} from "@/db/schema";

export { NEWS_CATEGORIES, ARTICLE_LOCALES };
export type { NewsCategory, ArticleLocale };
export { formatArticleDate } from "./format-date";

/** Locale-resolved, flat view used by every public-facing page. */
export type Article = {
  id: number;
  cat: NewsCategory;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  slug: string;
  title: string;
  desc: string;
  content: string;
};

export type TranslationInput = { title: string; desc: string; content: string };

/** Admin-facing view: shared fields plus both locales' translations (either may be incomplete/missing). */
export type AdminArticle = {
  id: number;
  cat: NewsCategory;
  image: string | null;
  imageWidth: number | null;
  imageHeight: number | null;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
  translations: Record<ArticleLocale, (TranslationInput & { slug: string }) | null>;
};

function toArticle(row: ArticleRow, t: ArticleTranslationRow): Article {
  return {
    id: row.id,
    cat: row.cat,
    image: row.image,
    imageWidth: row.imageWidth,
    imageHeight: row.imageHeight,
    published: row.published,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    slug: t.slug,
    title: t.title,
    desc: t.desc,
    content: t.content,
  };
}

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^؀-ۿa-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(
  locale: ArticleLocale,
  title: string,
  excludeArticleId?: number
): Promise<string> {
  const base = slugify(title) || "article";
  let slug = base;
  let attempt = 2;
  for (;;) {
    const conflict = await db
      .select({ id: articleTranslations.id })
      .from(articleTranslations)
      .where(
        excludeArticleId
          ? and(
              eq(articleTranslations.locale, locale),
              eq(articleTranslations.slug, slug),
              ne(articleTranslations.articleId, excludeArticleId)
            )
          : and(eq(articleTranslations.locale, locale), eq(articleTranslations.slug, slug))
      )
      .limit(1);
    if (conflict.length === 0) return slug;
    slug = `${base}-${attempt++}`;
  }
}

// ── Public reads (locale-aware) ───────────────────────────────────────

/** Published articles in one locale, newest first — for the public listing page. */
export async function getPublishedArticles(locale: ArticleLocale): Promise<Article[]> {
  const rows = await db
    .select({ article: articles, translation: articleTranslations })
    .from(articles)
    .innerJoin(
      articleTranslations,
      and(eq(articleTranslations.articleId, articles.id), eq(articleTranslations.locale, locale))
    )
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt));
  return rows.map((r) => toArticle(r.article, r.translation));
}

/** Latest N published articles in one locale — for the home page's news section. */
export async function getLatestArticles(n: number, locale: ArticleLocale): Promise<Article[]> {
  const rows = await db
    .select({ article: articles, translation: articleTranslations })
    .from(articles)
    .innerJoin(
      articleTranslations,
      and(eq(articleTranslations.articleId, articles.id), eq(articleTranslations.locale, locale))
    )
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt))
    .limit(n);
  return rows.map((r) => toArticle(r.article, r.translation));
}

export type ArticleLookupResult =
  | { kind: "found"; article: Article }
  | { kind: "redirect"; slug: string }
  | { kind: "not-found" };

/**
 * By locale + slug, published only. If the slug doesn't resolve in this
 * locale but belongs to the article's OTHER locale, returns a redirect to
 * this locale's own canonical slug (if a published translation exists) —
 * handles a language switch that lands on the wrong locale's slug.
 * Wrapped in `cache()` so generateMetadata + the page body share one lookup.
 */
export const getPublishedArticleByLocaleAndSlug = cache(
  async (locale: ArticleLocale, slug: string): Promise<ArticleLookupResult> => {
    const [direct] = await db
      .select({ article: articles, translation: articleTranslations })
      .from(articles)
      .innerJoin(
        articleTranslations,
        and(eq(articleTranslations.articleId, articles.id), eq(articleTranslations.locale, locale))
      )
      .where(and(eq(articleTranslations.slug, slug), eq(articles.published, true)))
      .limit(1);
    if (direct) return { kind: "found", article: toArticle(direct.article, direct.translation) };

    const [otherLocaleMatch] = await db
      .select({ articleId: articleTranslations.articleId })
      .from(articleTranslations)
      .where(eq(articleTranslations.slug, slug))
      .limit(1);
    if (!otherLocaleMatch) return { kind: "not-found" };

    const [ownTranslation] = await db
      .select({ translation: articleTranslations })
      .from(articles)
      .innerJoin(
        articleTranslations,
        and(eq(articleTranslations.articleId, articles.id), eq(articleTranslations.locale, locale))
      )
      .where(and(eq(articles.id, otherLocaleMatch.articleId), eq(articles.published, true)))
      .limit(1);
    if (!ownTranslation) return { kind: "not-found" };
    return { kind: "redirect", slug: ownTranslation.translation.slug };
  }
);

// ── Admin reads (both locales) ────────────────────────────────────────

function toAdminArticle(
  row: ArticleRow,
  translations: ArticleTranslationRow[]
): AdminArticle {
  const byLocale = (locale: ArticleLocale) => {
    const t = translations.find((tr) => tr.locale === locale);
    return t ? { slug: t.slug, title: t.title, desc: t.desc, content: t.content } : null;
  };
  return {
    id: row.id,
    cat: row.cat,
    image: row.image,
    imageWidth: row.imageWidth,
    imageHeight: row.imageHeight,
    published: row.published,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    translations: { ar: byLocale("ar"), en: byLocale("en") },
  };
}

/** All articles (draft + published), newest edits first — for the admin list. */
export async function getAllArticles(): Promise<AdminArticle[]> {
  const rows = await db.select().from(articles).orderBy(desc(articles.updatedAt));
  if (rows.length === 0) return [];
  const allTranslations = await db.select().from(articleTranslations);
  const byArticleId = new Map<number, ArticleTranslationRow[]>();
  for (const t of allTranslations) {
    const list = byArticleId.get(t.articleId) ?? [];
    list.push(t);
    byArticleId.set(t.articleId, list);
  }
  return rows.map((row) => toAdminArticle(row, byArticleId.get(row.id) ?? []));
}

/** Any article by id, regardless of published state — for the admin edit form. */
export async function getArticleById(id: number): Promise<AdminArticle | null> {
  const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  if (!row) return null;
  const translations = await db
    .select()
    .from(articleTranslations)
    .where(eq(articleTranslations.articleId, id));
  return toAdminArticle(row, translations);
}

// ── Writes ─────────────────────────────────────────────────────────────

const translationInputSchema = z.object({
  title: z.string().trim().max(200),
  desc: z.string().trim().max(500),
  content: z.string().trim(),
});

export const articleInputSchema = z.object({
  cat: z.enum(NEWS_CATEGORIES),
  image: z.string().trim().nullable().optional(),
  imageWidth: z.number().int().positive().nullable().optional(),
  imageHeight: z.number().int().positive().nullable().optional(),
  published: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional(),
  translations: z.object({
    ar: translationInputSchema,
    en: translationInputSchema,
  }),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

/** A translation is "complete" enough to publish — mirrors the old single-locale validation minimums. */
export function isTranslationComplete(t: TranslationInput): boolean {
  return t.title.trim().length >= 3 && t.desc.trim().length >= 3 && t.content.trim().length > 0;
}

/** Both locales must be complete before an article can go live. */
export function isArticleInputPublishable(input: ArticleInput): boolean {
  return isTranslationComplete(input.translations.ar) && isTranslationComplete(input.translations.en);
}

export async function createArticle(input: ArticleInput): Promise<AdminArticle> {
  const now = new Date();
  const arSlug = await generateUniqueSlug("ar", input.translations.ar.title);
  const enSlug = await generateUniqueSlug("en", input.translations.en.title);

  const [row] = await db
    .insert(articles)
    .values({
      cat: input.cat,
      image: input.image ?? null,
      imageWidth: input.imageWidth ?? null,
      imageHeight: input.imageHeight ?? null,
      published: input.published ?? false,
      publishedAt: input.publishedAt ?? now,
      createdAt: now,
      updatedAt: now,
    })
    .returning();

  await db.insert(articleTranslations).values([
    { articleId: row.id, locale: "ar", slug: arSlug, ...input.translations.ar },
    { articleId: row.id, locale: "en", slug: enSlug, ...input.translations.en },
  ]);

  return (await getArticleById(row.id))!;
}

export async function updateArticle(id: number, input: ArticleInput): Promise<AdminArticle | null> {
  const existing = await getArticleById(id);
  if (!existing) return null;

  const arSlug =
    !existing.translations.ar || input.translations.ar.title !== existing.translations.ar.title
      ? await generateUniqueSlug("ar", input.translations.ar.title, id)
      : existing.translations.ar.slug;
  const enSlug =
    !existing.translations.en || input.translations.en.title !== existing.translations.en.title
      ? await generateUniqueSlug("en", input.translations.en.title, id)
      : existing.translations.en.slug;

  await db
    .update(articles)
    .set({
      cat: input.cat,
      image: input.image ?? null,
      imageWidth: input.imageWidth ?? null,
      imageHeight: input.imageHeight ?? null,
      published: input.published ?? false,
      publishedAt: input.publishedAt ?? existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id));

  const slugsByLocale: Record<ArticleLocale, string> = { ar: arSlug, en: enSlug };
  for (const locale of ARTICLE_LOCALES) {
    const t = input.translations[locale];
    const slug = slugsByLocale[locale];
    if (existing.translations[locale]) {
      await db
        .update(articleTranslations)
        .set({ slug, ...t })
        .where(and(eq(articleTranslations.articleId, id), eq(articleTranslations.locale, locale)));
    } else {
      await db.insert(articleTranslations).values({ articleId: id, locale, slug, ...t });
    }
  }

  return getArticleById(id);
}

export async function deleteArticle(id: number): Promise<boolean> {
  const result = db.delete(articles).where(eq(articles.id, id)).run();
  return result.changes > 0;
}
