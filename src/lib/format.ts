

import { format, parseISO } from "date-fns";

export function formatEventDate(date: string): string {
  try {
    return format(parseISO(date), "EEE, d MMM yyyy");
  } catch {
    return date;
  }
}


export function formatEventDateLong(date: string): string {
  try {
    return format(parseISO(date), "EEEE, d MMMM yyyy");
  } catch {
    return date;
  }
}


export function formatTimestamp(iso: string | null | undefined): string {
  if (!iso) return "";
  try {
    return format(parseISO(iso), "d MMM yyyy");
  } catch {
    return iso;
  }
}


export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]!.toUpperCase())
    .join("");
}
