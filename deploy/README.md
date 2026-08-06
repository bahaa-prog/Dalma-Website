# VPS deployment

One-time setup, then a one-command redeploy for every change after that.

## One-time VPS setup

1. **Node.js** — install a current LTS (Node 20+) via your distro's method of choice (nvm, NodeSource, etc).
2. **PM2** — `npm install -g pm2`.
3. **Nginx** — `apt install nginx` (or equivalent).
4. **Clone the repo** to e.g. `/var/www/dalma-website` and `cd` into it.
5. **Persistent data directories**, outside the git checkout so they survive every redeploy:
   ```bash
   mkdir -p /var/www/dalma-data /var/www/dalma-uploads
   ```
6. **`.env`** at the project root (gitignored — create by hand, never commit):
   ```bash
   cp .env.example .env
   ```
   Fill in:
   - `DATABASE_URL=/var/www/dalma-data/app.db`
   - `UPLOADS_DIR=/var/www/dalma-uploads`
   - `ADMIN_USERNAME` / `ADMIN_PASSWORD_HASH` — generate the hash with
     `node -e "console.log(require('bcryptjs').hashSync('your-real-password', 10))"`,
     then **escape every `$` as `\$`** when pasting it in (see the comment in `.env.example` —
     Next's env loader does shell-style `$var` expansion and will silently mangle a raw bcrypt hash otherwise).
   - `SESSION_SECRET` — `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`
7. **Install deps + first build + migrate + seed the empty DB**:
   ```bash
   npm ci
   npx drizzle-kit migrate
   npm run build
   ```
8. **Nginx**: copy `deploy/nginx.conf` to `/etc/nginx/sites-available/dalma`, replace `YOUR_DOMAIN`,
   symlink into `sites-enabled`, `nginx -t`, `systemctl reload nginx`. Then get a cert:
   ```bash
   certbot --nginx -d YOUR_DOMAIN
   ```
9. **Start the app** with the deploy script (handles copying static assets + `.env` into the
   standalone build, then starts PM2):
   ```bash
   ./deploy/deploy.sh
   pm2 save
   pm2 startup   # follow the printed instructions so PM2 survives a reboot
   ```

## Every redeploy after that

```bash
cd /var/www/dalma-website
./deploy/deploy.sh
```

This pulls latest, installs deps, runs any new DB migrations, rebuilds, copies the static
assets + `.env` into `.next/standalone` (which `next build` regenerates from scratch every
time), and reloads the PM2 process with zero downtime.

## Why the copy step exists

`output: "standalone"` in `next.config.ts` makes `next build` trace only the files the server
actually needs into `.next/standalone/`, which is the folder you'd deploy on its own to a bare
server. It does **not** include `public/`, `.next/static/`, or any `.env*` file — those have to
be copied in manually, and since the whole `.next/standalone` folder is regenerated on every
build, that copy has to happen on every deploy too. `deploy/deploy.sh` does this automatically.

## Backups

`/var/www/dalma-data/app.db` (SQLite) and `/var/www/dalma-uploads/` (article images) are the
only things that aren't reproducible from git. A simple daily cron copy of both to another disk
or off-box location is sufficient at this traffic level — no need for anything fancier:

```cron
0 3 * * * tar -czf /var/backups/dalma-$(date +\%F).tar.gz /var/www/dalma-data /var/www/dalma-uploads
```
