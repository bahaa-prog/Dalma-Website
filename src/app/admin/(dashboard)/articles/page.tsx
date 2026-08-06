import Link from "next/link";
import { formatArticleDate, getAllArticles } from "@/lib/news";
import ArticleActions from "./ArticleActions";

export const dynamic = "force-dynamic";

export default async function AdminArticlesPage() {
  const articles = await getAllArticles();

  return (
    <>
      <div className="admin-list-header">
        <h1>المقالات ({articles.length})</h1>
        <Link href="/admin/articles/new" className="admin-btn-new">
          + مقال جديد
        </Link>
      </div>

      <div className="admin-table-wrap">
        {articles.length === 0 ? (
          <div className="admin-empty">لا توجد مقالات بعد — ابدأ بإضافة أول مقال.</div>
        ) : (
          articles.map((article) => (
            <div key={article.id} className="admin-row">
              <div>
                <div className="admin-row-title">{article.title}</div>
                <div className="admin-row-meta">
                  {article.cat} · {formatArticleDate(article.publishedAt)}
                </div>
              </div>
              <span className={`admin-badge ${article.published ? "admin-badge-published" : "admin-badge-draft"}`}>
                {article.published ? "منشور" : "مسودة"}
              </span>
              <ArticleActions article={article} />
            </div>
          ))
        )}
      </div>
    </>
  );
}
