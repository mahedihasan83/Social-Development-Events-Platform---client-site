# Shohojog API (Server)

REST API for the **Shohojog — Social Development Events Platform**. Built with
**Express 5, TypeScript, MongoDB and BetterAuth (MongoDB adapter + JWT)**.

## Endpoints

| Method | Route                       | Auth | Description                                            |
| ------ | --------------------------- | ---- | ------------------------------------------------------ |
| GET    | `/api/health`               | –    | Health check                                           |
| *      | `/api/auth/*`               | –    | BetterAuth (register, login, Google, JWT `/token`, JWKS) |
| GET    | `/api/events/upcoming`      | –    | All upcoming events (no past dates)                    |
| GET    | `/api/events/recent?limit=` | –    | Recent upcoming events, `.limit()` (default 6)         |
| GET    | `/api/events/:id`           | optional | Event details + `joinedByMe` for logged-in viewers |
| POST   | `/api/events`               | JWT  | Create event (stores creator email from the JWT)       |
| GET    | `/api/events/my-events`     | JWT  | Events created by the logged-in user                   |
| PUT    | `/api/events/:id`           | JWT  | Update event (creator only)                            |
| DELETE | `/api/events/:id`           | JWT  | Delete event (creator only)                            |
| POST   | `/api/events/:id/join`      | JWT  | Join an event (no duplicates)                          |
| GET    | `/api/events/joined`        | JWT  | Events joined by the user, sorted by event date        |
| GET    | `/api/events/:id/status`    | JWT  | Has the current user joined?                           |

## Getting started

```bash
cd server
npm install
cp .env.example .env   # then fill in your MongoDB URI + secret
npm run dev            # http://localhost:5000
```

## Deployment (Render)

- **Build command:** `npm install`
- **Start command:** `npm start`
- **Environment variables:** everything from `.env.example`
  (`SERVER_URL` = your Render URL, `CLIENT_URL` = your Vercel URL).
