import { notFound } from "next/navigation";
import { getArticleById } from "@/lib/news";
import ArticleForm from "../../ArticleForm";

export default async function EditArticlePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article) notFound();

  return (
    <>
      <div className="admin-form-header">
        <h1>تعديل المقال</h1>
      </div>
      <ArticleForm initial={article} />
    </>
  );
}
