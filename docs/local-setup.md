# Local setup and testing

Verified clone: commit `313caaa`, branch `setup/local-test`, 2026-09-21.
Working directory: `/home/codexproxy/Codex-project-2/website-ai`.

## Installed environment

Ubuntu 24.04, Node 22.23.2, pnpm 11.25.0, PHP 8.3, Composer 2.7.1,
MariaDB 10.11 (MySQL-compatible). PHP includes curl, mbstring, XML, ZIP,
PDO MySQL and SQLite. Dependencies were installed from committed lockfiles.

Local `.env` files are ignored by Git. Backend uses `website_ai_local` for
demo data, with a loopback-only database account `website_ai_local` (no password,
local development only). That account has access only to the two project databases.
Tests use the separate `website_ai_testing` database. SMTP uses `MAIL_MAILER=log`.
Never reuse this local database configuration for a public deployment.

109 migrations and the default demo seed completed. `database.sql` was not imported.
The storage symlink and Laravel app key were generated. Backend legacy Vite assets
were also built because the existing test suite includes Blade pages.

## Run again

Ensure MariaDB is running (`sudo service mariadb start` on this machine).
From repository root, with ports 3000 and 8000 free:

```bash
bash scripts/start-local.sh
```

This starts Next.js production mode, Laravel API and the database queue worker.
Ctrl+C stops the launched services. Use `pnpm dev` from `mindnova-ai` instead of
the production frontend when editing UI. Rebuild with `pnpm build` after changes
before using the production launcher again.

- Frontend: http://localhost:3000
- Backend health: http://127.0.0.1:8000/up
- Student: `hieu.student@mindnova.ai`, password `password`
- Instructor: `teacher@mindnova.ai`, password `password`

These are demo credentials. Default seed does not provide an admin account.
The three `student.*@mindnova.com` scenario accounts have missing role pivots
after the default seed; use the verified accounts above. Full findings are in
`reviews/local-setup-test-report.md`.

## Repeat checks

```bash
# With both servers running:
node scripts/smoke-local.mjs

cd mindnova-ai
pnpm test
pnpm exec vitest run --maxWorkers=1
pnpm lint
pnpm exec tsc --noEmit
pnpm build

cd ../website-MindNova-AI
# Explicit override prevents RefreshDatabase from touching the app database.
DB_DATABASE=website_ai_testing php artisan test --compact
```

Initial dependencies: `pnpm install --frozen-lockfile` in frontend;
`composer install --no-interaction --prefer-dist` in backend. Backend Blade assets:
`npm ci && npm run build`. For a different machine, follow root README to create
local env files, app key, dedicated databases, migrations and seed.

AI generation, payment providers, Google OAuth, SMTP delivery and R2 require
real external configuration and were not live-tested. Reverb is not enabled in
this local setup (`BROADCAST_CONNECTION=log`); REST chat and realtime delivery
are different checks. No Promptfoo model evaluations were run: the current
verification uses the repository's Vitest/Pest tests and real browser/API smoke.
