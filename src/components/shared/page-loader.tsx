"use client";

import { LoaderCircleIcon } from "lucide-react";

/** Full-area loading state used while auth/data resolves (skeleton-style). */
export function PageLoader({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 text-muted-foreground">
      <LoaderCircleIcon className="size-7 animate-spin text-primary" />
      <p className="text-sm">{label}</p>
    </div>
  );
}

/** Standard page title block used by every private page. */
export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-xl text-muted-foreground">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}
