import { NextRequest, NextResponse } from "next/server";
import { articleInputSchema, deleteArticle, getArticleById, updateArticle } from "@/lib/news";
import { sanitizeArticleHtml } from "@/lib/sanitize-article";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const article = await getArticleById(Number(id));
  if (!article) return NextResponse.json({ error: "غير موجود." }, { status: 404 });
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

  const article = await updateArticle(Number(id), {
    ...parsed.data,
    content: sanitizeArticleHtml(parsed.data.content),
  });
  if (!article) return NextResponse.json({ error: "غير موجود." }, { status: 404 });
  return NextResponse.json({ article });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const ok = await deleteArticle(Number(id));
  if (!ok) return NextResponse.json({ error: "غير موجود." }, { status: 404 });
  return NextResponse.json({ ok: true });
}
