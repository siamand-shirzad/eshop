# PostgreSQL Migration & Deploy Roadmap

This document tracks the move from local SQLite (`db/custom.db`) to PostgreSQL, and the steps to deploy the app end-to-end.

## Status

- [x] `prisma/schema.prisma` datasource `provider` changed `sqlite` -> `postgresql`
- [x] `.env` `DATABASE_URL` changed to a `postgresql://` connection string (placeholder, update per environment)
- [x] Verified no raw/SQLite-specific SQL in `src/` or `prisma/seed.ts`
- [ ] Provision a real Postgres instance for local dev
- [ ] Generate first migration against Postgres (`prisma migrate dev --name init`)
- [ ] Re-seed data (`bun run db:generate && bun prisma/seed.ts` or via `db:push`)
- [ ] Provision managed Postgres for staging/production
- [ ] Wire CI/CD to run `prisma migrate deploy` before app start
- [ ] Deploy app (Vercel / Docker+Caddy / other) with production `DATABASE_URL`
- [ ] Decommission `db/custom.db` and SQLite-only tooling references

---

## 1. Local Development Setup

1. **Run Postgres locally** (pick one):
   - Docker: `docker run --name eshop-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=eshop -p 5432:5432 -d postgres:16`
   - Or install Postgres natively / use an existing local server.
