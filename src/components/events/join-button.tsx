"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CircleCheckIcon, LoaderCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession } from "@/lib/auth-client";
import { api } from "@/lib/api";


 
export function JoinButton({ eventId }: { eventId: string }) {
  const router = useRouter();
  const { data: session, isPending: sessionPending } = useSession();
  const [joined, setJoined] = useState(false);
  const [checking, setChecking] = useState(false);
  const [joining, setJoining] = useState(false);


  useEffect(() => {
    if (!session) return;
    let cancelled = false;
    api<{ joined: boolean }>(`/api/events/${eventId}/status`, { auth: true })
      .then((data) => {
        if (!cancelled) setJoined(data.joined);
      })
      .catch(() => undefined)
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session, eventId]);

  function handleClick() {
   
    if (!session) {
      toast.info("Please log in to join this event.");
      router.push(`/login?redirect=${encodeURIComponent(`/events/${eventId}`)}`);
      return;
    }

    setJoining(true);
    api<{ message: string }>(`/api/events/${eventId}/join`, {
      method: "POST",
      auth: true,
    })
      .then((data) => {
        setJoined(true);
        toast.success(data.message ?? "You successfully joined this event! 🎉");
      })
      .catch((error: Error) => {
        if (error instanceof Error && error.message.includes("already joined")) {
          setJoined(true);
        }
        toast.error(error.message);
      })
      .finally(() => setJoining(false));
  }

  if (sessionPending || checking) {
    return (
      <Button size="lg" className="w-full" disabled>
        <LoaderCircleIcon className="size-4 animate-spin" />
        Checking…
      </Button>
    );
  }

  if (joined) {
    return (
      <Button size="lg" variant="secondary" className="w-full" disabled>
        <CircleCheckIcon className="size-4 text-primary" />
        You&apos;ve joined this event
      </Button>
    );
  }

  return (
    <Button size="lg" className="w-full" onClick={handleClick} disabled={joining}>
      {joining && <LoaderCircleIcon className="size-4 animate-spin" />}
      {joining ? "Joining…" : "Join Event"}
    </Button>
  );
}
