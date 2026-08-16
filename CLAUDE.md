@AGENTS.md

# CLAUDE.md

React (Next.js) version of the institutional website for **مدينة الدلما الإنسانية** — Arabic RTL.
Migrated 1:1 from the plain HTML/CSS/JS site in the parent folder `~/Desktop/Dalma_Website` (the
original files there are the untouched fallback in case management returns to the Odoo
website-module approach — never modify them; all active work happens in this subfolder).

## ⚠ In-progress: bilingual (Arabic/English) rollout + Thmanyah font

A large rollout is underway (locale-prefixed routing, self-hosted Thmanyah font, bilingual news
content model, bilingual admin authoring). Most of the implementation is done; a few things are
explicitly still open. Read this section before touching routing, i18n, fonts, or the news schema.

**Done:**
- `/ar` and `/en` locale-prefixed routing for the whole site (public pages, jobs, admin). See
  "Locale routing (`src/i18n/`)" below.
- Thmanyah font self-hosted, replacing Google-hosted Cairo. See "Fonts" below.
- Every page's UI copy extracted into typed dictionaries and translated to English (home, message,
  news chrome, jobs form incl. all `<select>` options, admin UI, header/footer/contact). **The
  English translations are a first draft — not yet reviewed/approved by the client.** Treat as
  functional-but-unapproved when discussing content changes.
- `LanguageSwitcher` component wired into the header (desktop + mobile), footer, jobs header, and
  both admin screens (dashboard topbar + login card). Saves a `dalma_locale` cookie (1 year).
- CSS RTL/LTR pass: `globals.css` and `message.css` converted from hardcoded `right`/`left`/
  `border-right`/`text-align: right` to logical properties (`inset-inline-start`, `border-inline-start`,
  `text-align: start`) so the same stylesheet works in both directions. A few purely decorative
  diagonal corner accents (`.about-badge-years`/`.about-badge-iso`, `.map-open-badge`, the vision/
  mission card circles) were deliberately left physical/unmirrored — judgment call, not an oversight.
- Bilingual news data model: new `article_translations` table (see "News" below), admin article form
  rebuilt with AR/EN tabs, publish blocked until **both** languages are complete (explicit choice —
  see "News" below for why).
- `formatArticleDate(date, locale)` now takes a locale (Arabic Gregorian vs. English day-month-year).

**Still open / not done yet:**
- **A full clean `npm run build` has not been re-confirmed since the news-schema rewrite.**
  `npx tsc --noEmit` is clean, but `next build` also does route analysis/prerendering that tsc
  doesn't — run it before treating this rollout as finished.
- No manual browser QA yet of the bilingual admin authoring flow (create → tabs → publish-gate →
  both locales resolve). Only type-checked, not click-tested.
- No automated tests yet for `src/i18n/` (locale validation, direction mapping, path localization,
  redirect precedence). Planned via Node's built-in test runner — see "Known environment issue"
  below for why that's currently blocked in this sandbox specifically.
- **VPS migration path is not written.** The migration that shipped (`drizzle/0001_bilingual_news.sql`)
  assumes an **empty** `articles` table (true locally) — it just drops the old flat columns and
  creates `article_translations`. If the VPS has real published articles by the time this deploys,
  a different, data-preserving migration is needed first: back up the DB file, `INSERT INTO
  article_translations (article_id, locale, slug, title, desc, content) SELECT id, 'ar', slug,
  title, desc, content FROM articles`, map the old Arabic `cat` values to the new stable codes
  (`فعاليات`→`events`, `إنجازات`→`achievements`, `شراكات`→`partnerships`, `إعلانات`→`announcements`),
  *then* drop the old columns. Do not run `0001_bilingual_news.sql` as-is against a VPS with content.
- Minor: `ArticleEditor.tsx`'s link-insert `window.prompt("رابط:", ...)` is still hardcoded Arabic;
  `src/proxy.ts`'s 401 JSON body (`"غير مصرح."`) is still hardcoded Arabic (not currently surfaced
  in any UI, low priority).

