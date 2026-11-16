/** Shared client-side types mirroring the API responses. */

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

export type EventType = (typeof EVENT_TYPES)[number];

/** Event as returned by the API (JSON-serialized). */
export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  /** ISO calendar date string (YYYY-MM-DD) — always today or later. */
  date: string;
  creatorId: string;
  creatorEmail: string;
  creatorName: string;
  joinedCount: number;
  createdAt: string | null;
  /** Present on the Joined Events page only. */
  joinedAt?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}