2. **Set `DATABASE_URL`** in `.env` (already updated as a placeholder):
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/eshop?schema=public"
   ```
   Adjust user/password/host/port/db name to match your instance.
3. **Install Prisma CLI** if `node_modules` isn't populated yet:
   ```
   bun install   # or npm install / pnpm install / yarn install — pick ONE package manager
   ```
4. **Generate the first migration** (this replaces the old `db push` workflow used for SQLite; real migrations are recommended for Postgres so history is tracked):
   ```
   bun run db:generate
   npx prisma migrate dev --name init
   ```
   This creates `prisma/migrations/<timestamp>_init/` and applies it to your local Postgres DB.
5. **Seed data**:
   ```
   bun run prisma/seed.ts
   ```
   (or whatever seed command the project already uses — check `prisma.seed` config / existing `db:*` scripts).
6. **Sanity check**: run `bun run dev`, confirm the catalog loads products, auth/register/login works, and an order can be placed.

## 2. Data Cutover (if preserving existing SQLite data)

If the existing `db/custom.db` has real data you need to keep (not just seed data):

1. Export SQLite data to CSV/JSON per table (e.g. with a small script using `@prisma/client` pointed at the old SQLite schema, or `sqlite3 db/custom.db .dump`).
2. Transform any SQLite-specific quirks (e.g. booleans stored as 0/1 are fine — Prisma handles this — but double check `DateTime` string formats).
3. Import into Postgres using a one-off Node/TS script with `@prisma/client` (`createMany`) against the new Postgres `DATABASE_URL`, respecting foreign-key order: `User` -> `Product` -> `CartItem` / `Order` -> `OrderItem`.
4. Verify row counts match between old and new databases before decommissioning SQLite.

If the SQLite data is just seed/demo data (likely, based on `prisma/seed.ts`), skip cutover and just re-seed Postgres directly.

## 3. Staging / Production Database Provisioning

Pick a managed Postgres provider (any of these work well with Prisma):

- **Neon** — serverless Postgres, generous free tier, branching for preview environments.
- **Supabase** — managed Postgres + extras (auth/storage not needed here since app has its own auth).
- **Render Postgres** — simple managed instance, pairs well with Render web services.
- **Railway** — one-click Postgres, good DX for small teams.
- **AWS RDS / Google Cloud SQL** — for teams already on that cloud.

Steps:

1. Create the Postgres instance/database in the chosen provider's dashboard.
2. Copy the connection string (use the **pooled**/**pgbouncer** connection string if the provider offers one and the host platform is serverless, e.g. Vercel — direct connections exhaust quickly under serverless functions).
3. If using a pooled URL, also grab the **direct** connection string for running migrations (`prisma migrate deploy` should use the direct/non-pooled URL; the app runtime can use the pooled URL). Prisma supports this via `directUrl` in the datasource block if needed:
   ```prisma
   datasource db {
     provider  = "postgresql"
     url       = env("DATABASE_URL")
     directUrl = env("DIRECT_DATABASE_URL")
   }
   ```
4. Store connection strings as environment variables/secrets in the hosting platform (never commit real credentials to `.env` in git — it's already gitignored via `.env*` in `.gitignore`).

## 4. CI/CD Pipeline Changes

Add a migration step that runs **before** the app starts in each environment:

```
npx prisma migrate deploy
```

This applies committed migrations from `prisma/migrations/` without prompting (unlike `migrate dev`). Recommended pipeline shape:

1. Install deps (`bun install` / `npm ci` — standardize on one, see "Cleanup" below).
2. `npx prisma generate` (regenerate Prisma Client for the target platform).
3. `npx prisma migrate deploy` (apply pending migrations to the target `DATABASE_URL`).
4. `next build` (existing `build` script already does this + copies static/public assets).
5. Start the app (`start` script already wraps `bun .next/standalone/server.js`).

If deploying via a platform with its own build pipeline (Vercel, Render, etc.), add `prisma migrate deploy` as a pre-build/release step per that platform's hooks (see Section 5).

## 5. Deployment Target Options

Choose one deployment path based on the app's `output: "standalone"` Next.js config and existing `Caddyfile` (suggests a self-hosted/VPS setup today):

### Option A — Vercel (simplest for Next.js)
- Connect the repo, set `DATABASE_URL` (pooled) and `DIRECT_DATABASE_URL` (if used) as env vars.
- Add a `postinstall` script or Vercel "Build Command" override: `prisma generate && prisma migrate deploy && next build`.
- Note: Vercel serverless functions need a Postgres provider that supports connection pooling (Neon/Supabase both do).

### Option B — Docker + VPS (matches existing `Caddyfile` reverse proxy setup)
- Add a `Dockerfile` building the Next.js `standalone` output (multi-stage: build stage runs `prisma generate` + `next build`; runtime stage copies `.next/standalone`).
- Run `prisma migrate deploy` as a release step (either in an entrypoint script before `node server.js`, or as a separate one-off deploy job) so migrations don't race across multiple container replicas.
- Keep `Caddyfile` as-is for TLS/reverse-proxy in front of the container's port 3000.
- Point `DATABASE_URL` at the managed Postgres instance via the VPS's env/secrets manager.

### Option C — Render / Railway (managed platform, pairs with their own Postgres add-on)
- Use their native "Web Service" + "Postgres" add-on pairing so `DATABASE_URL` is injected automatically.
- Add a pre-deploy/release command: `npx prisma migrate deploy`.

Recommendation: **Option A (Vercel) + Neon Postgres** is the lowest-effort path given this is a Next.js app already using `output: "standalone"`; **Option B** is preferable if the team wants to keep the existing Caddy/VPS setup.

## 6. Cleanup / Housekeeping

- **Multiple lockfiles**: `package-lock.json`, `pnpm-lock.yaml`, `yarn.lock`, and `bun.lock` all exist simultaneously. Standardize on one package manager (scripts use `bun`) and delete the others to avoid dependency drift between local/CI/prod.
- **`db/custom.db`**: remove once Postgres cutover is verified in all environments; also drop `db/` from any remaining references once unused.
- **`.env` files**: ensure real Postgres credentials for staging/production are never committed; only placeholders belong in `.env`/`.env.example` files checked into git history (note: `.gitignore` already ignores `.env*`, so verify none of these are accidentally tracked with real secrets).

## 7. Rollback Plan

- Keep `db/custom.db` untouched until Postgres is verified in production for at least one full deploy cycle.
- Since `provider` is a single line in `schema.prisma`, reverting to SQLite is a two-line revert (`schema.prisma` + `DATABASE_URL`) plus `prisma generate` — no application code changes are required either direction, since all data access goes through Prisma Client.