**Known environment issue (this sandbox specifically, not the app):** `tsx` hangs indefinitely with
zero output in this session's sandboxed shell — reproduced even with a bare `tsx -e "console.log(1)"`
(esbuild's own binary runs fine standalone, so it's specific to tsx's runtime bootstrap here, not
diagnosed further). This breaks `drizzle-kit generate` / `drizzle-kit migrate` directly, since
drizzle-kit loads `drizzle.config.ts` the same way. Workaround used for the migration above: the SQL
was hand-written and applied directly against `data/app.db` via a throwaway Node script using
`better-sqlite3` (bypassing drizzle-kit's CLI), with `drizzle/meta/_journal.json` and
`drizzle/meta/0001_snapshot.json` updated by hand to keep drizzle-kit's own bookkeeping consistent
for next time. If `drizzle-kit generate`/`migrate` also hangs in a future session, this is why — try
a real (non-sandboxed) terminal first before assuming the schema or config is broken. `npm run dev`
itself was also unreliable to keep alive across separate sandboxed tool calls in this session
(needed `dangerouslyDisableSandbox`, and even then had inconsistent `curl` connectivity in-sandbox);
this is very likely a tool-sandboxing artifact of this particular session, not an app issue — running
`npm run dev` from a normal terminal should just work.

## Stack

- **Next.js 16 (App Router) + TypeScript**, server mode (`output: 'standalone'` in `next.config.ts`).
  Static export was dropped once the org confirmed a real VPS — needed for the admin portal's API
  routes, auth, and SQLite access (none of which work under `output: 'export'`).
- Hosting: company VPS (SSH/Node access), deployed via PM2 + Nginx. See `deploy/README.md` for the
  one-time setup and `deploy/deploy.sh` for the one-command redeploy.
- `npm run build` → traces a minimal server into `.next/standalone/` (see `deploy/README.md` for why
  static assets + `.env` have to be copied in after every build).
- `npm run dev` → http://localhost:3000 (redirects to `/ar` or `/en` based on the `dalma_locale`
  cookie, then `Accept-Language`, then Arabic default — see "Locale routing" below).
- `npm run start` → `next start` (real Node server now, not a static file server).
- Icons: `lucide-react` (was Lucide CDN). Font: self-hosted Thmanyah via `next/font/local` (was Cairo
  via `next/font/google`) — see "Fonts" below.
- `.agents/skills/vercel-react-best-practices/` — installed skill with 70 React/Next.js performance rules
  (Vercel Engineering). Consult before writing/reviewing React code; `SKILL.md` has the index.
- **Next.js 16 renamed `middleware.ts` → `proxy.ts`** (`src/proxy.ts` here, exporting a `proxy()`
  function, not `middleware()`) — don't reintroduce the old name, it's silently ignored.
- When using a `src/` directory, Next.js file conventions (`proxy.ts`, etc.) must live inside `src/`,
  not the project root — easy to get wrong, was wrong once already during this build.

## Structure

