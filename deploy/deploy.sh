#!/usr/bin/env bash
# Redeploy script — run from the project root on the VPS.
# One-time setup must already be done (see deploy/README.md): Node/PM2/Nginx
# installed, .env at project root with real secrets, DATABASE_URL/UPLOADS_DIR
# pointing at persistent paths outside this git checkout.
set -euo pipefail

git pull
npm ci
npx drizzle-kit migrate
npm run build

# `output: "standalone"` regenerates .next/standalone from scratch on every
# build, so anything the running server needs that isn't traced source code
# (static assets, env file) has to be copied back in every time.
mkdir -p .next/standalone/public .next/standalone/.next/static
cp -r public/. .next/standalone/public/
cp -r .next/static/. .next/standalone/.next/static/
cp .env .next/standalone/.env

pm2 startOrReload deploy/ecosystem.config.js
