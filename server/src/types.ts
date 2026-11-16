/**
 * Shared domain types for the Shohojog API.
 */

import type { ObjectId } from "mongodb";

/** An event created by a logged-in user (stored in the `events` collection). */
export interface EventDoc {
  _id?: ObjectId;
  /** Event title, e.g. "Winter Clothes Distribution – Mirpur 10, Dhaka" */
  title: string;
  /** What the event is about, who should join, what volunteers will do. */
  description: string;
  /** One of the predefined event types (Cleanup, Plantation, Donation, …). */
  eventType: string;
  /** Publicly accessible image URL used as the event thumbnail. */
  thumbnailUrl: string;
  /** Human readable location, e.g. "Mohammadpur, Dhaka". */
  location: string;
  /** Event day as an ISO calendar date string ("YYYY-MM-DD"); always today or later. */
  date: string;
  /** BetterAuth user id of the creator. */
  creatorId: string;
  /** Email of the user who created the event — used for ownership checks. */
  creatorEmail: string;
  /** Display name of the creator (denormalized for cards). */
  creatorName: string;
  /** Atomic counter of how many users joined. */
  joinedCount: number;
  createdAt: Date;
  updatedAt?: Date;
}

/** A "user X joined event Y" record (stored in the `event_joins` collection). */
export interface JoinDoc {
  _id?: ObjectId;
  /** Stringified `_id` of the joined event. */
  eventId: string;
  /** Denormalized event snapshot so history stays readable. */
  eventTitle: string;
  eventDate: string;
  /** Email of the logged-in user who joined (from the verified JWT). */
  userEmail: string;
  /** Display name of the user at join time. */
  userName: string;
  joinedAt: Date;
}

/** Verified JWT payload attached to `req.user` by the auth middleware. */
export interface AuthedUser {
  id: string;
  email: string;
  name: string;
  image: string | null;
}

// Let TypeScript know about the `req.user` property set by requireAuth.
declare global {
  namespace Express {
    interface Request {
      user?: AuthedUser;
    }
  }
}
