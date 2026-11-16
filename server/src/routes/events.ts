/**
 * Events REST API.
 *
 * Public:   GET /api/events/upcoming, /recent, /:id
 * Protected (JWT required): POST /api/events, GET /my-events, PUT /:id, DELETE /:id
 *
 * Mutating routes are protected with the JWT middleware; update/delete are
 * additionally restricted to the creator of the event.
 */

import { Router } from "express";
import { ObjectId } from "mongodb";
import { eventsCollection, joinsCollection } from "../lib/db";
import { requireAuth, optionalAuth } from "../lib/jwt";
import { firstParam } from "../lib/params";
import type { EventDoc } from "../types";

export const eventsRouter = Router();

export const EVENT_TYPES = [
  "Cleanup",
  "Plantation",
  "Donation",
  "Blood Drive",
  "Food Distribution",
  "Winter Clothes",
  "Education",
  "Health Camp",
  "Awareness Campaign",
  "Other",
] as const;

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const URL_RE = /^https?:\/\/\S+$/;

/** Today as an ISO calendar date (YYYY-MM-DD). String comparison works for ISO dates. */
export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function serializeEvent(doc: EventDoc) {
  return {
    _id: String(doc._id),
    title: doc.title,
    description: doc.description,
    eventType: doc.eventType,
    thumbnailUrl: doc.thumbnailUrl,
    location: doc.location,
    date: doc.date,
    creatorId: doc.creatorId,
    creatorEmail: doc.creatorEmail,
    creatorName: doc.creatorName,
    joinedCount: doc.joinedCount ?? 0,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt.toISOString() : null,
  };
}

/** Validate the request body of create/update. Returns errors or trimmed values. */
function validateEventBody(body: Record<string, unknown>) {
  const errors: string[] = [];
  const value = {
    title: String(body.title ?? "").trim(),
    description: String(body.description ?? "").trim(),
    eventType: String(body.eventType ?? "").trim(),
    thumbnailUrl: String(body.thumbnailUrl ?? "").trim(),
    location: String(body.location ?? "").trim(),
    date: String(body.date ?? "").trim(),
  };

  if (value.title.length < 5 || value.title.length > 120) {
    errors.push("Title must be between 5 and 120 characters.");
  }
  if (value.description.length < 20 || value.description.length > 2000) {
    errors.push("Description must be between 20 and 2000 characters.");
  }
  if (!EVENT_TYPES.includes(value.eventType as (typeof EVENT_TYPES)[number])) {
    errors.push("Please choose a valid event type.");
  }
  if (!URL_RE.test(value.thumbnailUrl)) {
    errors.push("Thumbnail image URL must be a valid http(s) URL.");
  }
  if (value.location.length < 3 || value.location.length > 120) {
    errors.push("Location must be between 3 and 120 characters.");
  }
  if (!DATE_RE.test(value.date)) {
    errors.push("Event date is required (YYYY-MM-DD).");
  } else if (value.date < todayISO()) {
    // Assignment rule: past dates can never be saved.
    errors.push("Event date must be today or in the future.");
  }

  return { errors, value };
}

/* ── Public endpoints ──────────────────────────────────────────────────── */

/** All upcoming events (today or later), soonest first. */
eventsRouter.get("/upcoming", async (_req, res) => {
  const docs = await eventsCollection
    .find({ date: { $gte: todayISO() } })
    .sort({ date: 1, createdAt: 1 })
    .limit(200)
    .toArray();
  res.json({ events: docs.map(serializeEvent) });
});

/**
 * Recently added upcoming events for the home page — uses MongoDB's
 * `.limit()` operator as required (6 by default).
 */
eventsRouter.get("/recent", async (req, res) => {
  const limitParam = Number.parseInt(String(req.query.limit ?? "6"), 10);
  const limit = Number.isFinite(limitParam)
    ? Math.min(Math.max(limitParam, 1), 12)
    : 6;

  const docs = await eventsCollection
    .find({ date: { $gte: todayISO() } })
    .sort({ createdAt: -1 })
    .limit(limit)
    .toArray();
  res.json({ events: docs.map(serializeEvent) });
});

/* ── Protected endpoints ───────────────────────────────────────────────── */

/** All events created by the logged-in user. */
eventsRouter.get("/my-events", requireAuth, async (req, res) => {
  const docs = await eventsCollection
    .find({ creatorEmail: req.user!.email })
    .sort({ date: 1, createdAt: 1 })
    .toArray();
  res.json({ events: docs.map(serializeEvent) });
});

/** Create an event. The creator's identity comes from the verified JWT. */
eventsRouter.post("/", requireAuth, async (req, res) => {
  const { errors, value } = validateEventBody(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  const doc: EventDoc = {
    ...value,
    creatorId: req.user!.id,
    creatorEmail: req.user!.email,
    creatorName: req.user!.name,
    joinedCount: 0,
    createdAt: new Date(),
  };

  const result = await eventsCollection.insertOne(doc);
  const saved = await eventsCollection.findOne({ _id: result.insertedId });
  return res
    .status(201)
    .json({ message: "Event created successfully!", event: serializeEvent(saved!) });
});

/** Event details. Public, but includes `joinedByMe` for logged-in viewers. */
eventsRouter.get("/:id", optionalAuth, async (req, res) => {
  const id = firstParam(req.params.id);
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event id." });
  }

  const doc = await eventsCollection.findOne({ _id: new ObjectId(id) });
  if (!doc) {
    return res.status(404).json({ error: "Event not found." });
  }

  let joinedByMe = false;
  if (req.user) {
    const join = await joinsCollection.findOne({
      eventId: String(doc._id),
      userEmail: req.user.email,
    });
    joinedByMe = Boolean(join);
  }

  res.json({ event: serializeEvent(doc), joinedByMe });
});

/** Update an event — only its creator may do that. */
eventsRouter.put("/:id", requireAuth, async (req, res) => {
  const id = firstParam(req.params.id);
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event id." });
  }

  const existing = await eventsCollection.findOne({ _id: new ObjectId(id) });
  if (!existing) {
    return res.status(404).json({ error: "Event not found." });
  }
  if (existing.creatorEmail !== req.user!.email) {
    return res.status(403).json({
      error: "You can only update events you have created.",
    });
  }

  const { errors, value } = validateEventBody(req.body ?? {});
  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(" ") });
  }

  await eventsCollection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...value, updatedAt: new Date() } }
  );

  const updated = await eventsCollection.findOne({ _id: new ObjectId(id) });
  res.json({
    message: "Event updated successfully!",
    event: serializeEvent(updated!),
  });
});

/** Delete an event — only its creator may do that. Joins are cleaned up too. */
eventsRouter.delete("/:id", requireAuth, async (req, res) => {
  const id = firstParam(req.params.id);
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event id." });
  }

  const existing = await eventsCollection.findOne({ _id: new ObjectId(id) });
  if (!existing) {
    return res.status(404).json({ error: "Event not found." });
  }
  if (existing.creatorEmail !== req.user!.email) {
    return res.status(403).json({
      error: "You can only delete events you have created.",
    });
  }

  await eventsCollection.deleteOne({ _id: new ObjectId(id) });
  await joinsCollection.deleteMany({ eventId: String(existing._id) });

  res.json({ message: "Event deleted successfully." });
});

