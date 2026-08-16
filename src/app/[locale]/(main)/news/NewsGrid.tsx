"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";
import { formatArticleDate } from "@/lib/format-date";
import type { Article } from "@/lib/news";
import { NEWS_CATEGORIES, type NewsCategory } from "@/db/schema";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";

type CategoryFilter = "all" | NewsCategory;

export default function NewsGrid({
  articles,
  locale,
  dict,
  categories,
}: {
  articles: Article[];
  locale: Locale;
  dict: Dictionary["news"];
  categories: Dictionary["categories"];
}) {
  const [cat, setCat] = useState<CategoryFilter>("all");
  const visible = cat === "all" ? articles : articles.filter((a) => a.cat === cat);

  return (
    <>
      {/* Category filter */}
      <div className="news-filter">
        {(["all", ...NEWS_CATEGORIES] as const).map((c) => (
          <button
            key={c}
            className={`filter-btn${cat === c ? " active" : ""}`}
            onClick={() => setCat(c)}
          >
            {categories[c]}
          </button>
        ))}
      </div>

      {/* Cards */}
      {articles.length === 0 ? (
        <div className="news-empty-state">
          <Newspaper className="icon-40" />
          <p>{dict.emptyState}</p>
        </div>
      ) : (
        <div className="news-grid">
          {visible.map((article) => (
            <Link key={article.id} href={localizePath(locale, `/news/${article.slug}`)} className="news-card card-hover">
              <div className="news-img-wrap">
                {article.image ? (
                  <Image
                    src={article.image}
                    alt={article.title}
                    width={article.imageWidth ?? 600}
                    height={article.imageHeight ?? 400}
                    loading="lazy"
                  />
                ) : (
                  <div className="news-img-placeholder" />
                )}
                <span
                  className="news-cat"
                  style={article.cat === "announcements" ? { background: "var(--secondary)" } : undefined}
                >
                  {categories[article.cat]}
                </span>
              </div>
              <div className="news-body">
                <div className="news-date">
                  <Calendar className="icon-13" /> {formatArticleDate(article.publishedAt, locale)}
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-desc">{article.desc}</p>
                <span className="news-read-more">
                  {dict.readMore} <ArrowLeft className="icon-16" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
