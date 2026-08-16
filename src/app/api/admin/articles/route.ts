import { NextRequest, NextResponse } from "next/server";
import { articleInputSchema, createArticle, getAllArticles, isArticleInputPublishable } from "@/lib/news";
import { sanitizeArticleHtml } from "@/lib/sanitize-article";

export async function GET() {
  const articles = await getAllArticles();
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const parsed = articleInputSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  if (parsed.data.published && !isArticleInputPublishable(parsed.data)) {
    return NextResponse.json({ error: "INCOMPLETE_TRANSLATION" }, { status: 400 });
  }

  const article = await createArticle({
    ...parsed.data,
    translations: {
      ar: { ...parsed.data.translations.ar, content: sanitizeArticleHtml(parsed.data.translations.ar.content) },
      en: { ...parsed.data.translations.en, content: sanitizeArticleHtml(parsed.data.translations.en.content) },
    },
  });
  return NextResponse.json({ article }, { status: 201 });
}
