

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


export interface EventItem {
  _id: string;
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;

  date: string;
  creatorId: string;
  creatorEmail: string;
  creatorName: string;
  joinedCount: number;
  createdAt: string | null;

  joinedAt?: string;
}

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
}
