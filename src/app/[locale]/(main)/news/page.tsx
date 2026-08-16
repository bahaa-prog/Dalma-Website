import { getPublishedArticles } from "@/lib/news";
import NewsGrid from "./NewsGrid";
import { defaultLocale } from "@/i18n/config";
import { isLocale } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";

// Admin-published articles must show up without a rebuild — render per request.
export const dynamic = "force-dynamic";

export default async function NewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const articles = await getPublishedArticles(locale);

  return (
    <>
      {/* ═══════════════════════ PAGE HERO ═══════════════════════ */}
      <div className="news-page-hero">
        <div className="section-inner">
          <span className="section-label">{dict.news.pageLabel}</span>
          <h1>{dict.news.pageHeading}</h1>
          <p>{dict.news.pageDesc}</p>
        </div>
      </div>

      {/* ═══════════════════════ NEWS GRID ═══════════════════════ */}
      <section className="news-page-section">
        <div className="section-inner">
          <NewsGrid articles={articles} locale={locale} dict={dict.news} categories={dict.categories} />
        </div>
      </section>
    </>
  );
}
