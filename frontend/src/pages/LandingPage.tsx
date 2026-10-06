import { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Armchair, CalendarCheck, ChevronLeft, ChevronRight, LayoutGrid } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { RoomCard } from "@/components/shared/RoomCard";
import { fetchRooms } from "@/features/rooms/api";
import type { Room } from "@/types/room";
import { cn } from "@/lib/utils";

function Hero() {
  const stats = [
    { value: "50+ Spaces", label: "Directly Owned" },
    { value: "4 Cities", label: "Metro Hubs" },
    { value: "100%", label: "Transparent" },
  ];

  return (
    <section className="pt-7">
      <Container>
        <div
          className="relative flex h-[473px] items-center overflow-hidden rounded-2xl bg-navy bg-cover bg-center px-14"
          style={{ backgroundImage: "url(assets/images/hero.png)" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/50 to-black/20" />

          <div className="relative flex max-w-[460px] flex-col gap-5 text-white">
            <h1 className="text-4xl font-bold leading-[1.15]">
              One Platform,
              <br />
              Workspace You Can Trust
            </h1>
            <p className="text-base text-white/90">
              Discover professional workspaces designed for meetings, collaboration, and focused
              work with transparent pricing.
            </p>
            <div className="flex gap-3">
              <Button asChild>
                <Link to="/rooms">Explore Rooms</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/70 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <a href="#why-flexoffice">How It Works</a>
              </Button>
            </div>
          </div>

          <div className="absolute bottom-5 right-5 rounded-xl bg-surface px-5 py-4 shadow-pop">
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-text-secondary">
              Why FlexOffice?
            </p>
            <div className="flex divide-x divide-border">
              {stats.map((s) => (
                <div key={s.label} className="px-5 text-center first:pl-0 last:pr-0">
                  <p className="font-bold">{s.value}</p>
                  <p className="text-[11px] text-text-secondary">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

function WhyFlexOffice() {
  const points = [
    { icon: LayoutGrid, label: "Flexible workspace options" },
    { icon: CalendarCheck, label: "Simple and convenient booking process" },
    { icon: Armchair, label: "Comfortable and professional facilities" },
  ];

  return (
    <section id="why-flexoffice" className="bg-navy text-white">
      <Container className="grid grid-cols-2 items-center gap-16 py-14">
        <div className="flex flex-col gap-6">
          <h2 className="text-3xl font-bold leading-tight">
            Why <span className="text-primary-soft">FlexOffice</span>
          </h2>
          <p className="max-w-[460px] text-[15px] leading-relaxed text-white/90">
            We make it simple to find a workspace that fits the way you work. FlexOffice provides a
            range of comfortable and professional spaces for meetings, focused work, collaboration,
            and other business needs. With transparent pricing, flexible options, and a
            straightforward booking process, you can choose the right space and reserve it with
            confidence.
          </p>
          <ul className="flex flex-col gap-3">
            {points.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-3 text-[13px] font-medium">
                <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/10">
                  <Icon className="size-3.5" aria-hidden />
                </span>
                {label}
              </li>
            ))}
          </ul>
        </div>

        <img
          src="assets/images/banner.png"
          alt="Team collaborating over building plans in a meeting room"
          className="aspect-[7/5] w-full rounded-xl object-cover shadow-pop"
        />
      </Container>
    </section>
  );
}

function SectionHeading({ title, highlight, subtitle }: { title: string; highlight: string; subtitle: string }) {
  return (
    <div className="mb-10">
      <h2 className="text-3xl font-bold leading-tight">
        {title} <span className="text-primary">{highlight}</span>
      </h2>
      <p className="mb-10 text-[15px] text-text-secondary">{subtitle}</p>
    </div>
  );
}

interface Category {
  slug: string;
  label: string;
  description: string;
}

// TODO: data sementara. slug harus sama dengan slug room_types di backend.
const categories: Category[] = [
  { slug: "meeting-room", label: "Meeting", description: "For team meetings, workshops, and client sessions." },
  { slug: "coworking", label: "Coworking", description: "Flexible shared desks in an open, lively work area." },
  { slug: "workspace", label: "Workspace", description: "Your own dedicated desk in a quiet, shared work area." },
  { slug: "private-office", label: "Private Office", description: "Your own enclosed office for individuals and teams." },
  { slug: "event-space", label: "Event", description: "Spacious venues for events, trainings, and gatherings." },
  { slug: "studio", label: "Studio", description: "Creative space for photo, video, and podcast shoots." },
];

const categoryImage = (slug: string) => `assets/images/categories/${slug}.jpg`;

function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/rooms?type=${category.slug}`}
      className="group flex w-[calc((100%-48px)/3)] shrink-0 snap-start items-center gap-5 rounded-2xl border border-border bg-surface p-7 transition-colors hover:border-primary"
    >
      <div className="flex size-[120px] shrink-0 items-center justify-center rounded-xl bg-primary-soft">
        <img
          src={categoryImage(category.slug)}
          alt=""
          className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="min-w-0">
        <h3 className="text-[15px] font-semibold uppercase tracking-[0.12em] text-text-primary">
          {category.label}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-text-secondary">
          {category.description}
        </p>
      </div>
    </Link>
  );
}

function CarouselArrow({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  const Icon = direction === "prev" ? ChevronLeft : ChevronRight;

  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous categories" : "Next categories"}
      className={cn(
        "absolute top-1/2 z-10 size-10 -translate-y-1/2 rounded-full bg-surface p-0 shadow-pop",
        direction === "prev" ? "-left-5" : "-right-5",
      )}
    >
      <Icon className="size-5" aria-hidden />
    </Button>
  );
}

function CategoryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: true });

  const updateEdge = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setEdge({
      start: el.scrollLeft <= 4,
      end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const observer = new ResizeObserver(updateEdge);
    observer.observe(el);
    return () => observer.disconnect();
  }, [updateEdge]);

  function scrollByPage(direction: 1 | -1) {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" });
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        onScroll={updateEdge}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((category) => (
          <CategoryCard key={category.slug} category={category} />
        ))}
      </div>
      {!edge.start && <CarouselArrow direction="prev" onClick={() => scrollByPage(-1)} />}
      {!edge.end && <CarouselArrow direction="next" onClick={() => scrollByPage(1)} />}
    </div>
  );
}

function FindRightSpace() {
  return (
    <section className="py-12">
      <Container>
        <SectionHeading
          title="Find the"
          highlight="Right Space"
          subtitle="Pick the type of space that fits how you work."
        />
        <CategoryCarousel />
      </Container>
    </section>
  );
}

function PopularWorkspaces({ rooms }: { rooms: Room[] }) {
  const [featured, ...others] = rooms;
  if (!featured) return null;

  return (
    <section id="featured" className="py-12">
      <Container>
        <SectionHeading
          title="Popular"
          highlight="Workspaces"
          subtitle="Explore our most popular spaces for work, meetings, and collaboration."
        />
        <div className="grid h-[436px] grid-cols-[minmax(0,1.42fr)_minmax(0,1fr)] gap-6">
          <RoomCard room={featured} variant="featured" className="h-full" />
          <div className="grid grid-cols-2 grid-rows-2 gap-4">
            {others.slice(0, 4).map((room) => (
              <RoomCard key={room.id} room={room} variant="overlay" className="h-full" />
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="pb-20">
      <Container>
        <div className="relative rounded-2xl bg-ink px-8 py-14 text-center text-white overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--color-primary)/35_0%,transparent_45%),radial-gradient(ellipse_at_top_right,var(--color-primary)/35_0%,transparent_45%)]" />
          <div className="relative flex flex-col items-center gap-3 max-w-[28rem] mx-auto">
            <h2 className="text-[28px] font-bold leading-tight">
              Ready to find your next workspace? Getting Started
            </h2>
            <p className="text-white/75 leading-relaxed">
              Create an account and book your first room today.
            </p>
            <Button asChild className="mt-7 bg-surface text-ink hover:bg-surface/90">
              <Link to="/register">Register</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default function LandingPage() {
  const [rooms, setRooms] = useState<Room[]>([]);

  useEffect(() => {
    fetchRooms().then(setRooms);
  }, []);

  return (
    <>
      <Hero />
      <PopularWorkspaces rooms={rooms} />
      <WhyFlexOffice />
      <FindRightSpace />
      <CtaBanner />
    </>
  );
}