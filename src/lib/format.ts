/** Small date/name formatting helpers used across pages and cards. */

import { format, parseISO } from "date-fns";

/** "2026-02-14" → "Sat, 14 Feb 2026" */
export function formatEventDate(date: string): string {
  try {
    return format(parseISO(date), "EEE, d MMM yyyy");
  } catch {
    return date;
  }
}

/** "2026-02-14" → "Saturday, 14 February 2026" (details page). */
export function formatEventDateLong(date: string): string {
  try {
    return format(parseISO(date), "EEEE, d MMMM yyyy");
  } catch {
    return date;
  }
}

/** ISO timestamp → "14 Feb 2026" */
export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "d MMM yyyy");
  } catch {
    return iso;
  }
}

/** "Mahedi Hasan" → "MH" (avatar fallback). */
export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
