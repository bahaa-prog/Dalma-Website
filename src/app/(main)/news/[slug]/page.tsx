import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { preload } from "react-dom";
import { Calendar, ChevronRight } from "lucide-react";
import { formatArticleDate, getPublishedArticleBySlug } from "@/lib/news";
import "./article.css";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(decodeURIComponent(slug));
  return {
    title: article
      ? `${article.title} — مدينة الدلما الإنسانية`
      : "مقال — مدينة الدلما الإنسانية",
    description: article?.desc,
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await getPublishedArticleBySlug(decodeURIComponent(slug));
  if (!article) notFound();

  // Cover image is this page's LCP element; hint the browser early.
  if (article.image) preload(article.image, { as: "image" });

  return (
    <div style={{ paddingTop: "6rem", background: "white", minHeight: "100vh" }}>
      <div className="article-wrap">
        <Link href="/news" className="article-back">
          <ChevronRight size={16} />
          العودة إلى الأخبار
        </Link>

        <span className="article-cat">{article.cat}</span>
        <h1 className="article-title">{article.title}</h1>
        <div className="article-meta">
          <Calendar size={14} />
          {formatArticleDate(article.publishedAt)}
        </div>

        {article.image && (
          <img src={article.image} alt={article.title} className="article-cover" />
        )}

        <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />

        <hr className="article-divider" />

        <Link href="/news" className="article-back">
          <ChevronRight size={16} />
          العودة إلى جميع الأخبار
        </Link>
      </div>
    </div>
  );
}
