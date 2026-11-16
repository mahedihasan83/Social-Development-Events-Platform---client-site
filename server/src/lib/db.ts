/**
 * MongoDB connection layer.
 *
 * A single `MongoClient` is shared by both BetterAuth (via the MongoDB
 * adapter) and the events/joins routes, so we pay the connection cost once.
 */

import { MongoClient, type Db } from "mongodb";
import type { EventDoc, JoinDoc } from "../types";

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error(
    "MONGODB_URI is not set. Copy server/.env.example to server/.env and add your MongoDB Atlas connection string."
  );
}

export const client = new MongoClient(uri);

export const db: Db = client.db(process.env.MONGODB_DB || "shohojog");

/** All social service events created by users. */
export const eventsCollection = db.collection<EventDoc>("events");

/** Join records: which logged-in user joined which event. */
export const joinsCollection = db.collection<JoinDoc>("event_joins");

let indexesPromise: Promise<void> | null = null;

/**
 * Create the indexes the API relies on. Safe to call on every boot —
 * index creation is idempotent, and we only run it once per process.
 */
export function ensureIndexes(): Promise<void> {
  if (!indexesPromise) {
    indexesPromise = (async () => {
      await eventsCollection.createIndex({ date: 1 });
      await eventsCollection.createIndex({ creatorEmail: 1 });
      await eventsCollection.createIndex({ createdAt: -1 });
      // One join per user per event — the unique index prevents duplicates.
      await joinsCollection.createIndex(
        { eventId: 1, userEmail: 1 },
        { unique: true }
      );
      await joinsCollection.createIndex({ userEmail: 1 });
    })().catch((error) => {
      indexesPromise = null; // allow a retry on the next request
      throw error;
    });
  }
  return indexesPromise;
}
