"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { NEWS_CATEGORIES, type NewsCategory } from "@/db/schema";
import type { Article } from "@/lib/news";
import ArticleEditor from "./ArticleEditor";
import { pickAndUploadImage } from "./upload-client";

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default function ArticleForm({ initial }: { initial?: Article }) {
  const router = useRouter();
  const [cat, setCat] = useState<NewsCategory>(initial?.cat ?? NEWS_CATEGORIES[0]);
  const [title, setTitle] = useState(initial?.title ?? "");
  const [desc, setDesc] = useState(initial?.desc ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [image, setImage] = useState<string | null>(initial?.image ?? null);
  const [imageWidth, setImageWidth] = useState<number | null>(initial?.imageWidth ?? null);
  const [imageHeight, setImageHeight] = useState<number | null>(initial?.imageHeight ?? null);
  const [published, setPublished] = useState(initial?.published ?? false);
  const [publishedAt, setPublishedAt] = useState(() =>
    toLocalInputValue(initial?.publishedAt ?? new Date())
  );
  const [imageUploading, setImageUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onUploadCover() {
    setImageUploading(true);
    try {
      const result = await pickAndUploadImage();
      if (result) {
        setImage(result.url);
        setImageWidth(result.width);
        setImageHeight(result.height);
      }
    } finally {
      setImageUploading(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);

    const payload = {
      cat,
      title,
      desc,
      content,
      image,
      imageWidth,
      imageHeight,
      published,
      publishedAt: new Date(publishedAt).toISOString(),
    };

    try {
      const res = await fetch(
        initial ? `/api/admin/articles/${initial.id}` : "/api/admin/articles",
        {
          method: initial ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      if (!res.ok) {
        setError("تعذر حفظ المقال — تحقق من الحقول.");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      {error && <div className="admin-error">{error}</div>}

      <div className="admin-form-grid">
        <div className="admin-field">
          <label htmlFor="cat">التصنيف</label>
          <select id="cat" value={cat} onChange={(e) => setCat(e.target.value as NewsCategory)}>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="publishedAt">تاريخ النشر</label>
          <input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            required
          />
        </div>

        <div className="admin-field admin-field-full">
          <label htmlFor="title">العنوان</label>
          <input
            id="title"
            type="text"
            required
            minLength={3}
            maxLength={200}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="admin-field admin-field-full">
          <label htmlFor="desc">الوصف المختصر (يظهر في بطاقة الخبر)</label>
          <textarea
            id="desc"
            required
            minLength={3}
            maxLength={500}
            rows={2}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>

        <div className="admin-field admin-field-full">
          <label>الصورة الرئيسية</label>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" style={{ maxWidth: "16rem", borderRadius: "0.5rem", marginBottom: "0.75rem", display: "block" }} />
          )}
          <button type="button" className="admin-btn-secondary" onClick={onUploadCover} disabled={imageUploading}>
            {imageUploading ? "جارٍ الرفع..." : image ? "استبدال الصورة" : "رفع صورة"}
          </button>
        </div>

        <div className="admin-field admin-field-full">
          <label>محتوى المقال</label>
          <ArticleEditor
            content={content}
            onChange={setContent}
            onRequestImageUpload={async () => (await pickAndUploadImage())?.url ?? null}
          />
        </div>

        <div className="admin-field admin-field-full admin-checkbox-field">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label htmlFor="published" style={{ marginBottom: 0 }}>نشر المقال فوراً (وإلا يُحفظ كمسودة)</label>
        </div>
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn-primary" style={{ width: "auto" }} disabled={saving}>
          {saving ? "جارٍ الحفظ..." : "حفظ"}
        </button>
        <button type="button" className="admin-btn-secondary" onClick={() => router.push("/admin/articles")}>
          إلغاء
        </button>
      </div>
    </form>
  );
}
