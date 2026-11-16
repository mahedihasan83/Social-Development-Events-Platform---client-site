"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CalendarXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeading } from "@/components/shared/page-loader";
import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

/**
 * Public "Upcoming Events" page — shows every future event created by users.
 * Events whose dates have passed never appear here (server filters them).
 */
export default function UpcomingEventsPage() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("All");

  useEffect(() => {
    let cancelled = false;
    api<{ events: EventItem[] }>("/api/events/upcoming")
      .then((data) => {
        if (!cancelled) setEvents(data.events);
      })
      .catch((err: Error) => {
        if (!cancelled) setError(err.message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const availableTypes = useMemo(() => {
    if (!events) return [];
    return Array.from(new Set(events.map((event) => event.eventType))).sort();
  }, [events]);

  const visible = useMemo(() => {
    if (!events) return [];
    return typeFilter === "All"
      ? events
      : events.filter((event) => event.eventType === typeFilter);
  }, [events, typeFilter]);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <PageHeading
        title="Upcoming Events"
        description="Browse social service events happening soon and volunteer for the causes you care about."
      />

      {/* Type filter chips */}
      {!loading && !error && events && events.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          {["All", ...availableTypes].map((type) => (
            <Button
              key={type}
              size="sm"
              variant={typeFilter === type ? "default" : "outline"}
              onClick={() => setTypeFilter(type)}
            >
              {type}
            </Button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <Card className="mx-auto max-w-md">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <CalendarXIcon className="size-10 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{error}</p>
          </CardContent>
        </Card>
      ) : visible.length === 0 ? (
        <Card className="mx-auto max-w-md border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarXIcon className="size-10 text-muted-foreground" />
            <p className="font-medium">
              {typeFilter === "All"
                ? "No upcoming events right now"
                : `No upcoming ${typeFilter} events`}
            </p>
            <p className="text-sm text-muted-foreground">
              Check back soon — or be the one to organize it!
            </p>
            <Button size="sm" render={<Link href="/create-event" />}>
              Create an Event
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
