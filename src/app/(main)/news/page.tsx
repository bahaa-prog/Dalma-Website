import { getPublishedArticles } from "@/lib/news";
import NewsGrid from "./NewsGrid";

export default async function NewsPage() {
  const articles = await getPublishedArticles();

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
          <NewsGrid articles={articles} />
        </div>
      </section>
    </>
  );
}
