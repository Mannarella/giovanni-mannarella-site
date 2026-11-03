# Copilot Instructions

## Architecture & data flow
- Static React SPA built with Vite, deployed on Vercel. Source in [client/src](client/src); entry [client/src/main.tsx](client/src/main.tsx); routes in [client/src/App.tsx](client/src/App.tsx) using `wouter`.
- No application server. Content is read at runtime from static JSON files in [client/public](client/public): `bandi.json` (opportunities table on the home page and `/opportunita`), `news.json` (news on the home page and `/archivio-news`), `fondi.json` (fund list on the interprofessional funds page).
- The only server-side code is the Vercel function [api/contact.ts](api/contact.ts), which sends contact-form emails through Resend (`RESEND_API_KEY` env var).
- The LinkedIn posts box on the home page is the SociableKit widget loaded at runtime.

## Developer workflows
- Dev server: `pnpm dev`. Build: `pnpm run build` (Vercel runs `pnpm run build:static`, same command). Output in `dist/public`.
- Typecheck: `pnpm run check`. Tests: `pnpm test` (Vitest). Format: `pnpm run format`.

## Conventions
- Path alias: `@` → `client/src`.
- UI components in [client/src/components/ui](client/src/components/ui) (shadcn/ui); add only the ones actually used.
- Dates in `bandi.json` use the Italian format "gg mmm aaaa" (e.g. "12 gen 2027"); see `parseAperturaDate` in [client/src/pages/Home.tsx](client/src/pages/Home.tsx).
