import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui";
import { Container } from "@/components/ui";

interface Category {
  slug: string;
  label: string;
  description: string;
  image: string;
}

const categories: Category[] = [
  {
    slug: "meeting-room",
    label: "Meeting",
    description: "For team meetings, workshops, and client sessions.",
    image: "/images/categories/meeting-room.jpg",
  },
  {
    slug: "coworking",
    label: "Coworking",
    description: "Flexible shared desks in an open, lively work area.",
    image: "/images/categories/coworking.jpg",
  },
  {
    slug: "workspace",
    label: "Workspace",
    description: "Your own dedicated desk in a quiet, shared work area.",
    image: "/images/categories/workspace.jpg",
  },
  {
    slug: "private-office",
    label: "Private Office",
    description: "Your own enclosed office for individuals and teams.",
    image: "/images/categories/private-office.jpg",
  },
  {
    slug: "event-space",
    label: "Event",
    description: "Spacious venues for events, trainings, and gatherings.",
    image: "/images/categories/event-space.jpg",
  },
  {
    slug: "studio",
    label: "Studio",
    description: "Creative space for photo, video, and podcast shoots.",
    image: "/images/categories/studio.jpg",
  },
];
// TODO: slug must match slug room_types in backend; data is temporary until API available.

export function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);

  const updateArrows = () => {
    const el = scrollRef.current;
    if (!el) return;
    const canScrollLeft = el.scrollLeft > 0;
    const canScrollRight =
      el.scrollLeft < el.scrollWidth - el.clientWidth;
    setShowLeft(canScrollLeft);
    setShowRight(canScrollRight);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handleScroll = () => requestAnimationFrame(updateArrows);
    const handleResize = () => requestAnimationFrame(updateArrows);

    el.addEventListener("scroll", handleScroll);
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(el);

    // Initial check
    updateArrows();

    return () => {
      el.removeEventListener("scroll", handleScroll);
      resizeObserver.disconnect();
    };
  }, []);

  const scrollLeft = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: -el.clientWidth, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const el = scrollRef.current;
    if (el) {
      el.scrollBy({ left: el.clientWidth, behavior: "smooth" });
    }
  };

  const CategoryCard = ({
    slug,
    label,
    description,
    image,
  }: Category) => (
    <Link
      to={`/rooms?type=${slug}`}
      className="block"
    >
      <div
        className="rounded-2xl border border-border bg-surface p-4 flex flex-col items-start gap-3 flex-shrink-0 w-[200px] hover:border-primary transition-colors duration-200"
      >
        <div className="w-32 h-24 flex-shrink-0 rounded-xl bg-primary-soft overflow-hidden">
          <img
            src={image}
            alt=""
            className="w-full h-full object-contain"
          />
        </div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-primary">
          {label}
        </h3>
        <p className="text-[14px] text-text-secondary line-clamp-2">
          {description}
        </p>
      </div>
    </Link>
  );

  return (
    <section className="py-20">
      <Container>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold leading-tight">
            Find the <span className="text-primary">Right Space</span>
          </h2>
          <p className="mb-10 text-[15px] text-text-secondary">
            Pick the type of space that fits how you work.
          </p>
        </div>

        <div className="relative">
          <div
            ref={scrollRef}
            className="flex flex-nowrap gap-24 overflow-x-auto scroll-snap-x snap-mandatory scroll-smooth pb-4"
          >
            {categories.map((cat) => (
              <CategoryCard
                key={cat.slug}
                {...cat}
              />
            ))}
          </div>

          {/* Left arrow */}
          {showLeft && (
            <Button
              variant="outline"
              className="rounded-full size-10 flex items-center justify-center left-2 top-1/2 -translate-y-1/2 z-10"
              onClick={scrollLeft}
              aria-label="Scroll left"
            >
              <ChevronLeft className="size-4" />
            </Button>
          )}
          {/* Right arrow */}
          {showRight && (
            <Button
              variant="outline"
              className="rounded-full size-10 flex items-center justify-center right-2 top-1/2 -translate-y-1/2 z-10"
              onClick={scrollRight}
              aria-label="Scroll right"
            >
              <ChevronRight className="size-4" />
            </Button>
          )}
        </div>
      </Container>
    </section>
  );
}