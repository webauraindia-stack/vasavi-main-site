"use client";

import Image from "next/image";
import { Landmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookingStore } from "@/stores/booking-store";
import { formatCurrency } from "@/lib/utils";
import { getRoomImageUrl } from "@/lib/images/room-image";
import type { Hotel, Room } from "@/types";

export function FunctionHallList({
  halls,
  hotel,
}: {
  halls: Room[];
  hotel: Hotel;
}) {
  const openHallBooking = useBookingStore((s) => s.openHallBooking);
  const setDates = useBookingStore((s) => s.setDates);

  if (halls.length === 0) {
    return (
      <p className="text-sm text-muted">
        No function halls are available for the selected dates. Try different dates
        from search.
      </p>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {halls.map((hall) => (
        <article
          key={hall.id}
          className="rounded-xl border border-charcoal/10 bg-white overflow-hidden shadow-sm flex flex-col"
        >
          <div className="relative h-40 bg-surface">
            <Image
              src={getRoomImageUrl(hall)}
              alt={hall.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="p-5 flex flex-col gap-3 flex-1">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-champagne/15">
              <Landmark className="h-5 w-5 text-champagne-dark" />
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="font-display text-lg font-bold text-charcoal">{hall.name}</h3>
              <p className="text-xs text-muted mt-0.5 line-clamp-2">{hall.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="inline-flex items-center gap-1">
              <Users className="h-3.5 w-3.5" />
              Up to {hall.maxOccupancy} guests
            </span>
            <Badge variant="outline" className="text-[10px]">
              Full-day booking
            </Badge>
          </div>
          {hall.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {hall.amenities.slice(0, 4).map((a) => (
                <span
                  key={a}
                  className="text-[10px] rounded-full bg-surface px-2 py-0.5 text-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-charcoal/5">
            <p className="font-display text-xl font-bold text-champagne-dark">
              {formatCurrency(hall.pricePerNight)}
              <span className="text-sm font-normal text-muted"> / day</span>
            </p>
            <Button
              size="sm"
              onClick={() => {
                setDates(null, null);
                openHallBooking(hall);
              }}
            >
              Book hall
            </Button>
          </div>
          </div>
        </article>
      ))}
    </div>
  );
}
