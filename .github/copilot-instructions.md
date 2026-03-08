# Copilot Instructions

## Architecture & data flow

- React SPA lives in [client/src](client/src); entry [client/src/main.tsx](client/src/main.tsx) wires `trpc` + React Query and handles unauthenticated redirects; routes are in [client/src/App.tsx](client/src/App.tsx) using `wouter`.
- Express server entry is [server/\_core/index.ts](server/_core/index.ts): mounts tRPC at `/api/trpc`, OAuth callback at `/api/oauth/callback`, and uses Vite middleware in dev via [server/\_core/vite.ts](server/_core/vite.ts). Production serves static assets from `dist/public`.
- API surface is the tRPC `appRouter` in [server/routers.ts](server/routers.ts); use `publicProcedure`, `protectedProcedure`, `adminProcedure` from [server/\_core/trpc.ts](server/_core/trpc.ts). Auth context is built in [server/\_core/context.ts](server/_core/context.ts) and uses the cookie name from [shared/const.ts](shared/const.ts).
- Database access is through Drizzle (`schema` in [drizzle/schema.ts](drizzle/schema.ts), helpers in [server/db.ts](server/db.ts)). Example flow: `news.latest` reads DB and the UI in [client/src/pages/Home.tsx](client/src/pages/Home.tsx) falls back to `client/public/news.json` and `client/public/bandi.json` when the API is unavailable.
- Vite plugin in [vite.config.ts](vite.config.ts) injects a Manus debug collector in dev, writing logs to `.manus-logs/`.

## Developer workflows

- Dev server: `pnpm dev` (tsx watch on [server/\_core/index.ts](server/_core/index.ts) with Vite middleware).
- Build: `pnpm run build` (Vite client + esbuild server bundle to `dist/index.js`).
- Static-only build (Netlify/Vercel): `pnpm run build:static` (see [netlify.toml](netlify.toml) and [vercel.json](vercel.json)).
- Start prod: `pnpm start`.
- DB migrations: `pnpm run db:push` (requires `DATABASE_URL`; see [drizzle.config.ts](drizzle.config.ts)).
- Tests: `pnpm test` (Vitest). Typecheck: `pnpm run check`. Format: `pnpm run format`.

## Project-specific conventions

- Path aliases: `@` → `client/src`, `@shared` → `shared` (see [vite.config.ts](vite.config.ts)).
- Env vars: client uses `VITE_*` (see [client/src/const.ts](client/src/const.ts)); server uses `DATABASE_URL`, `JWT_SECRET`, `OAUTH_SERVER_URL`, `OWNER_OPEN_ID`, `BUILT_IN_FORGE_API_*` (see [server/\_core/env.ts](server/_core/env.ts)).
- When adding endpoints: extend `appRouter` in [server/routers.ts](server/routers.ts) and consume via `trpc` in [client/src/lib/trpc.ts](client/src/lib/trpc.ts); follow the existing auth redirect behavior in `useAuth` and `main.tsx`.
