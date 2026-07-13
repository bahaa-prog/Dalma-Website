"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Calendar } from "lucide-react";
import { NEWS } from "@/data/news";

const CATEGORIES = ["الكل", "فعاليات", "إنجازات", "شراكات", "إعلانات"] as const;

export default function NewsPage() {
  const router = useRouter();
  const [cat, setCat] = useState<string>("الكل");

  return (
    <>
      {/* ═══════════════════════ PAGE HERO ═══════════════════════ */}
      <div className="news-page-hero">
        <div className="section-inner">
          <span className="section-label">ابقَ على اطلاع</span>
          <h1>الأخبار والفعاليات</h1>
          <p>آخر المستجدات والإنجازات والفعاليات في مدينة الدلما الإنسانية</p>
        </div>
      </div>

      {/* ═══════════════════════ NEWS GRID ═══════════════════════ */}
      <section className="news-page-section">
        <div className="section-inner">

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
          <div className="news-grid" id="news-grid">
            {NEWS.map((article) => (
              <article
                key={article.id}
                className={`news-card card-hover${cat !== "الكل" && article.cat !== cat ? " hidden" : ""}`}
                style={{ cursor: "pointer" }}
                onClick={(e) => {
                  if ((e.target as HTMLElement).closest("a")) return;
                  router.push(`/news/${article.id}`);
                }}
              >
                <div className="news-img-wrap">
                  <img src={article.image.replace("w=1200&h=600", "w=600&h=400")} alt={article.title} loading="lazy" />
                  <span className="news-cat" style={article.cat === "إعلانات" ? { background: "var(--secondary)" } : undefined}>{article.cat}</span>
                </div>
                <div className="news-body">
                  <div className="news-date"><Calendar className="icon-13" /> {article.date}</div>
                  <h3 className="news-title">{article.title}</h3>
                  <p className="news-desc">{article.desc}</p>
                  <Link href={`/news/${article.id}`} className="news-read-more">اقرأ المزيد <ArrowLeft className="icon-16" /></Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
