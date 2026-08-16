import ArticleForm from "../ArticleForm";
import { defaultLocale } from "@/i18n/config";
import { isLocale } from "@/i18n/routing";
import { getDictionary } from "@/i18n/get-dictionary";

export default async function NewArticlePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
  const dict = await getDictionary(locale);

  return (
    <>
      <div className="admin-form-header">
        <h1>{dict.admin.newArticleHeading}</h1>
      </div>
      <ArticleForm dict={{ ...dict.admin, categories: dict.categories }} />
    </>
  );
}
