/**
 * Shohojog API — Express + MongoDB + BetterAuth.
 *
 * Social development events platform backend:
 *  - BetterAuth (email/password + Google) mounted at /api/auth/*
 *  - JWT-protected events & joins REST endpoints
 */

import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth";
import { ensureIndexes } from "./lib/db";
import { eventsRouter } from "./routes/events";
import { joinsRouter } from "./routes/joins";

const app = express();

const PORT = Number(process.env.PORT ?? 5000);
const CLIENT_URL = process.env.CLIENT_URL ?? "http://localhost:3000";

// CORS first (covers the auth handler's preflight requests too).
app.use(
  cors({
    origin: [CLIENT_URL, "http://localhost:3000"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true, // session cookies travel with the request
  })
);

// BetterAuth handler BEFORE any body-parsing middleware (per the docs).
app.all("/api/auth/{*any}", toNodeHandler(auth));

app.use(express.json());

// Health check for uptime monitors and the examiner. 🙂
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "shohojog-api", time: new Date().toISOString() });
});

// Joins router first so /joined and /:id/status are not captured by /:id.
app.use("/api/events", joinsRouter);
app.use("/api/events", eventsRouter);

// 404 for unknown API routes (JSON, not HTML).
app.use((_req, res) => {
  res.status(404).json({ error: "Route not found." });
});

// Central error handler — always respond with JSON.
app.use(
  (error: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error("[shohojog-api] Unhandled error:", error);
    res.status(500).json({ error: "Something went wrong on our side. Please try again." });
  }
);

app.listen(PORT, () => {
  console.log(`🤝 Shohojog API listening on http://localhost:${PORT}`);
  ensureIndexes()
    .then(() => console.log("🗂  Database indexes are ready"))
    .catch((error) => console.error("Failed to create indexes:", error));
});
