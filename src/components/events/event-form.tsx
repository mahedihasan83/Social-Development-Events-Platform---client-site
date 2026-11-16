"use client";

import { useState } from "react";
import { LoaderCircleIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { api } from "@/lib/api";
import {
  eventFormSchema,
  issuesToFieldErrors,
  todayISO,
} from "@/lib/validation";
import { EVENT_TYPES, type EventItem } from "@/lib/types";

type FormState = {
  title: string;
  description: string;
  eventType: string;
  thumbnailUrl: string;
  location: string;
  date: string;
};

const EMPTY: FormState = {
  title: "",
  description: "",
  eventType: "",
  thumbnailUrl: "",
  location: "",
  date: "",
};

interface EventFormProps {
  mode: "create" | "update";
  eventId?: string;
  initialValues?: Partial<FormState>;
  /** Called after a successful create/update (e.g. to redirect or close a dialog). */
  onSuccess?: (event: EventItem) => void;
}

/**
 * Shared create/update event form with full validation:
 * required fields, valid thumbnail URL and no past dates.
 */
export function EventForm({ mode, eventId, initialValues, onSuccess }: EventFormProps) {
  const [form, setForm] = useState<FormState>({ ...EMPTY, ...initialValues });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(field: K, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});

    const parsed = eventFormSchema.safeParse(form);
    if (!parsed.success) {
      const fieldErrors = issuesToFieldErrors(parsed.error);
      setErrors(fieldErrors);
      toast.error(Object.values(fieldErrors)[0] ?? "Please check the form.");
      return;
    }

    setSubmitting(true);
    try {
      const result =
        mode === "create"
          ? await api<{ message: string; event: EventItem }>("/api/events", {
              method: "POST",
              body: parsed.data,
              auth: true,
            })
          : await api<{ message: string; event: EventItem }>(
              `/api/events/${eventId}`,
              { method: "PUT", body: parsed.data, auth: true }
            );

      toast.success(
        mode === "create"
          ? "Event created successfully! 🎉"
          : "Event updated successfully! ✅"
      );
      onSuccess?.(result.event);
      if (mode === "create") setForm(EMPTY);
    } catch (error) {
      toast.error((error as Error).message);
    } finally {
      setSubmitting(false);
    }
  }

  const renderError = (field: keyof FormState) =>
    errors[field] ? <p className="text-xs text-destructive">{errors[field]}</p> : null;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="space-y-1.5">
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          placeholder="e.g. Winter Clothes Distribution – Mirpur 10, Dhaka"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          aria-invalid={Boolean(errors.title)}
        />
        {renderError("title")}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          rows={5}
          placeholder="What will volunteers do? Who is this event for? What should they bring?"
          value={form.description}
          onChange={(e) => update("description", e.target.value)}
          aria-invalid={Boolean(errors.description)}
        />
        {renderError("description")}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="eventType">Event Type</Label>
          <NativeSelect
            id="eventType"
            className="w-full"
            value={form.eventType}
            onChange={(e) => update("eventType", e.target.value)}
            aria-invalid={Boolean(errors.eventType)}
          >
            <NativeSelectOption value="" disabled>
              Select an event type
            </NativeSelectOption>
            {EVENT_TYPES.map((type) => (
              <NativeSelectOption key={type} value={type}>
                {type}
              </NativeSelectOption>
            ))}
          </NativeSelect>
          {renderError("eventType")}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="date">Event Date</Label>
          <Input
            id="date"
            type="date"
            min={todayISO()}
            value={form.date}
            onChange={(e) => update("date", e.target.value)}
            aria-invalid={Boolean(errors.date)}
          />
          {renderError("date")}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="thumbnailUrl">Thumbnail Image URL</Label>
        <Input
          id="thumbnailUrl"
          type="url"
          placeholder="https://images.example.com/my-event.jpg"
          value={form.thumbnailUrl}
          onChange={(e) => update("thumbnailUrl", e.target.value)}
          aria-invalid={Boolean(errors.thumbnailUrl)}
        />
        {renderError("thumbnailUrl")}
        {form.thumbnailUrl && !errors.thumbnailUrl && (
          <img
            src={form.thumbnailUrl}
            alt="Thumbnail preview"
            className="mt-1 aspect-video w-full rounded-lg object-cover ring-1 ring-foreground/10"
          />
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          placeholder="e.g. Mohammadpur, Dhaka"
          value={form.location}
          onChange={(e) => update("location", e.target.value)}
          aria-invalid={Boolean(errors.location)}
        />
        {renderError("location")}
      </div>

      <Button type="submit" size="lg" className="w-full" disabled={submitting}>
        {submitting && <LoaderCircleIcon className="size-4 animate-spin" />}
        {submitting
          ? mode === "create"
            ? "Creating…"
            : "Saving…"
          : mode === "create"
            ? "Create Event"
            : "Save Changes"}
      </Button>
    </form>
  );
}
