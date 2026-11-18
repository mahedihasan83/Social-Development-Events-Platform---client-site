<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Shohojog — agent guide

Two independent npm packages (separate lockfiles, install each):

- **Root** — Next.js 16 client (App Router, `src/`). Vercel.
- **`server/`** — Express 5 + MongoDB + BetterAuth API (`server/src/`). Render. ESM (`"type": "module"`), runs via `tsx` directly (no compile step).

## Commands

```bash
# Client (root)
npm run dev      # localhost:3000
npm run build    # production build (also typechecks)
npm run lint     # eslint only

# API (cd server)
npm run dev      # tsx watch, localhost:5000
npm run build    # tsc --noEmit (typecheck only)
```

- No test framework and no CI. Verification = root `npm run lint` + `npm run build`, then `npm run build` in `server/` (all verified passing).
- Manual smoke test: with the API and local Mongo running, `cd server && node _e2e-test.mjs` (register → JWT → create → join, then asserts against the DB).
- The client expects the API on `http://localhost:5000` (default when `NEXT_PUBLIC_API_URL` is unset). Start the API first; auth and all data calls fail without it.
- Commit style: conventional commits scoped by package (`feat(client): …`, `fix(server): …`).

## Local database (gotcha: needs a replica set)

BetterAuth's MongoDB adapter uses transactions, which a standalone `mongod` rejects. Run `cd server && node _dev-mongo.mjs` — it starts a single-node replica set (`rs0`) on port 27017 via `mongodb-memory-server` and must stay running while the API runs. The current `server/.env` points at it (`mongodb://127.0.0.1:27017/?replicaSet=rs0`).

## Environment

- Client: create root `.env` manually with `NEXT_PUBLIC_API_URL` (optional locally). The README's `cp .env.example .env.local` fails — the root `.env.example` no longer exists, and the local file in use is `.env`, not `.env.local`. No secrets here; Mongo/auth secrets belong only in `server/.env`.
- Server (`server/.env`): copy `server/.env.example` (it exists). Vars: `MONGODB_URI` (**required** — `server/src/lib/db.ts` throws at import without it), `MONGODB_DB` (defaults to `shohojog`), `BETTER_AUTH_SECRET`, `SERVER_URL`, `CLIENT_URL`. `GOOGLE_CLIENT_ID`/`GOOGLE_CLIENT_SECRET` are optional — the API boots without them (Google login just isn't registered).

## Auth flow (non-obvious; breaks silently if wrong)

- Client gets a short-lived JWT from BetterAuth's `/token` endpoint (via `jwtClient` in `src/lib/auth-client.ts`), sends `Authorization: Bearer …` (`src/lib/api.ts` caches it ~10 min, refetches on 401).
- Server verifies it against BetterAuth's own JWKS endpoint with `issuer`/`audience` = `SERVER_URL` (`server/src/lib/jwt.ts`). If `SERVER_URL` isn't exactly the server's own URL (e.g. `http://localhost:5000`), JWT verification always fails with 401.
- `server/src/index.ts` mount order matters: BetterAuth handler **before** `express.json()`; `joinsRouter` **before** `eventsRouter` (otherwise `/:id` swallows `/joined` and `/:id/status`). Express 5 path syntax: `/api/auth/{*any}`.
- Production uses cross-domain cookies (Vercel ↔ Render): `SameSite=None; Secure` is set in `server/src/lib/auth.ts` when `NODE_ENV=production`. `CLIENT_URL` must be the real client origin there.

## Data conventions

- Event dates are stored as `YYYY-MM-DD` **strings** (ISO sort order = chronological); only future dates allowed. Don't convert to Date objects.
- `joinedCount` is denormalized on the event doc; duplicate joins are prevented by a unique `(eventId, userEmail)` index created in `ensureIndexes()` (idempotent, runs on boot).
- Mongo `_id` is always serialized to string in API responses (`serializeEvent`).
- Validation rules are duplicated: client uses Zod (`src/lib/validation.ts`), server re-validates by hand (`server/src/routes/events.ts`). Keep both in sync (password ≥6 chars with upper+lower; title 5–120; description 20–2000; `EVENT_TYPES` list).

## Client stack quirks

- `next.config.ts` enables `cacheComponents` and `reactCompiler` — don't add manual `useMemo`/`useCallback`/`memo` around pure components; the compiler handles it. Navbar is streamed inside `<Suspense>` in the root layout so routes prerender.
- Tailwind v4 with **no `tailwind.config`** — theme lives in `src/app/globals.css`, wired through a Turbopack CSS rule in `next.config.ts`.
- shadcn/ui components in `src/components/ui/` (style `base-nova`, per `components.json`); aliases are `@/*` → `src/*`.
- Zod is v4 (`z.email()` / `z.url()`, not `z.string().email()`).
- Toasts use `sonner` — never `alert()`/`confirm()`.
