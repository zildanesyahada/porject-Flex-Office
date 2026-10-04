import { Link } from "react-router-dom";
import {
  Building2,
  Camera,
  CalendarDays,
  Laptop,
  Presentation,
  Users,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui";

interface Category {
  slug: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const categories: Category[] = [
  {
    slug: "meeting-room",
    title: "Meeting",
    description: "Team meetings and workshops",
    icon: Presentation,
  },
  {
    slug: "coworking",
    title: "Coworking",
    description: "Shared desks",
    icon: Users,
  },
  {
    slug: "workspace",
    title: "Workspace",
    description: "Your own desk",
    icon: Laptop,
  },
  {
    slug: "private-office",
    title: "Private Office",
    description: "For individuals and teams",
    icon: Building2,
  },
  {
    slug: "event-space",
    title: "Event",
    description: "Events and trainings",
    icon: CalendarDays,
  },
  {
    slug: "studio",
    title: "Studio",
    description: "Photo, video, podcast",
    icon: Camera,
  },
];

export function CategoryGrid() {
  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold text-navy">Find the Right Space</h2>
          <p className="mt-3 text-muted-foreground">
            Pick the type of space that fits how you work.
          </p>
        </div>

        <div className="grid grid-cols-6 gap-4">
          {categories.map(({ slug, title, description, icon: Icon }) => (
            <Link
              key={slug}
              to={`/rooms?type=${slug}`}
              className="group flex h-full flex-col rounded-2xl border border-border bg-background p-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-navy/30 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
            >
              <div className="flex h-24 items-center justify-center rounded-xl bg-blue-100 text-navy transition-colors group-hover:bg-blue-200">
                <Icon className="size-8" strokeWidth={1.75} />
              </div>
              <div className="px-1 pb-1 pt-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-navy">
                  {title}
                </h3>
                <p className="mt-1.5 text-sm leading-snug text-muted-foreground">
                  {description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
