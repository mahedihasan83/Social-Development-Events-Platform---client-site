import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon, PlusIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const STATS = [
  { value: "1,200+", label: "Events Organized" },
  { value: "5,000+", label: "Active Volunteers" },
  { value: "40+", label: "Communities Reached" },
];


export function Hero() {
  return (
    <section className="relative overflow-hidden">
  
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(45rem_20rem_at_80%_-10%,--alpha(var(--color-primary)/12%),transparent)]"
      />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 md:py-24 lg:grid-cols-2">
       
        <div className="flex flex-col items-start gap-6">
          <Badge variant="secondary" className="h-7 gap-1.5 px-3 text-primary">
            <SparklesIcon className="size-3.5" />
            Community • Service • Impact
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Create change, right in your{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              community
            </span>
          </h1>

          <p className="max-w-xl text-lg leading-relaxed text-muted-foreground">
            Shohojog connects volunteers with the social development events
            happening around them — winter clothes distributions, cleanups,
            tree plantations, blood drives and more. Organize an event or join
            one near you, and turn good intentions into real impact.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Button size="lg" render={<Link href="/events" />}>
              Explore Events
              <ArrowRightIcon data-icon="inline-end" />
            </Button>
            <Button size="lg" variant="outline" render={<Link href="/create-event" />}>
              <PlusIcon />
              Create an Event
            </Button>
          </div>

          {/* Social proof stats */}
          <div className="mt-2 grid w-full max-w-md grid-cols-3 gap-6 border-t pt-6">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Visual */}
        <div className="relative mx-auto w-full max-w-xl">
          <div
            aria-hidden
            className="absolute -top-8 -right-8 size-40 rounded-full bg-emerald-500/20 blur-3xl"
          />
          <div
            aria-hidden
            className="absolute -bottom-10 -left-10 size-48 rounded-full bg-teal-500/20 blur-3xl"
          />

          <img
            src="https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=1000&q=80"
            alt="Volunteers working together at a community service event"
            className="relative aspect-[4/3] w-full rounded-3xl object-cover ring-1 ring-foreground/10"
            loading="eager"
          />

       
          <div className="absolute -bottom-6 left-4 hidden items-center gap-3 rounded-xl bg-card p-4 shadow-lg ring-1 ring-foreground/10 sm:flex">
            <span className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <CalendarDaysIcon className="size-5" />
            </span>
            <div>
              <p className="text-sm font-semibold">Winter Clothes Distribution</p>
              <p className="text-xs text-muted-foreground">Mirpur 10, Dhaka • This winter</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
