@AGENTS.md

# CLAUDE.md

React (Next.js) version of the institutional website for **مدينة الدلما الإنسانية** — Arabic RTL.
Migrated 1:1 from the plain HTML/CSS/JS site in the parent folder `~/Desktop/Dalma_Website` (the
original files there are the untouched fallback in case management returns to the Odoo
website-module approach — never modify them; all active work happens in this subfolder).

## Stack

- **Next.js 16 (App Router) + TypeScript**, server mode (`output: 'standalone'` in `next.config.ts`).
  Static export was dropped once the org confirmed a real VPS — needed for the admin portal's API
  routes, auth, and SQLite access (none of which work under `output: 'export'`).
- Hosting: company VPS (SSH/Node access), deployed via PM2 + Nginx. See `deploy/README.md` for the
  one-time setup and `deploy/deploy.sh` for the one-command redeploy.
- `npm run build` → traces a minimal server into `.next/standalone/` (see `deploy/README.md` for why
  static assets + `.env` have to be copied in after every build).
- `npm run dev` → http://localhost:3000
- `npm run start` → `next start` (real Node server now, not a static file server).
- Icons: `lucide-react` (was Lucide CDN). Font: Cairo via `next/font/google` (self-hosted, was Google Fonts @import).
- `.agents/skills/vercel-react-best-practices/` — installed skill with 70 React/Next.js performance rules
  (Vercel Engineering). Consult before writing/reviewing React code; `SKILL.md` has the index.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** (`src/proxy.ts` here, exporting a `proxy()`
  function, not `middleware()`) — don't reintroduce the old name, it's silently ignored.
- When using a `src/` directory, Next.js file conventions (`proxy.ts`, etc.) must live inside `src/`,
  not the project root — easy to get wrong, was wrong once already during this build.

## Structure

```
src/app/layout.tsx           → root: <html lang="ar" dir="rtl">, Cairo font, metadata, favicon
src/app/globals.css          → ported verbatim from old css/style.css (all class names unchanged)
src/app/(main)/              → routes WITH shared Header/Footer (layout.tsx renders them)
  page.tsx                   → home (hero → about → services → stats → programs → clinics → news → contact), async, DB-backed
  message/                   → كلمة رئيس مجلس الإدارة (client page: read-more toggle) + message.css
  AboutImpact.tsx            → client "read more" toggle revealing impact content (الأثر الاجتماعي/الاقتصادي)
                                inside the home page's #about section — the standalone /impact page
                                was removed and folded in here (nav/footer links to it removed too)
  news/                      → listing, async server component + NewsGrid.tsx client filter; force-dynamic
  news/[slug]/                → article page (slug-based, not numeric id), force-dynamic, no generateStaticParams
src/app/jobs/                → standalone route, NO shared header (own minimal header, like original)
src/app/admin/               → admin portal — see "Admin news portal" section below
src/app/api/admin/           → admin API routes (articles CRUD, upload, login/logout)
src/app/uploads/[...path]/   → serves admin-uploaded images from UPLOADS_DIR (outside public/ and git)
src/components/              → Header.tsx (client), Footer.tsx, ContactSection.tsx
src/db/                      → Drizzle schema (schema.ts) + SQLite client singleton (index.ts)
src/lib/news.ts              → DB-backed data access (was src/data/news.ts static array — deleted)
src/lib/session.ts           → jose JWT session sign/verify (Edge-safe, used by proxy.ts + login route)
src/lib/format-date.ts        → Arabic Gregorian date formatter, split out so client components
                                (e.g. NewsGrid.tsx) don't accidentally bundle the SQLite driver
src/proxy.ts                 → Next 16's `middleware.ts` replacement; gates /admin/* and /api/admin/*
public/img/                  → all images (was assets/img/)
deploy/                      → PM2 ecosystem file, Nginx config template, deploy.sh, deployment README
```

The original site under `~/Desktop/Dalma_Website` (pages/, css/, js/, assets/) remains the reference
for "what did the old site do" — a local `reference/` copy was used during migration for side-by-side
comparison and has since been deleted; go to the parent folder's files instead if needed.

## Key conventions (carried over from the original site)

- **Colors:** `--primary: #127DB3` (blue), `--secondary: #588B46` (green) — CSS vars in globals.css
- **CSS class names are identical to the old site** — page-specific styles that lived in `<style>` blocks
  now live in a `*.css` file next to the page that imports it.
