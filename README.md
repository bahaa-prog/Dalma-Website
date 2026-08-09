# مدينة الدلما الإنسانية — Website

Next.js (App Router) + TypeScript institutional website, Arabic RTL. Server-rendered with a
SQLite-backed news system and an admin portal for managing articles.

## Stack

- Next.js 16 (App Router) + TypeScript, server mode (`output: 'standalone'`)
- SQLite via Drizzle ORM
- Tailwind-free hand-written CSS (see `src/app/globals.css`)

## Getting started

```bash
npm install
cp .env.example .env   # fill in DATABASE_URL, UPLOADS_DIR, ADMIN_USERNAME,
                        # ADMIN_PASSWORD_HASH, SESSION_SECRET
npm run db:migrate      # create the SQLite schema
npm run dev              # http://localhost:3000
```

## Commands

```bash
npm run dev          # start the dev server
npm run build         # production build (traces a minimal server into .next/standalone/)
npm run start          # run the production build (npm run build first)
npm run lint            # eslint
npm run db:generate     # generate a new Drizzle migration from schema.ts
npm run db:migrate       # apply migrations to the SQLite database
```

## Deployment

See `deploy/README.md` for VPS setup (PM2 + Nginx) and `deploy/deploy.sh` for redeploying.
