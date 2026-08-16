"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { NEWS_CATEGORIES, ARTICLE_LOCALES, type NewsCategory, type ArticleLocale } from "@/db/schema";
import type { AdminArticle, TranslationInput } from "@/lib/news";
import ArticleEditor from "./ArticleEditor";
import { pickAndUploadImage } from "./upload-client";
import { defaultLocale } from "@/i18n/config";
import { isLocale, localizePath } from "@/i18n/routing";
import type { Dictionary } from "@/i18n/dictionaries/ar";

function toLocalInputValue(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function isTranslationComplete(t: TranslationInput): boolean {
  return t.title.trim().length >= 3 && t.desc.trim().length >= 3 && t.content.trim().length > 0;
}

const emptyTranslation: TranslationInput = { title: "", desc: "", content: "" };

export default function ArticleForm({
  initial,
  dict,
}: {
  initial?: AdminArticle;
  dict: Dictionary["admin"] & { categories: Dictionary["categories"] };
}) {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const uiLocale = isLocale(params.locale) ? params.locale : defaultLocale;

  const [cat, setCat] = useState<NewsCategory>(initial?.cat ?? NEWS_CATEGORIES[0]);
  const [translations, setTranslations] = useState<Record<ArticleLocale, TranslationInput>>({
    ar: initial?.translations.ar ?? emptyTranslation,
    en: initial?.translations.en ?? emptyTranslation,
  });
  const [activeTab, setActiveTab] = useState<ArticleLocale>("ar");
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

  const setTranslationField = (locale: ArticleLocale, field: keyof TranslationInput, value: string) => {
    setTranslations((prev) => ({ ...prev, [locale]: { ...prev[locale], [field]: value } }));
  };

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
      image,
      imageWidth,
      imageHeight,
      published,
      publishedAt: new Date(publishedAt).toISOString(),
      translations,
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
        const data = await res.json().catch(() => null);
        setError(
          data?.error === "INCOMPLETE_TRANSLATION" ? dict.form.incompleteWarning : dict.form.saveError
        );
        return;
      }
      router.push(localizePath(uiLocale, "/admin/articles"));
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
          <label htmlFor="cat">{dict.form.category}</label>
          <select id="cat" value={cat} onChange={(e) => setCat(e.target.value as NewsCategory)}>
            {NEWS_CATEGORIES.map((c) => (
              <option key={c} value={c}>{dict.categories[c]}</option>
            ))}
          </select>
        </div>

        <div className="admin-field">
          <label htmlFor="publishedAt">{dict.form.publishDate}</label>
          <input
            id="publishedAt"
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
            required
          />
        </div>

        <div className="admin-field admin-field-full">
          <label>{dict.form.coverImage}</label>
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt="" style={{ maxWidth: "16rem", borderRadius: "0.5rem", marginBottom: "0.75rem", display: "block" }} />
          )}
          <button type="button" className="admin-btn-secondary" onClick={onUploadCover} disabled={imageUploading}>
            {imageUploading ? dict.form.uploading : image ? dict.form.replaceImage : dict.form.uploadImage}
          </button>
        </div>

        <div className="admin-field admin-field-full">
          <div className="admin-lang-tabs">
            {ARTICLE_LOCALES.map((locale) => {
              const complete = isTranslationComplete(translations[locale]);
              return (
                <button
                  key={locale}
                  type="button"
                  className={`admin-lang-tab${activeTab === locale ? " active" : ""}`}
                  onClick={() => setActiveTab(locale)}
                >
                  <span className={`admin-lang-tab-dot${complete ? " complete" : ""}`} />
                  {locale === "ar" ? dict.form.tabAr : dict.form.tabEn}
                  <span style={{ fontSize: "0.6875rem", fontWeight: 600, opacity: 0.7 }}>
                    {complete ? dict.form.completeBadge : dict.form.incompleteBadge}
                  </span>
                </button>
              );
            })}
          </div>

          {ARTICLE_LOCALES.map((locale) => (
            <div key={locale} className="admin-lang-panel" hidden={activeTab !== locale} dir={locale === "ar" ? "rtl" : "ltr"}>
              <div className="admin-field">
                <label htmlFor={`title-${locale}`}>{dict.form.title}</label>
                <input
                  id={`title-${locale}`}
                  type="text"
                  maxLength={200}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  value={translations[locale].title}
                  onChange={(e) => setTranslationField(locale, "title", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label htmlFor={`desc-${locale}`}>{dict.form.desc}</label>
                <textarea
                  id={`desc-${locale}`}
                  maxLength={500}
                  rows={2}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                  value={translations[locale].desc}
                  onChange={(e) => setTranslationField(locale, "desc", e.target.value)}
                />
              </div>
              <div className="admin-field">
                <label>{dict.form.content}</label>
                <ArticleEditor
                  content={translations[locale].content}
                  onChange={(html) => setTranslationField(locale, "content", html)}
                  onRequestImageUpload={async () => (await pickAndUploadImage())?.url ?? null}
                  dir={locale === "ar" ? "rtl" : "ltr"}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="admin-field admin-field-full admin-checkbox-field">
          <input
            id="published"
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
          />
          <label htmlFor="published" style={{ marginBottom: 0 }}>{dict.form.publishNow}</label>
        </div>
        {published && !(isTranslationComplete(translations.ar) && isTranslationComplete(translations.en)) && (
          <div className="admin-field admin-field-full admin-incomplete-warning">
            {dict.form.incompleteWarning}
          </div>
        )}
      </div>

      <div className="admin-form-actions">
        <button type="submit" className="admin-btn-primary" style={{ width: "auto" }} disabled={saving}>
          {saving ? dict.form.saving : dict.form.save}
        </button>
        <button type="button" className="admin-btn-secondary" onClick={() => router.push(localizePath(uiLocale, "/admin/articles"))}>
          {dict.form.cancel}
        </button>
      </div>
    </form>
  );
}
