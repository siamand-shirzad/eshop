# Eshop — CHRONOS Watch Shop

A Next.js 16 + TypeScript luxury watch e-commerce storefront, built with Prisma/PostgreSQL, shadcn/ui, Tailwind, and Zustand.

## Prerequisites

- **Node.js** 20+ and **npm** (the project standardizes on npm — see `package-lock.json`)
- **PostgreSQL** running locally, or a connection string to a remote instance

## 1. Install Dependencies

```bash
npm install
```

## 2. Configure Environment

Copy the example env file and fill in your local Postgres connection string:

```bash
cp .env.example .env
```

```
DATABASE_URL="postgresql://user:password@localhost:5432/eshop?schema=public"
```

If you don't have Postgres running locally, you can start one quickly with Docker:

```bash
docker run --name eshop-pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=eshop -p 5432:5432 -d postgres:16
```

## 3. Set Up the Database

Generate the Prisma Client and apply migrations:

```bash
npm run db:generate
npx prisma migrate dev --name init
```

Seed the database with sample watch products and a demo user:

```bash
npx tsx prisma/seed.ts
```

## 4. Run the Dev Server

```bash
npm run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Other Scripts

| Script | Description |
| --- | --- |
| `npm run build` | Generates the Prisma Client and creates a production build |
| `npm run start` | Starts the production server (run `build` first) |
| `npm run lint` | Runs ESLint |
| `npm run db:push` | Pushes the Prisma schema to the database without a migration |
| `npm run db:migrate` | Creates and applies a new Prisma migration |
| `npm run db:reset` | Resets the database and re-applies all migrations |

## Project Structure

- `src/app` — Next.js App Router pages and API routes (`api/auth`, `api/cart`, `api/orders`, `api/products`)
- `src/components/shop` — storefront UI (catalog, cart, checkout, auth, etc.)
- `src/components/ui` — shadcn/ui component library
- `src/lib` — Prisma client, auth helpers, formatting, shared types
- `src/store` — Zustand stores for auth and cart state
- `prisma/schema.prisma` — database schema (PostgreSQL)
- `prisma/seed.ts` — seed script for demo products and user

## Deployment

See [`docs/postgres-migration-roadmap.md`](docs/postgres-migration-roadmap.md) for the full Postgres migration and Vercel deployment roadmap.
