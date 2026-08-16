import Link from "next/link";
import { formatArticleDate, getAllArticles } from "@/lib/news";
import ArticleActions from "./ArticleActions";
import { defaultLocale } from "@/i18n/config";
import { isLocale, localizePath } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const articles = await getAllArticles();

  return (
    <>
      <div className="admin-list-header">
        <h1>{dict.admin.articlesHeadingPrefix} ({articles.length})</h1>
        <Link href={localizePath(locale, "/admin/articles/new")} className="admin-btn-new">
          {dict.admin.newArticleButton}
        </Link>
      </div>

      <div className="admin-table-wrap">
        {articles.length === 0 ? (
          <div className="admin-empty">{dict.admin.emptyState}</div>
        ) : (
          articles.map((article) => {
            const title =
              article.translations[locale]?.title ??
              article.translations.ar?.title ??
              article.translations.en?.title ??
              "—";
            return (
              <div key={article.id} className="admin-row">
                <div>
                  <div className="admin-row-title">{title}</div>
                  <div className="admin-row-meta">
                    {dict.categories[article.cat]} · {formatArticleDate(article.publishedAt, locale)}
                  </div>
                </div>
                <span className={`admin-badge ${article.published ? "admin-badge-published" : "admin-badge-draft"}`}>
                  {article.published ? dict.admin.published : dict.admin.draft}
                </span>
                <ArticleActions article={article} locale={locale} dict={dict.admin} />
              </div>
            );
          })
        )}
      </div>
    </>
  );
}
