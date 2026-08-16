import { NextRequest, NextResponse } from "next/server";
import { articleInputSchema, deleteArticle, getArticleById, isArticleInputPublishable, updateArticle } from "@/lib/news";
import { sanitizeArticleHtml } from "@/lib/sanitize-article";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const parsed = articleInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.published && !isArticleInputPublishable(parsed.data)) {
    return NextResponse.json({ error: "INCOMPLETE_TRANSLATION" }, { status: 400 });
  }

  const article = await updateArticle(Number(id), {
    ...parsed.data,
    translations: {
      ar: { ...parsed.data.translations.ar, content: sanitizeArticleHtml(parsed.data.translations.ar.content) },
      en: { ...parsed.data.translations.en, content: sanitizeArticleHtml(parsed.data.translations.en.content) },
    },
  });
  if (!article) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ article });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteArticle(Number(id));
  if (!ok) return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
