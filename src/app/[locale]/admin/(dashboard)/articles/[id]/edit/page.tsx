import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/news";
import ArticleForm from "../../ArticleForm";
import { defaultLocale } from "@/i18n/config";
import { isLocale } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);
  const article = await getArticleById(Number(id));
  if (!article) notFound();

  return (
    <>
      <div className="admin-form-header">
        <h1>{dict.admin.editArticleHeading}</h1>
      </div>
      <ArticleForm initial={article} dict={{ ...dict.admin, categories: dict.categories }} />
    </>
  );
}
