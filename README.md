# 🤝 Shohojog — Social Development Events Platform

**🔗 Live Site:** https://your-live-url.vercel.app _(update after deployment)_

Shohojog (সহযোগ — "cooperation") is a community-driven event management platform
where anyone can create, join and track social service events in their local
area — winter clothes distributions, neighborhood cleanups, tree plantations,
blood drives and more.

- **Client:** Next.js (App Router) + TypeScript + shadcn/ui + Tailwind CSS — deployed on Vercel
- **Server:** Express.js + TypeScript + MongoDB + BetterAuth (MongoDB adapter) + JWT — deployed on Render

## ✨ Features

- 🔐 **Complete authentication system** — email/password login & registration
  with password policy (≥6 chars, uppercase + lowercase), Google social login,
  session-based profile state and success/error toasts (no default alerts).
- 🙋 **Create, join and manage events** — any logged-in user can create an
  event (title, description, type, thumbnail, location, future date only),
  browse upcoming events, join them with one click, and update/delete only the
  events they created.
- 🧾 **Personal dashboards** — Create Event, Manage Events (edit dialog +
  delete confirmation) and Joined Events (sorted by event date), all protected
  private routes with reload-safe auth (no login redirect on refresh).
- 🛡️ **JWT-protected REST API** — protected endpoints require a Bearer token
  issued by BetterAuth's `/token` endpoint and verified server-side via JWKS;
  creator email is stored with every event and join from the verified JWT.
- 🌗 **Light/dark theme toggle** — full-system theme customization with
  next-themes.
- 🖼️ **Polished public experience** — community-service themed banner,
  features section, recent upcoming events grid (6 latest via MongoDB
  `.limit()`), static photo gallery, newsletter design section, informative
  footer with the new X logo, responsive layout and loading skeletons
  throughout.

## 🗂️ Project structure

```
├── src/            # Next.js client (App Router, TypeScript, shadcn/ui)
│   ├── app/        # Routes: /, /events, /events/[id], /login, /register,
│   │               # /create-event, /manage-events, /joined-events, /profile
│   └── components/ # Layout, home sections, event components, ui (shadcn)
└── server/         # Express API (TypeScript, MongoDB, BetterAuth, JWT)
    └── src/
        ├── lib/    # db (Mongo), auth (BetterAuth), jwt middleware
        └── routes/ # events (CRUD) + joins (join/status/list)
```

## ⚙️ Getting started

### 1. Server (Express API)

```bash
cd server
npm install
cp .env.example .env    # add your MongoDB Atlas URI, secrets, Google creds
npm run dev             # → http://localhost:5000
```

### 2. Client (Next.js)

```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev                  # → http://localhost:3000
```

### 3. Environment variables

**Client (`.env.local`):** `NEXT_PUBLIC_API_URL` — the Express API base URL.

**Server (`.env`):** `MONGODB_URI`, `MONGODB_DB`, `BETTER_AUTH_SECRET`,
`SERVER_URL`, `CLIENT_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`.

## 🚀 Deployment

- **Client → Vercel:** import the repo, set `NEXT_PUBLIC_API_URL` to the Render URL.
- **Server → Render:** start command `npm start`, set all variables from
  `server/.env.example` (`SERVER_URL` = Render URL, `CLIENT_URL` = Vercel URL).
  Deep links and page reloads work everywhere — no route errors on refresh.
