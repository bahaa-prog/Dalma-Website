"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminArticle } from "@/lib/news";
import type { Locale } from "@/i18n/config";
import { localizePath } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";

export default function ArticleActions({
  article,
  locale,
  dict,
}: {
  article: AdminArticle;
  locale: Locale;
  dict: Dictionary["admin"];
}) {
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
          image: article.image,
          imageWidth: article.imageWidth,
          imageHeight: article.imageHeight,
          published: !article.published,
          publishedAt: article.publishedAt,
          translations: {
            ar: article.translations.ar ?? { title: "", desc: "", content: "" },
            en: article.translations.en ?? { title: "", desc: "", content: "" },
          },
        }),
      });
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  async function onDelete() {
    const title = article.translations[locale]?.title ?? article.translations.ar?.title ?? article.translations.en?.title ?? "";
    if (!confirm(dict.deleteConfirm.replace("{title}", title))) return;
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
      <Link href={localizePath(locale, `/admin/articles/${article.id}/edit`)}>{dict.edit}</Link>
      <button onClick={togglePublished} disabled={busy}>
        {article.published ? dict.unpublish : dict.publish}
      </button>
      <button className="danger" onClick={onDelete} disabled={busy}>
        {dict.delete}
      </button>
    </div>
  );
}
