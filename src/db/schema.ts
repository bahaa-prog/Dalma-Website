import { sql } from "drizzle-orm";
import { sqliteTable, text, integer, unique } from "drizzle-orm/sqlite-core";

export const NEWS_CATEGORIES = [
  "events",
  "achievements",
  "partnerships",
  "announcements",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const ARTICLE_LOCALES = ["ar", "en"] as const;
export type ArticleLocale = (typeof ARTICLE_LOCALES)[number];

/** Shared, locale-independent fields. Per-language content lives in articleTranslations. */
export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cat: text("cat").$type<NewsCategory>().notNull(),
  image: text("image"),
  imageWidth: integer("image_width"),
  imageHeight: integer("image_height"),
  published: integer("published", { mode: "boolean" }).notNull().default(false),
  publishedAt: integer("published_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  createdAt: integer("created_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .notNull()
    .default(sql`(unixepoch())`),
});

export const articleTranslations = sqliteTable(
  "article_translations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    articleId: integer("article_id")
      .notNull()
      .references(() => articles.id, { onDelete: "cascade" }),
    locale: text("locale").$type<ArticleLocale>().notNull(),
    slug: text("slug").notNull(),
    title: text("title").notNull(),
    desc: text("desc").notNull(),
    content: text("content").notNull(),
  },
  (t) => [
    unique("article_translations_article_locale_unique").on(t.articleId, t.locale),
    unique("article_translations_locale_slug_unique").on(t.locale, t.slug),
  ]
);

export type ArticleRow = typeof articles.$inferSelect;
export type NewArticleRow = typeof articles.$inferInsert;
export type ArticleTranslationRow = typeof articleTranslations.$inferSelect;
export type NewArticleTranslationRow = typeof articleTranslations.$inferInsert;
