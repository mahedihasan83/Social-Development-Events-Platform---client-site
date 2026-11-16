import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { RecentEvents } from "@/components/home/recent-events";
import { Gallery } from "@/components/home/gallery";
import { Newsletter } from "@/components/home/newsletter";

/** Public home page: banner → features → recent events → gallery → newsletter. */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <RecentEvents />
      <Gallery />
      <Newsletter />
    </>
  );
}
