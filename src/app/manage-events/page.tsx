"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDaysIcon,
  FolderOpenIcon,
  MapPinIcon,
  PenIcon,
  PlusIcon,
  Trash2Icon,
  UsersIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { AuthGuard } from "@/components/shared/auth-guard";
import { PageHeading, PageLoader } from "@/components/shared/page-loader";
import { EventForm } from "@/components/events/event-form";
import { formatEventDate } from "@/lib/format";
import { api } from "@/lib/api";
import type { EventItem } from "@/lib/types";

/** Private page: manage (update/delete) only the events you created. */
function ManageEventsContent() {
  const [events, setEvents] = useState<EventItem[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [editing, setEditing] = useState<EventItem | null>(null);
  const [deleting, setDeleting] = useState<EventItem | null>(null);
  const [deletingBusy, setDeletingBusy] = useState(false);

  const fetchEvents = useCallback(
    () => api<{ events: EventItem[] }>("/api/events/my-events", { auth: true }),
    []
  );

  // Initial load — state updates happen inside async callbacks only.
  useEffect(() => {
    let cancelled = false;
    fetchEvents()
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
  }, [fetchEvents]);

  /** Refresh after mutations (called from event handlers, not effects). */
  async function refresh() {
    try {
      const data = await fetchEvents();
      setEvents(data.events);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  async function handleDelete() {
    if (!deleting) return;
    setDeletingBusy(true);
    try {
      await api(`/api/events/${deleting._id}`, {
        method: "DELETE",
        auth: true,
      });
      toast.success("Event deleted successfully. 🗑️");
      setDeleting(null);
      refresh();
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setDeletingBusy(false);
    }
  }

  if (loading && !events) {
    return <PageLoader label="Loading your events…" />;
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 md:py-14">
      <PageHeading
        title="Manage Events"
        description="All events you have created. You can update their details or delete them — only you can."
      >
        <Button render={<Link href="/create-event" />}>
          <PlusIcon data-icon="inline-start" />
          Create Event
        </Button>
      </PageHeading>

      {error && (
        <Card className="mx-auto max-w-md">
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            {error}
          </CardContent>
        </Card>
      )}

      {!error && events && events.length === 0 && (
        <Card className="mx-auto max-w-md border-dashed">
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <FolderOpenIcon className="size-10 text-muted-foreground" />
            <p className="font-medium">You haven&apos;t created any events yet</p>
            <p className="text-sm text-muted-foreground">
              Organize your first community service event — it only takes a minute.
            </p>
            <Button size="sm" render={<Link href="/create-event" />}>
              Create an Event
            </Button>
          </CardContent>
        </Card>
      )}

      {!error && events && events.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <Card key={event._id} className="group h-full">
              <div className="relative overflow-hidden">
                <img
                  src={event.thumbnailUrl}
                  alt={event.title}
                  loading="lazy"
                  className="aspect-video w-full object-cover"
                />
                <Badge className="absolute top-3 left-3 shadow-sm">{event.eventType}</Badge>
              </div>
              <CardContent className="flex flex-1 flex-col gap-3 pt-4">
                <h3 className="line-clamp-2 font-semibold">{event.title}</h3>
                <div className="flex-1 space-y-1.5 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2">
                    <CalendarDaysIcon className="size-4 shrink-0 text-primary" />
                    {formatEventDate(event.date)}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPinIcon className="size-4 shrink-0 text-primary" />
                    <span className="truncate">{event.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <UsersIcon className="size-4 shrink-0 text-primary" />
                    {event.joinedCount} joined
                  </p>
                </div>
                <div className="flex gap-2 border-t pt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => setEditing(event)}
                  >
                    <PenIcon data-icon="inline-start" />
                    Update
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex-1"
                    onClick={() => setDeleting(event)}
                  >
                    <Trash2Icon data-icon="inline-start" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Update dialog */}
      <Dialog open={Boolean(editing)} onOpenChange={(open) => !open && setEditing(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Update Event</DialogTitle>
            <DialogDescription>
              Edit the details of your event. Volunteers will see the changes immediately.
            </DialogDescription>
          </DialogHeader>
          {editing && (
            <EventForm
              mode="update"
              eventId={editing._id}
              initialValues={{
                title: editing.title,
                description: editing.description,
                eventType: editing.eventType,
                thumbnailUrl: editing.thumbnailUrl,
                location: editing.location,
                date: editing.date,
              }}
              onSuccess={() => {
                setEditing(null);
                refresh();
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <AlertDialog
        open={Boolean(deleting)}
        onOpenChange={(open) => !open && setDeleting(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deleting?.title}&rdquo; will be permanently removed, along
              with its {deleting?.joinedCount ?? 0} join record(s). This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deletingBusy}
            >
              {deletingBusy ? "Deleting…" : "Delete Event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default function ManageEventsPage() {
  return (
    <AuthGuard>
      <ManageEventsContent />
    </AuthGuard>
  );
}
