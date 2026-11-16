"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeftIcon,
  CalendarDaysIcon,
  CalendarXIcon,
  InfoIcon,
  MapPinIcon,
  UserRoundIcon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { JoinButton } from "@/components/events/join-button";
import { formatEventDateLong, initials, formatTimestamp } from "@/lib/format";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

interface EventResponse {
  event: EventItem;
  joinedByMe?: boolean;
}

/** Public event details view — visible without logging in. */
export function EventDetails({ id: eventId }: { id: string }) {
  const [data, setData] = useState<EventResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!eventId) return;
    let cancelled = false;
    api<EventResponse>(`/api/events/${eventId}`)
      .then((result) => {
        if (!cancelled) setData(result);
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
  }, [eventId]);

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <div className="h-7 w-40 animate-pulse rounded bg-muted" />
        <div className="mt-6 grid gap-8 lg:grid-cols-5">
          <div className="aspect-video w-full animate-pulse rounded-2xl bg-muted lg:col-span-3" />
          <div className="h-80 w-full animate-pulse rounded-xl bg-muted lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-24 text-center sm:px-6">
        <CalendarXIcon className="size-12 text-muted-foreground" />
        <h1 className="text-2xl font-bold">Event not found</h1>
        <p className="max-w-md text-muted-foreground">
          {error ?? "This event may have been removed by its organizer."}
        </p>
        <Button render={<Link href="/events" />}>
          <ArrowLeftIcon data-icon="inline-start" />
          Back to Events
        </Button>
      </div>
    );
  }

  const { event } = data;

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <Button variant="ghost" size="sm" className="mb-6 -ml-2" render={<Link href="/events" />}>
        <ArrowLeftIcon data-icon="inline-start" />
        Back to Events
      </Button>

      <div className="grid items-start gap-8 lg:grid-cols-5">
        {/* Left: image + description */}
        <div className="space-y-6 lg:col-span-3">
          <img
            src={event.thumbnailUrl}
            alt={event.title}
            className="aspect-video w-full rounded-2xl object-cover ring-1 ring-foreground/10"
          />

          <div className="space-y-3">
            <Badge>{event.eventType}</Badge>
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {event.title}
            </h1>
            <p className="flex items-center gap-2 text-muted-foreground">
              <MapPinIcon className="size-4 text-primary" />
              {event.location}
            </p>
            <Separator />
            <div>
              <h2 className="mb-2 text-lg font-semibold">About this event</h2>
              <p className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {event.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right: details card + join */}
        <div className="lg:col-span-2">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Event Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="flex items-center gap-2.5 text-sm">
                <CalendarDaysIcon className="size-4 shrink-0 text-primary" />
                <span className="font-medium">{formatEventDateLong(event.date)}</span>
              </p>
              <p className="flex items-center gap-2.5 text-sm">
                <MapPinIcon className="size-4 shrink-0 text-primary" />
                {event.location}
              </p>
              <p className="flex items-center gap-2.5 text-sm">
                <UsersIcon className="size-4 shrink-0 text-primary" />
                {event.joinedCount} {event.joinedCount === 1 ? "volunteer" : "volunteers"}{" "}
                joined so far
              </p>

              <Separator />

              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                    {initials(event.creatorName)}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <p className="flex items-center gap-1.5 text-sm font-medium">
                    <UserRoundIcon className="size-3.5 text-muted-foreground" />
                    {event.creatorName}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    Event organizer
                    {event.createdAt ? ` • posted ${formatTimestamp(event.createdAt)}` : ""}
                  </p>
                </div>
              </div>

              <Separator />

              <JoinButton eventId={event._id} />

              <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
                <InfoIcon className="mt-0.5 size-3.5 shrink-0" />
                Viewing event details is open to everyone — but you need an
                account to join as a volunteer.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
