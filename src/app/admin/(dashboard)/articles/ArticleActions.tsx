"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Article } from "@/lib/news";

export default function ArticleActions({ article }: { article: Article }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function togglePublished() {
    setBusy(true);
    try {
      await fetch(`/api/admin/articles/${article.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cat: article.cat,
          title: article.title,
          desc: article.desc,
          content: article.content,
          image: article.image,
          imageWidth: article.imageWidth,
          imageHeight: article.imageHeight,
          published: !article.published,
          publishedAt: article.publishedAt,
        }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    if (!confirm(`حذف المقال "${article.title}"؟ لا يمكن التراجع عن هذا الإجراء.`)) return;
    setBusy(true);
    try {
      await fetch(`/api/admin/articles/${article.id}`, { method: "DELETE" });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin-row-actions">
      <Link href={`/admin/articles/${article.id}/edit`}>تعديل</Link>
      <button onClick={togglePublished} disabled={busy}>
        {article.published ? "إلغاء النشر" : "نشر"}
      </button>
      <button className="danger" onClick={onDelete} disabled={busy}>
        حذف
      </button>
    </div>
  );
}
