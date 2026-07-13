@AGENTS.md

# CLAUDE.md

React (Next.js) version of the institutional website for **مدينة الدلما الإنسانية** — Arabic RTL.
Migrated 1:1 from the plain HTML/CSS/JS site in the parent folder `~/Desktop/Dalma_Website` (the
original files there are the untouched fallback in case management returns to the Odoo
website-module approach — never modify them; all active work happens in this subfolder).

## Stack

- **Next.js 16 (App Router) + TypeScript**, static export (`output: 'export'` in `next.config.ts`).
- `npm run build` → plain static site in `out/` — deployable to Vercel **or** any web server (hosting not decided yet).
- `npm run dev` → http://localhost:3000
- Icons: `lucide-react` (was Lucide CDN). Font: Cairo via `next/font/google` (self-hosted, was Google Fonts @import).

## Structure

```
src/app/layout.tsx           → root: <html lang="ar" dir="rtl">, Cairo font, metadata, favicon
src/app/globals.css          → ported verbatim from old css/style.css (all class names unchanged)
src/app/(main)/              → routes WITH shared Header/Footer (layout.tsx renders them)
  page.tsx                   → home (hero → about → services → stats → programs → clinics → news → contact)
  message/                   → كلمة رئيس مجلس الإدارة (client page: read-more toggle) + message.css
  impact/                    → أثر المدينة + impact.css
  news/                      → listing (client: category filter) ; layout.tsx holds metadata
  news/[id]/                 → article page, generateStaticParams from data, dynamicParams=false + article.css
src/app/jobs/                → standalone route, NO shared header (own minimal header, like original)
src/components/              → Header.tsx (client), Footer.tsx, ContactSection.tsx
src/data/news.ts             → single source of truth for news (typed Article[]; was js/news-data.js)
public/img/                  → all images (was assets/img/)
reference/                   → copy of the original HTML/CSS/JS for side-by-side comparison (gitignored)
```

## Key conventions (carried over from the original site)

- **Colors:** `--primary: #127DB3` (blue), `--secondary: #588B46` (green) — CSS vars in globals.css
- **CSS class names are identical to the old site** — page-specific styles that lived in `<style>` blocks
  now live in a `*.css` file next to the page that imports it.
- Cards: `card-hover`, `news-card`; section titles: `section-title` / `rtl-section-title`.
- RTL: `dir="rtl"` on `<html>` in root layout; use `margin-inline` / `padding-inline`.
- Icon sizing still via `.icon-NN` classes (they override lucide-react's default 24px width/height).

## News

- Add an article: append an object to `NEWS` in `src/data/news.ts` (`id, cat, date, title, desc, image, content`).
- Each article becomes its own pre-rendered page `/news/<id>/` at build time (SEO-friendly; replaced `?id=X`).
- Home page shows articles with ids 1–3; the listing page renders the whole array with client-side category filter.

## Jobs form

- Frontend-only, same as the original: submit shows the success screen, nothing is sent anywhere.
- **Open decision:** real backend (email service / API / HR system). Note: API routes are NOT available
  with `output: 'export'` — choosing Vercel + API routes would mean removing the static-export config.

## Pending / later phases

- Hosting decision (Vercel auto-deploy from GitHub vs. uploading `out/` to a company server).
- GitHub repo + deploy pipeline once hosting is chosen.
- Jobs form backend (see above).
- Partners section on home is still commented out (pending content) — same as original.
- Footer social: only X enabled; phone numbers still TODO — same as original.
