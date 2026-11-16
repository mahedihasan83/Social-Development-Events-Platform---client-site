/**
 * Event-join REST API.
 *
 * Protected (JWT required):
 *   POST /api/events/:id/join   — join an event
 *   GET  /api/events/joined     — all events the logged-in user joined, sorted by event date
 *   GET  /api/events/:id/status — has the logged-in user joined this event?
 */

import { Router } from "express";
import { ObjectId } from "mongodb";
import { eventsCollection, joinsCollection, ensureIndexes } from "../lib/db";
import { requireAuth } from "../lib/jwt";
import { firstParam } from "../lib/params";
import { todayISO } from "./events";
import type { EventDoc, JoinDoc } from "../types";

export const joinsRouter = Router();

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

/** Join an event as the logged-in user (identified by the verified JWT). */
joinsRouter.post("/:id/join", requireAuth, async (req, res) => {
  const id = firstParam(req.params.id);
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event id." });
  }

  const event = await eventsCollection.findOne({ _id: new ObjectId(id) });
  if (!event) {
    return res.status(404).json({ error: "Event not found." });
  }
  if (event.date < todayISO()) {
    return res
      .status(400)
      .json({ error: "This event has already taken place and can no longer be joined." });
  }

  const existing = await joinsCollection.findOne({
    eventId: String(event._id),
    userEmail: req.user!.email,
  });
  if (existing) {
    return res
      .status(409)
      .json({ error: "You have already joined this event." });
  }

  const join: JoinDoc = {
    eventId: String(event._id),
    eventTitle: event.title,
    eventDate: event.date,
    userEmail: req.user!.email,
    userName: req.user!.name,
    joinedAt: new Date(),
  };

  await ensureIndexes();
  await joinsCollection.insertOne(join);
  await eventsCollection.updateOne(
    { _id: event._id },
    { $inc: { joinedCount: 1 } }
  );

  res.status(201).json({ message: "You successfully joined this event! 🎉" });
});

/**
 * All events joined by the logged-in user, sorted by event date as required.
 * Falls back to the denormalized snapshot when an event was deleted.
 */
joinsRouter.get("/joined", requireAuth, async (req, res) => {
  const joins = await joinsCollection
    .find({ userEmail: req.user!.email })
    .sort({ joinedAt: -1 })
    .toArray();

  const eventIds = joins
    .filter((j) => ObjectId.isValid(j.eventId))
    .map((j) => new ObjectId(j.eventId));

  const events = await eventsCollection
    .find({ _id: { $in: eventIds } })
    .toArray();
  const byId = new Map(events.map((e) => [String(e._id), e]));

  const joinedEvents = joins
    .map((j) => {
      const event = byId.get(j.eventId);
      if (!event) return null;
      return {
        ...serializeEvent(event),
        joinedAt: j.joinedAt.toISOString(),
      };
    })
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .sort((a, b) => a.date.localeCompare(b.date)); // soonest event first

  res.json({ events: joinedEvents });
});

/** Lightweight status check used by the Join button on the details page. */
joinsRouter.get("/:id/status", requireAuth, async (req, res) => {
  const id = firstParam(req.params.id);
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid event id." });
  }
  const join = await joinsCollection.findOne({
    eventId: id,
    userEmail: req.user!.email,
  });
  res.json({ joined: Boolean(join) });
});

