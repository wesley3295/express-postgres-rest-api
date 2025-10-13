Express + Postgres REST API (TypeScript)

- Overview
  - Minimal Express app scaffolded in TypeScript with `helmet`, `cors`, and JSON body parsing (`src/app.ts`).
  - Project is set up to target a Postgres-backed REST API using Prisma, but database schema and wiring are not implemented yet.
  - Tooling is present (TypeScript, Vitest, ESLint, Docker assets), though several configs are placeholders.

- Status
  - Early foundation. No routes, server bootstrap, or Prisma schema yet.
  - No `start`/`dev` script is defined; tests are enabled but none exist.

- Project Structure
  - `src/app.ts` — Express app with security (`helmet`), CORS, and JSON middleware.
  - `src/server.ts` — Placeholder for the HTTP server bootstrap.
  - `src/router.ts` — Placeholder for API routes.
  - `src/env.ts` — Placeholder for environment variable parsing/validation.
  - `src/config/db.ts` — Placeholder for database client/configuration (Prisma/connection).
  - `prisma/schema.prisma` — Placeholder Prisma schema.
  - `.env.example` — Placeholder for environment variables (copy to `.env` when defined).
  - `Dockerfile`, `docker-compose.yml` — Placeholders for containerization.
  - `vitest.config.ts` — Placeholder test runner config.
  - `.eslintrc.cjs` — Placeholder lint config.

- Prerequisites
  - Node.js 18+ recommended.
  - `pnpm` (preferred; repo includes `pnpm-lock.yaml`).

- Install
  - `pnpm install`

- Scripts
  - `pnpm test` — Runs Vitest in run mode (no tests yet).

- Environment Variables (planned)
  - Common variables for this stack (not yet consumed in code):
    - `PORT` — Port for the HTTP server (e.g., 3000).
    - `DATABASE_URL` — Postgres connection string for Prisma.
  - When defined, they should be documented in `.env.example` and parsed in `src/env.ts` (e.g., with Zod).

- Next Steps
  - Implement `src/server.ts` to create and start the HTTP server using `app`.
  - Define `src/router.ts` and mount it in `src/app.ts`.
  - Model database in `prisma/schema.prisma`, run migrations, and expose a DB client in `src/config/db.ts`.
  - Implement environment parsing in `src/env.ts` (Zod), and wire `PORT`/`DATABASE_URL`.
  - Add `dev`/`start` scripts (e.g., `ts-node` or build + run) and basic health route.
  - Configure ESLint and Vitest; add first request/response tests with `supertest`.
  - Populate Docker assets and compose file for local Postgres + app.

- License
  - ISC (see `package.json`).
