"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRightIcon, CalendarXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";
import { EventCard, EventCardSkeleton } from "@/components/events/event-card";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";


export function RecentEvents() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    api<{ events: EventItem[] }>("/api/events/recent")
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

  return (
    <section>
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Fresh on the platform"
          title="Recent upcoming events"
          description="The latest social service events created by our community — all happening soon."
        />

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
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                Try again
              </Button>
            </CardContent>
          </Card>
        ) : !events || events.length === 0 ? (
          <Card className="mx-auto max-w-md border-dashed">
            <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
              <CalendarXIcon className="size-10 text-muted-foreground" />
              <p className="font-medium">No upcoming events yet</p>
              <p className="text-sm text-muted-foreground">
                Be the first to organize one for your community!
              </p>
              <Button size="sm" render={<Link href="/create-event" />}>
                Create an Event
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
            <div className="mt-10 text-center">
              <Button variant="outline" render={<Link href="/events" />}>
                View All Events
                <ArrowRightIcon data-icon="inline-end" />
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