- Cards: `card-hover`, `news-card`; section titles: `section-title` / `rtl-section-title`.
- RTL: `dir="rtl"` on `<html>` in root layout; use `margin-inline` / `padding-inline`.
- Icon sizing still via `.icon-NN` classes (they override lucide-react's default 24px width/height).

## News

News is fully DB-backed now (SQLite via Drizzle) — there is no more static `src/data/news.ts` file
to hand-edit. Articles are created/edited through `/admin` (see below), not by touching code.

- Public reads go through `src/lib/news.ts`: `getPublishedArticles()`, `getLatestArticles(n)`,
  `getPublishedArticleBySlug(slug)` (published only), `getArticleBySlug`/`getArticleById` (any state,
  for the admin). `getArticleBySlug` is wrapped in React `cache()` to dedupe the metadata + page-body
  lookups on `/news/[slug]`.
- URLs are slug-based (`/news/some-title`), generated from the title on create and kept stable on
  edit unless the title changes.
- Articles have a draft/published toggle (`published` boolean + `publishedAt` timestamp, admin-editable
  for backdating). Drafts never appear on public pages or resolve at their slug URL.
- `/`, `/news`, and `/news/[slug]` are all `export const dynamic = "force-dynamic"` — admin-published
  changes must show up immediately, no rebuild, no ISR window to wait out.
- Article `content` is HTML from the Tiptap editor, sanitized server-side (`src/lib/sanitize-article.ts`,
  allowlist matching Tiptap's actual output) before it's ever written to the DB. Trusted on every read.
- The site currently launches with **zero articles** (the old 7 hardcoded mock articles were deleted,
  not migrated) — this was a deliberate choice so the admin's first real use of the portal is also its
  first real test.

## Admin news portal

Single shared admin account, no self-service password change, credentials fixed in `.env`
(`ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH`) — intentionally simple for a one-person/one-team admin,
not multi-tenant. `SESSION_SECRET` signs a `jose` JWT stored in an httpOnly/secure/sameSite=strict
cookie (`src/lib/session.ts`). `src/proxy.ts` gates `/admin/*` and `/api/admin/*` (except the login
routes), redirecting unauthenticated page requests to `/admin/login` and 401-ing API requests.
Login attempts are rate-limited in-memory (5 per 15 min per IP, resets on process restart —
acceptable at this scale).

- `/admin/articles` — list (draft/published badge, publish-toggle, delete).
- `/admin/articles/new`, `/admin/articles/[id]/edit` — shared `ArticleForm.tsx` with the Tiptap
  editor (`ArticleEditor.tsx`: starter-kit + link + image extensions) and a cover-image upload button.
- Image uploads (`/api/admin/upload`) are re-encoded to webp and stripped of EXIF via `sharp`
  (also verifies the bytes are a real image, not just a spoofed extension/mime), stored flat in
  `UPLOADS_DIR` (outside `public/` and the git tree) under a random UUID filename, and served back
  through `src/app/uploads/[...path]/route.ts` — works in dev out of the box; on the VPS, Nginx can
  intercept `/uploads/` and serve the files directly instead (see `deploy/nginx.conf`), bypassing
  Node entirely for image bytes.
- **`.env` gotcha**: Next's env loader (`@next/env`) does shell-style `$name` expansion. A raw bcrypt
  hash (`$2b$10$...`) gets silently mangled unless every `$` is escaped as `\$` in `.env`. See the
  comment in `.env.example`.

## Jobs form

- Still frontend-only, unchanged: submit shows the success screen, nothing is sent anywhere.
- **Open decision:** real backend (email service / API / HR system) — now unblocked, since the app
  runs as a real Node server and API routes work. Not built yet.

## Pending / later phases

- Jobs form backend (see above).
- Partners section on home is still commented out (pending content) — same as original.
- Footer social: only X enabled, linked to `https://x.com/dhc_jouf?lang=ar`, using a real
  brand-mark SVG (`src/components/icons/XLogo.tsx`) instead of lucide's generic X icon;
  phone numbers still TODO — same as original.
- Footer logo row: Dalma logo + `rafq_white_logo.PNG` + `HR_white_logo.PNG` (transparent-bg
  white logos, no badge wrapper), sized via `.footer-logo-lg` / `.footer-logo-xl` in globals.css.
- No multi-admin / roles, no self-service password reset, no ISR/ caching tuning — all deliberately
  left simple for a single-admin, low-traffic institutional site; revisit only if that changes.

## Housekeeping notes

- `README.md` is intentionally minimal and points here — don't let it drift back to create-next-app boilerplate.
- `globals.css` had a dead contact-form block (`.contact-form-box`, `#contact-success`, etc.) removed —
  it styled a form that never existed in either the old or new site's markup; the real contact section
  (`ContactSection.tsx`) only has info links + a map embed.
