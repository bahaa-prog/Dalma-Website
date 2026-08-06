"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, Newspaper } from "lucide-react";
import { formatArticleDate } from "@/lib/format-date";
import type { Article } from "@/lib/news";

const CATEGORIES = ["الكل", "فعاليات", "إنجازات", "شراكات", "إعلانات"] as const;

export default function NewsGrid({ articles }: { articles: Article[] }) {
  const [cat, setCat] = useState<string>("الكل");
  const visible = cat === "الكل" ? articles : articles.filter((a) => a.cat === cat);

  return (
    <>
      {/* Category filter */}
      <div className="news-filter">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            className={`filter-btn${cat === c ? " active" : ""}`}
            onClick={() => setCat(c)}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards */}
      {articles.length === 0 ? (
        <div className="news-empty-state">
          <Newspaper className="icon-40" />
          <p>لا توجد أخبار منشورة حالياً — تابعونا قريباً.</p>
        </div>
      ) : (
        <div className="news-grid">
          {visible.map((article) => (
            <Link key={article.id} href={`/news/${article.slug}`} className="news-card card-hover">
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
                  style={article.cat === "إعلانات" ? { background: "var(--secondary)" } : undefined}
                >
                  {article.cat}
                </span>
              </div>
              <div className="news-body">
                <div className="news-date">
                  <Calendar className="icon-13" /> {formatArticleDate(article.publishedAt)}
                </div>
                <h3 className="news-title">{article.title}</h3>
                <p className="news-desc">{article.desc}</p>
                <span className="news-read-more">
                  اقرأ المزيد <ArrowLeft className="icon-16" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