```
src/app/[locale]/layout.tsx  → the true root layout now (no plain src/app/layout.tsx anymore):
                                validates locale, <html lang dir>, Thmanyah font, per-locale metadata
src/app/globals.css          → ported verbatim from old css/style.css, then passed through the RTL/LTR
                                logical-property pass (see the in-progress note above)
src/app/[locale]/(main)/     → routes WITH shared Header/Footer (layout.tsx fetches the dictionary
                                and renders them)
  page.tsx                   → home (hero → about → services → stats → programs → clinics → news → contact), async, DB-backed
  message/                   → كلمة رئيس مجلس الإدارة — thin server page.tsx (fetches dict) +
                                MessageContent.tsx (client: read-more toggle) + message.css
  AboutImpact.tsx            → client "read more" toggle revealing impact content (الأثر الاجتماعي/الاقتصادي)
                                inside the home page's #about section — the standalone /impact page
                                was removed and folded in here (nav/footer links to it removed too)
  news/                      → listing, async server component + NewsGrid.tsx client filter; force-dynamic
  news/[slug]/                → article page (locale + slug), force-dynamic, no generateStaticParams;
                                resolves via getPublishedArticleByLocaleAndSlug (see "News" below)
src/app/[locale]/jobs/       → standalone route, NO shared header (own minimal header, like original).
                                page.tsx is a thin server wrapper; JobsForm.tsx is the client form.
src/app/[locale]/admin/      → admin portal — see "Admin news portal" section below. Now locale-prefixed
                                too (`/ar/admin`, `/en/admin`) with its own LanguageSwitcher.
src/app/api/admin/           → admin API routes (articles CRUD, upload, login/logout) — deliberately
                                NOT under [locale]; called via fetch(), never navigated to directly
src/app/uploads/[...path]/   → serves admin-uploaded images from UPLOADS_DIR (outside public/ and git)
src/i18n/                    → config.ts (Locale type, default "ar", direction map), routing.ts
                                (isLocale/stripLocale/localizePath/replaceLocale), get-dictionary.ts
                                (server-only loader), dictionaries/ar.ts + dictionaries/en.ts (the
                                actual copy — en.ts's type is derived from ar.ts's shape, so adding a
                                key to ar.ts without adding it to en.ts is a compile error)
src/fonts/thmanyah/          → self-hosted Thmanyah webfont files (5 static weights of thmanyahsans:
                                Light/Regular/Medium/Bold/Black — no 600/800 files exist, those weights
                                resolve to the nearest declared face via normal CSS font matching, with
                                font-synthesis:none so the browser never fakes a weight instead — see
                                thmanyahserifdisplay-Regular for the one decorative quote-mark glyph)
                                + THMANYAH-LICENSE.pdf
src/components/              → Header.tsx (client), Footer.tsx, ContactSection.tsx, LanguageSwitcher.tsx
src/db/                      → Drizzle schema (schema.ts, bilingual — see "News" below) + SQLite client
                                singleton (index.ts)
src/lib/news.ts              → DB-backed data access (was src/data/news.ts static array — deleted).
                                Locale-aware now; see "News" below for the full read/write shape.
src/lib/session.ts           → jose JWT session sign/verify (Edge-safe, used by proxy.ts + login route)
src/lib/format-date.ts        → Arabic/English date formatter (takes a locale now), split out so client
                                components (e.g. NewsGrid.tsx) don't accidentally bundle the SQLite driver
src/proxy.ts                 → Next 16's `middleware.ts` replacement; now does locale-prefix redirects
                                (cookie → Accept-Language → Arabic default) on top of the original
                                /admin/* + /api/admin/* auth gating (unchanged behavior, just re-scoped
                                to the locale-stripped path for pages; /api/admin/* stays unprefixed)
public/img/                  → all images (was assets/img/)
deploy/                      → PM2 ecosystem file, Nginx config template, deploy.sh, deployment README
```

**Client components must never import a runtime value from `src/lib/news.ts`** (only `import type`)
— that module pulls in `@/db` → `better-sqlite3`, a native Node module that can't bundle for the
browser. `NEWS_CATEGORIES`/`ArticleLocale` etc. are safe to import as runtime values from
`@/db/schema` instead (pure TS, no Node-native deps) — that's what `NewsGrid.tsx` and `ArticleForm.tsx`
do. This bit twice during the bilingual rollout; watch for it in any future client-component edit
that touches news data.

The original site under `~/Desktop/Dalma_Website` (pages/, css/, js/, assets/) remains the reference
for "what did the old site do" — a local `reference/` copy was used during migration for side-by-side
comparison and has since been deleted; go to the parent folder's files instead if needed.

## Locale routing (`src/i18n/`)

- Two locales: `ar` (default) and `en`, subpath-prefixed (`/ar/...`, `/en/...`) — no domain-based
  routing. All UI routes live under `src/app/[locale]/`; `/api/admin/*` and `/uploads/*` are
  deliberately outside it and stay unprefixed.
- `src/proxy.ts` redirects any unprefixed request (308, permanent) to the negotiated locale:
  `dalma_locale` cookie first, then `Accept-Language` via `@formatjs/intl-localematcher` +
  `negotiator`, then Arabic. It also still gates `/{locale}/admin/*` the same way it always gated
  `/admin/*` — unauthenticated page requests redirect to `/{locale}/admin/login`; unauthenticated
  `/api/admin/*` requests still get a plain 401 JSON body, unprefixed.
