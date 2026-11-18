import {
  CalendarPlusIcon,
  LayoutDashboardIcon,
  TrendingUpIcon,
  UsersIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SectionHeading } from "@/components/shared/section-heading";

const FEATURES = [
  {
    icon: CalendarPlusIcon,
    title: "Create & Organize",
    description:
      "Set up a community event in minutes — title, description, type, location and a future date. No paperwork, no gatekeepers.",
  },
  {
    icon: UsersIcon,
    title: "Join Volunteer Events",
    description:
      "Browse upcoming social service events near you and sign up with one click. Your name is recorded with the event you join.",
  },
  {
    icon: LayoutDashboardIcon,
    title: "Manage Everything",
    description:
      "Update or delete the events you created from a personal dashboard. You stay in control of your own listings.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track Your Impact",
    description:
      "See every event you joined, sorted by date, and watch how many volunteers are signing up for causes you care about.",
  },
];


export function Features() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Why Shohojog"
          title="Everything a community needs to do good"
          description="From idea to impact — one platform for organizing, volunteering and tracking social development work."
        />

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature) => (
            <Card key={feature.title} className="h-full">
              <CardHeader>
                <span className="mb-1 flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <feature.icon className="size-5" />
                </span>
                <CardTitle className="text-base font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
