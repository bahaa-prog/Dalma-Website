import { cache } from "react";
import { desc, eq, ne, and } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { articles, NEWS_CATEGORIES, type ArticleRow, type NewsCategory } from "@/db/schema";

export { NEWS_CATEGORIES };
export type { NewsCategory };
export type Article = ArticleRow;
export { formatArticleDate } from "./format-date";

function slugify(title: string): string {
  return title
    .trim()
    .toLowerCase()
    .replace(/[^؀-ۿa-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(title: string, excludeId?: number): Promise<string> {
  const base = slugify(title) || "article";
  let slug = base;
  let attempt = 2;
  for (;;) {
    const conflict = await db
      .select({ id: articles.id })
      .from(articles)
      .where(
        excludeId
          ? and(eq(articles.slug, slug), ne(articles.id, excludeId))
          : eq(articles.slug, slug)
      )
      .limit(1);
    if (conflict.length === 0) return slug;
    slug = `${base}-${attempt++}`;
  }
}

// ── Reads ──────────────────────────────────────────────────────────────

/** All articles (draft + published), newest edits first — for the admin list. */
export async function getAllArticles(): Promise<Article[]> {
  return db.select().from(articles).orderBy(desc(articles.updatedAt));
}

/** Published articles only, newest first — for the public listing page. */
export async function getPublishedArticles(): Promise<Article[]> {
  return db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt));
}

/** Latest N published articles — for the home page's news section. */
export async function getLatestArticles(n: number): Promise<Article[]> {
  return db
    .select()
    .from(articles)
    .where(eq(articles.published, true))
    .orderBy(desc(articles.publishedAt))
    .limit(n);
}

/** Any article by id, regardless of published state — for the admin edit form. */
export async function getArticleById(id: number): Promise<Article | null> {
  const [row] = await db.select().from(articles).where(eq(articles.id, id)).limit(1);
  return row ?? null;
}

/**
 * By slug, regardless of published state. Wrapped in React `cache()` so a
 * request that calls this twice (generateMetadata + the page body both look
 * up the same article) only hits SQLite once.
 */
export const getArticleBySlug = cache(async (slug: string): Promise<Article | null> => {
  const [row] = await db.select().from(articles).where(eq(articles.slug, slug)).limit(1);
  return row ?? null;
});

/** By slug, published only — what the public article page should actually use. */
export async function getPublishedArticleBySlug(slug: string): Promise<Article | null> {
  const row = await getArticleBySlug(slug);
  return row?.published ? row : null;
}

// ── Writes ─────────────────────────────────────────────────────────────

export const articleInputSchema = z.object({
  cat: z.enum(NEWS_CATEGORIES),
  title: z.string().trim().min(3, "العنوان قصير جداً").max(200),
  desc: z.string().trim().min(3, "الوصف قصير جداً").max(500),
  content: z.string().trim().min(1, "محتوى المقال مطلوب"),
  image: z.string().trim().nullable().optional(),
  imageWidth: z.number().int().positive().nullable().optional(),
  imageHeight: z.number().int().positive().nullable().optional(),
  published: z.boolean().optional().default(false),
  publishedAt: z.coerce.date().optional(),
});

export type ArticleInput = z.infer<typeof articleInputSchema>;

export async function createArticle(input: ArticleInput): Promise<Article> {
  const slug = await generateUniqueSlug(input.title);
  const now = new Date();
  const [row] = await db
    .insert(articles)
    .values({
      slug,
      cat: input.cat,
      title: input.title,
      desc: input.desc,
      content: input.content,
      image: input.image ?? null,
      imageWidth: input.imageWidth ?? null,
      imageHeight: input.imageHeight ?? null,
      published: input.published ?? false,
      publishedAt: input.publishedAt ?? now,
      createdAt: now,
      updatedAt: now,
    })
    .returning();
  return row;
}

export async function updateArticle(id: number, input: ArticleInput): Promise<Article | null> {
  const existing = await getArticleById(id);
  if (!existing) return null;

  const slug =
    input.title !== existing.title ? await generateUniqueSlug(input.title, id) : existing.slug;

  const [row] = await db
    .update(articles)
    .set({
      slug,
      cat: input.cat,
      title: input.title,
      desc: input.desc,
      content: input.content,
      image: input.image ?? null,
      imageWidth: input.imageWidth ?? null,
      imageHeight: input.imageHeight ?? null,
      published: input.published ?? false,
      publishedAt: input.publishedAt ?? existing.publishedAt,
      updatedAt: new Date(),
    })
    .where(eq(articles.id, id))
    .returning();
  return row ?? null;
}

export async function deleteArticle(id: number): Promise<boolean> {
  const result = db.delete(articles).where(eq(articles.id, id)).run();
  return result.changes > 0;
}