- Every Server Component that needs copy calls `getDictionary(locale)` from `src/i18n/get-dictionary.ts`
  and passes the relevant **slice** down to Client Components as a prop (never the whole dictionary —
  keeps client bundles from growing). `src/i18n/dictionaries/ar.ts` is the source of truth; its
  inferred type (`typeof ar`) is what `en.ts` must satisfy, so the two can't drift silently.
- `LanguageSwitcher.tsx` swaps the locale segment of the current path (preserving query + hash),
  sets the `dalma_locale` cookie, and navigates — used in the header, footer, jobs header, and both
  admin screens.
- All internal `<Link href>`s must go through `localizePath(locale, path)` (or `replaceLocale` when
  swapping an existing locale-prefixed path) from `src/i18n/routing.ts` — a bare `href="/news"` will
  round-trip through the 308 redirect instead of navigating directly.

## Fonts

Thmanyah (self-hosted, licensed — see `src/fonts/thmanyah/THMANYAH-LICENSE.pdf`) replaced Cairo.
Loaded via `next/font/local` in `src/app/[locale]/layout.tsx`, exposed as `--font-thmanyah` (body
text, all weights) and `--font-thmanyah-serif` (the one decorative quote-mark glyph on `/message`,
`thmanyahserifdisplay-Regular`, replacing a plain `Georgia` fallback). Only 5 static weights exist
(300/400/500/700/900) — CSS still using `font-weight: 600` or `800` resolves to the nearest declared
face via normal browser font matching; `font-synthesis: none` on `body` stops the browser from faking
a weight instead. If a heavier/lighter cut ever gets licensed, add its `src` entry in the layout's
`localFont()` call — no other code needs to change.

## Key conventions (carried over from the original site)

- **Colors:** `--primary: #127DB3` (blue), `--secondary: #588B46` (green) — CSS vars in globals.css
- **CSS class names are identical to the old site** — page-specific styles that lived in `<style>` blocks
  now live in a `*.css` file next to the page that imports it.
- Cards: `card-hover`, `news-card`; section titles: `section-title` / `rtl-section-title`.
- RTL: `dir="rtl"` on `<html>` in root layout; use `margin-inline` / `padding-inline`.
- Icon sizing still via `.icon-NN` classes (they override lucide-react's default 24px width/height).

## News

News is fully DB-backed (SQLite via Drizzle) and **bilingual** — there is no more static
`src/data/news.ts` file to hand-edit. Articles are created/edited through `/{locale}/admin` (see
below), not by touching code. The site currently launches with **zero articles** — safe to leave
empty; nothing below requires seed data to work correctly (empty states are all localized).

**Schema** (`src/db/schema.ts`): `articles` holds only locale-independent shared fields (`id`, `cat`,
`image`/`imageWidth`/`imageHeight`, `published`, `publishedAt`, `createdAt`, `updatedAt`). A separate
`article_translations` table holds the per-language `slug`/`title`/`desc`/`content`, one row per
`(articleId, locale)`, with unique constraints on `(articleId, locale)` and `(locale, slug)` and
`ON DELETE CASCADE` back to `articles`. `cat` is a stable code now — `NEWS_CATEGORIES = ["events",
"achievements", "partnerships", "announcements"]` in `schema.ts` — not the raw Arabic strings the
single-locale version used; labels come from `dict.categories` in the dictionaries.

**`src/lib/news.ts`** exports two different shapes:
- `Article` — the locale-resolved **flat** shape (`slug`/`title`/`desc`/`content` merged in from one
  translation row) that every public page uses, via `getPublishedArticles(locale)`,
  `getLatestArticles(n, locale)`, and `getPublishedArticleByLocaleAndSlug(locale, slug)`. The slug
  lookup returns a discriminated result — `{kind: "found", article}` / `{kind: "redirect", slug}` /
  `{kind: "not-found"}` — the redirect case handles a language switch landing on the *other* locale's
  slug (resolves the article by that slug in any locale, then redirects to this locale's own
  canonical slug if a translation exists for it). Wrapped in React `cache()` so `generateMetadata` +
  the page body share one lookup.
- `AdminArticle` — shared fields plus `translations: { ar: {...} | null, en: {...} | null }`, used by
  `getAllArticles()` / `getArticleById(id)` for the admin list and edit form. A translation can be
  `null` (never saved) even though `createArticle`/`updateArticle` currently always write both rows —
  the type allows for a future partial-translation state, don't assume both are always present.
- Publishing requires **both** languages complete — `isArticleInputPublishable(input)` checks
  `isTranslationComplete` (title ≥3 chars, desc ≥3 chars, content non-empty) on `translations.ar`
  *and* `translations.en`. This was an explicit choice (over allowing Arabic-only publish) — the admin
  API returns `{ error: "INCOMPLETE_TRANSLATION" }` (400) if you try to publish with either language
  incomplete; drafts (`published: false`) can be saved incomplete in either/both languages.
- Slugs are generated per-translation from that translation's own title (`slugify()` +
  `generateUniqueSlug(locale, title, excludeArticleId?)`, scoped uniqueness to `(locale, slug)` — the
  Arabic and English translations of the same article can legitimately share the same slug string
  without conflicting, since uniqueness is per-locale).
