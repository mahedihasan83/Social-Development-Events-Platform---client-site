import { SectionHeading } from "@/components/shared/section-heading";


const PHOTOS = [
  {
    src: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=800&q=80",
    caption: "Relief package distribution — Dhaka",
  },
  {
    src: "https://images.unsplash.com/photo-1593113598332-cd288d649433?auto=format&fit=crop&w=800&q=80",
    caption: "Community food sharing — Chattogram",
  },
  {
    src: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=800&q=80",
    caption: "Tree plantation drive — Savar",
  },
  {
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
    caption: "Winter clothes drive — Mohammadpur",
  },
  {
    src: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&q=80",
    caption: "Neighborhood cleanup — Mirpur",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80",
    caption: "Volunteer team huddle — Sylhet",
  },
];

export function Gallery() {
  return (
    <section className="border-t bg-muted/30">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 md:py-20">
        <SectionHeading
          eyebrow="Gallery"
          title="Moments of service"
          description="A glimpse of the community service events our volunteers have organized and joined."
        />

        
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {PHOTOS.map((photo) => (
            <figure
              key={photo.src}
              className="group relative overflow-hidden rounded-xl ring-1 ring-foreground/10"
            >
              <img
                src={photo.src}
                alt={photo.caption}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100"
              />
              <figcaption className="absolute bottom-3 left-3 translate-y-2 text-sm font-medium text-white opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                {photo.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
