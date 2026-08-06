import { sql } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const NEWS_CATEGORIES = [
  "فعاليات",
  "إنجازات",
  "شراكات",
  "إعلانات",
] as const;

export type NewsCategory = (typeof NEWS_CATEGORIES)[number];

export const articles = sqliteTable("articles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  cat: text("cat").$type<NewsCategory>().notNull(),
  title: text("title").notNull(),
  desc: text("desc").notNull(),
  content: text("content").notNull(),
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

export type ArticleRow = typeof articles.$inferSelect;
export type NewArticleRow = typeof articles.$inferInsert;
