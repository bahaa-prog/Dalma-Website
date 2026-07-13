import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, ChevronRight } from "lucide-react";
import { NEWS } from "@/data/news";
import "./article.css";

// Every article is pre-rendered at build time; unknown ids → 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return NEWS.map((article) => ({ id: String(article.id) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const article = NEWS.find((n) => n.id === Number(id));
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
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = NEWS.find((n) => n.id === Number(id));
  if (!article) notFound();

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
          {article.date}
        </div>

        <img src={article.image} alt={article.title} className="article-cover" />

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
