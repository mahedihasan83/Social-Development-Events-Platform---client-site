"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AuthGuard } from "@/components/shared/auth-guard";
import { PageHeading } from "@/components/shared/page-loader";
import { EventForm } from "@/components/events/event-form";
import type { EventItem } from "@/lib/types";

/** Private page — any logged-in user can create an event. */
function CreateEventContent() {
  const router = useRouter();

  function handleCreated(_event: EventItem) {
    // Requirement: redirect to the Upcoming Events page after success.
    router.push("/events");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 md:py-14">
      <PageHeading
        title="Create a New Event"
        description="Organize a social service event in your area. Fill in the details below — the event date must be today or in the future."
      />
      <div className="rounded-xl border bg-card p-5 sm:p-8">
        <EventForm mode="create" onSuccess={handleCreated} />
      </div>
    </div>
  );
}

export default function CreateEventPage() {
  return (
    <AuthGuard>
      <CreateEventContent />
    </AuthGuard>
  );
}
