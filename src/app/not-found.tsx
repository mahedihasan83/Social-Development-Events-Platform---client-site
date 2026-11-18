import Link from "next/link";
import { SearchXIcon } from "lucide-react";
import { Button } from "@/components/ui/button";


export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col items-center gap-4 px-4 py-28 text-center sm:px-6">
      <span className="flex size-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
        <SearchXIcon className="size-8" />
      </span>
      <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
      <p className="max-w-md text-muted-foreground">
        The page you are looking for doesn&apos;t exist or may have been moved.
        Let&apos;s get you back to doing good.
      </p>
      <Button render={<Link href="/" />}>Back to Home</Button>
    </div>
  );
}
