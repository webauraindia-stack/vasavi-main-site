"use client";

import { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { normalizeStayDates } from "@/lib/date-range-selection";
import { parseGuestParams, parseSearchDate } from "@/lib/parse-search-params";
import { useSearchStore } from "@/stores/search-store";

function HotelDetailUrlSyncInner() {
  const searchParams = useSearchParams();
  const { setDates, setGuests, setHotel } = useSearchStore();

  useEffect(() => {
    const hotel = searchParams.get("hotel");
    if (hotel) setHotel(hotel);

    const from = parseSearchDate(searchParams.get("checkIn"));
    const to = parseSearchDate(searchParams.get("checkOut"));
    if (from) {
      const { checkIn, checkOut } = normalizeStayDates(from, to);
      setDates(checkIn, checkOut);
    }

    const guestUpdates = parseGuestParams({
      adults: searchParams.get("adults"),
      children: searchParams.get("children"),
      rooms: searchParams.get("rooms"),
    });
    if (Object.keys(guestUpdates).length > 0) setGuests(guestUpdates);
  }, [searchParams, setDates, setGuests, setHotel]);

  return null;
}

export function HotelDetailUrlSync() {
  return (
    <Suspense fallback={null}>
      <HotelDetailUrlSyncInner />
    </Suspense>
  );
}
