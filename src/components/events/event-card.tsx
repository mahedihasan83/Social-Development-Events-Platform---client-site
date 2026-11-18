"use client";

import Link from "next/link";
import { CalendarDaysIcon, MapPinIcon, UsersIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatEventDate } from "@/lib/format";
import type { EventItem } from "@/lib/types";

export function EventCard({ event, subtitle }: { event: EventItem; subtitle?: string }) {
  return (
    <Card className="group h-full">
      <Link href={`/events/${event._id}`} className="relative block overflow-hidden">
        <img
          src={event.thumbnailUrl}
          alt={event.title}
          loading="lazy"
          className="aspect-video w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Badge className="absolute top-3 left-3 shadow-sm">{event.eventType}</Badge>
      </Link>

      <CardHeader>
        <CardTitle className="line-clamp-2 text-base font-semibold group-hover:text-primary">
          <Link href={`/events/${event._id}`}>{event.title}</Link>
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 space-y-2 text-sm text-muted-foreground">
        <p className="flex items-center gap-2">
          <MapPinIcon className="size-4 shrink-0 text-primary" />
          <span className="truncate">{event.location}</span>
        </p>
        <p className="flex items-center gap-2">
          <CalendarDaysIcon className="size-4 shrink-0 text-primary" />
          {formatEventDate(event.date)}
        </p>
        <p className="flex items-center gap-2">
          <UsersIcon className="size-4 shrink-0 text-primary" />
          {event.joinedCount} {event.joinedCount === 1 ? "volunteer" : "volunteers"} joined
        </p>
        {subtitle && (
          <p className="text-xs font-medium text-primary">
            {subtitle}
          </p>
        )}
      </CardContent>

      <CardFooter>
        <Button variant="outline" size="sm" className="w-full" render={<Link href={`/events/${event._id}`} />}>
          View Event
        </Button>
      </CardFooter>
    </Card>
  );
}


export function EventCardSkeleton() {
  return (
    <Card className="h-full">
      <div className="aspect-video w-full animate-pulse bg-muted" />
      <CardHeader>
        <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5">
        <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-1/2 animate-pulse rounded bg-muted" />
        <div className="h-3.5 w-1/3 animate-pulse rounded bg-muted" />
      </CardContent>
      <CardFooter>
        <div className="h-7 w-full animate-pulse rounded bg-muted" />
      </CardFooter>
    </Card>
  );
}
