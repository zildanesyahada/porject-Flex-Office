import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Armchair, CalendarCheck, LayoutGrid } from "lucide-react";
import { Button, Container } from "@/components/ui";
import { RoomCard } from "@/components/shared/RoomCard";
import { CategoryGrid } from "@/components/shared/CategoryGrid";
import { fetchRooms } from "@/features/rooms/api";
import type { Room } from "@/types/room";

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

function PopularWorkspaces({ rooms }: { rooms: Room[] }) {
  const [featured, ...others] = rooms;
  if (!featured) return null;

  return (
    <section id="featured" className="py-12">
      <Container>
        <h2 className="text-3xl font-bold leading-tight">
          Popular <span className="text-primary">Workspaces</span>
        </h2>
        <p className="mb-10 text-[15px] text-text-secondary">
          Explore our most popular spaces for work, meetings, and collaboration.
        </p>

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
        <div className="flex flex-col items-center gap-5 rounded-2xl bg-navy px-8 py-14 text-center text-white">
          <h2 className="text-[28px] font-bold">Ready to find your next workspace?</h2>
          <p className="max-w-lg text-white/80">
            Create an account, verify your email once, and book your first room today.
          </p>
          <Button asChild><Link to="/rooms">Browse all rooms</Link></Button>
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
      <CategoryGrid />
      <CtaBanner />
    </>
  );
}
