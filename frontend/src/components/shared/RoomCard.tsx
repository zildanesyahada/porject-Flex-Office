import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { cn, formatPrice, formatPriceShort } from "@/lib/utils";
import type { PriceUnit, Room } from "@/types/room";

const unitLabel: Record<PriceUnit, string> = {
  daily: "/day",
  monthly: "/month",
  yearly: "/year",
};

function RoomImage({ room, className }: { room: Room; className?: string }) {
  return (
    <img
      src={room.coverImage}
      alt={room.name}
      className={cn("size-full object-cover", className)}
      onError={(e) => (e.currentTarget.style.display = "none")}
    />
  );
}

interface RoomCardProps {
  room: Room;
  variant?: "default" | "featured" | "overlay";
  className?: string;
}

export function RoomCard({ room, variant = "default", className }: RoomCardProps) {
  const detailPath = `/rooms/${room.slug}`;
  const unit = unitLabel[room.priceUnit];

  if (variant === "featured") {
    return (
      <div className={cn("relative overflow-hidden rounded-xl bg-primary-soft", className)}>
        <RoomImage room={room} className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute inset-x-6 bottom-6 flex items-end justify-between gap-6 rounded-xl bg-white/90 px-6 py-5 shadow-pop backdrop-blur">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">{room.typeName}</p>
            <h3 className="mt-1 text-xl font-bold">{room.name}</h3>
            <p className="mt-2 flex items-center gap-3 text-[13px] text-text-secondary">
              <span className="flex items-center gap-1.5">
                <MapPin className="size-4 text-primary" aria-hidden />
                {room.address}
              </span>
              <span aria-hidden>•</span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-primary" aria-hidden />
                Up to {room.capacity} Persons
              </span>
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-end gap-3">
            <div className="text-right">
              <p className="text-xs text-text-secondary">Starting from</p>
              <p className="font-mono text-base font-semibold">
                {formatPrice(room.price)}
                <span className="text-xs font-normal text-text-secondary">{unit}</span>
              </p>
            </div>
            <Button asChild size="sm">
              <Link to={detailPath}>View Detail</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "overlay") {
    return (
      <Link
        to={detailPath}
        className={cn("group relative block overflow-hidden rounded-xl bg-primary-soft", className)}
      >
        <RoomImage room={room} className="absolute inset-0 transition-transform duration-500 group-hover:scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-3.5 text-white">
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold">{room.name}</h3>
            <p className="text-xs text-white/80">
              {room.buildingName} • {formatPriceShort(room.price)}
              {unit}
            </p>
          </div>
          <ArrowRight
            className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </div>
      </Link>
    );
  }

  return (
    <Card className={cn("flex flex-col", className)}>
      <div className="relative aspect-[208/132] bg-primary-soft">
        <RoomImage room={room} className="absolute inset-0" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-3.5">
        <h3 className="truncate text-sm font-bold">{room.name}</h3>
        <div className="flex flex-col gap-1 text-xs text-text-secondary">
          <p className="flex items-center gap-1.5">
            <MapPin className="size-3.5 shrink-0 text-primary" aria-hidden />
            <span className="truncate">{room.address}</span>
          </p>
          <p className="flex items-center gap-1.5">
            <Users className="size-3.5 shrink-0 text-primary" aria-hidden />
            Capacity: {room.capacity} Persons
          </p>
        </div>
        <div className="mt-auto flex items-center justify-between border-t border-border pt-3">
          <p className="font-mono text-[13px] font-semibold">
            {formatPrice(room.price)}
            <span className="text-[11px] font-normal text-text-secondary">{unit}</span>
          </p>
          <Button asChild size="sm" className="h-8 px-3 text-xs">
            <Link to={detailPath}>View Detail</Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}o