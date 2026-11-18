import { Suspense } from "react";
import { EventDetails } from "@/components/events/event-details";


export default function EventDetailsPage({
  params,
}: PageProps<"/events/[id]">) {
  return (
    <Suspense fallback={<EventDetailsSkeleton />}>
      <EventDetailsView params={params} />
    </Suspense>
  );
}

async function EventDetailsView({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <EventDetails id={id} />;
}

function EventDetailsSkeleton() {
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