- `/`, `/news`, and `/news/[slug]` are all `export const dynamic = "force-dynamic"` — admin-published
  changes must show up immediately, no rebuild, no ISR window to wait out.
- Article `content` (both locales) is HTML from the Tiptap editor, sanitized server-side
  (`src/lib/sanitize-article.ts`, allowlist matching Tiptap's actual output) before it's ever written
  to the DB. Trusted on every read.
- **Migration status**: `drizzle/0001_bilingual_news.sql` has been applied to the local dev DB only.
  See the "In-progress" note at the top of this file for why it was applied by hand (not via
  `drizzle-kit migrate`) and why it is **not** safe to run as-is against a VPS that already has
  published articles.

## Admin news portal

Single shared admin account, no self-service password change, credentials fixed in `.env`
(`ADMIN_USERNAME` + `ADMIN_PASSWORD_HASH`) — intentionally simple for a one-person/one-team admin,
not multi-tenant. `SESSION_SECRET` signs a `jose` JWT stored in an httpOnly/secure/sameSite=strict
cookie (`src/lib/session.ts`). `src/proxy.ts` gates `/{locale}/admin/*` and `/api/admin/*` (except
the login routes), redirecting unauthenticated page requests to `/{locale}/admin/login` and
401-ing API requests (`/api/admin/*` stays unprefixed — see "Locale routing" above). Login attempts
are rate-limited in-memory (5 per 15 min per IP, resets on process restart — acceptable at this
scale); login API errors are stable codes (`RATE_LIMITED`/`INVALID_INPUT`/`SERVER_MISCONFIGURED`/
`INVALID_CREDENTIALS`) translated client-side in `LoginForm.tsx`, same pattern as the article API's
`INCOMPLETE_TRANSLATION`/`NOT_FOUND`.

Admin is now bilingual too (`/ar/admin/*`, `/en/admin/*`, with its own `LanguageSwitcher`) — that was
an explicit choice over keeping it Arabic-only chrome, since it's a small surface and the user wanted
full parity.

- `/{locale}/admin/articles` — list (draft/published badge, publish-toggle, delete). Row title falls
  back through `translations[locale] → translations.ar → translations.en` since either can be missing.
- `/{locale}/admin/articles/new`, `/{locale}/admin/articles/[id]/edit` — shared `ArticleForm.tsx`,
  now with **AR/EN tabs** (both language panels stay mounted, just CSS-hidden when inactive, so each
  tab's Tiptap editor instance keeps its own state — Tiptap doesn't react to a `content` prop change
  after mount, so swapping one shared editor's content on tab-switch would silently desync). Each tab
  shows a small complete/incomplete dot; the Tiptap editor (`ArticleEditor.tsx`: starter-kit + link +
  image extensions, now takes a `dir` prop) is `dir="rtl"` on the Arabic tab and `dir="ltr"` on the
  English tab regardless of which locale the admin UI itself is in. A cover-image upload button is
  shared (one image per article, not per translation).
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
