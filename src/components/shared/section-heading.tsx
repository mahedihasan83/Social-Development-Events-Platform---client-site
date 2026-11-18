import { Badge } from "@/components/ui/badge";


export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
}: {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "center" | "start";
}) {
  const centered = align === "center";
  return (
    <div
      className={
        centered
          ? "mx-auto mb-10 flex max-w-2xl flex-col items-center gap-3 text-center"
          : "mb-10 flex max-w-2xl flex-col items-start gap-3"
      }
    >
      <Badge variant="secondary" className="h-6 px-3 text-primary">
        {eyebrow}
      </Badge>
      <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h2>
      {description && (
        <p className="text-base leading-relaxed text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
