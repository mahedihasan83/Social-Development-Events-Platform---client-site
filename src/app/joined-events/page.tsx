"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CalendarCheckIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AuthGuard } from "@/components/shared/auth-guard";
import { PageHeading, PageLoader } from "@/components/shared/page-loader";
import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { formatTimestamp } from "@/lib/format";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";


function JoinedEventsContent() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ events: EventItem[] }>("/api/events/joined", { auth: true })
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

  if (loading && !events) {
    return <PageLoader label="Loading your joined events…" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <PageHeading
        title="Joined Events"
        description="Every event you signed up to volunteer for, sorted by event date."
      />

      {error ? (
        <Card className="mx-auto max-w-md">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      ) : events && events.length === 0 ? (
        <Card className="mx-auto max-w-md border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <CalendarCheckIcon className="size-10 text-muted-foreground" />
            <p className="font-medium">You haven&apos;t joined any events yet</p>
            <p className="text-sm text-muted-foreground">
              Find a community service event near you and make a difference.
            </p>
            <Button size="sm" render={<Link href="/events" />}>
              Browse Upcoming Events
            </Button>
          </CardContent>
        </Card>
      ) : events ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event._id}
              event={event}
              subtitle={event.joinedAt ? `Joined on ${formatTimestamp(event.joinedAt)}` : undefined}
            />
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <EventCardSkeleton key={index} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function JoinedEventsPage() {
  return (
    <AuthGuard>
      <JoinedEventsContent />
    </AuthGuard>
  );
}
