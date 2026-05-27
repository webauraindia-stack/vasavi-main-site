import { NextRequest, NextResponse } from "next/server";
import { defaultSearchDates, searchRooms } from "@/lib/rooms/search";
import { parseApiErrorMessage } from "@/lib/api/parse-error";
import { ApiClientError } from "@/lib/api/client";
import type { RoomCategory } from "@/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const defaults = defaultSearchDates();

  const check_in =
    searchParams.get("checkIn") ??
    searchParams.get("check_in") ??
    defaults.check_in;
  const check_out =
    searchParams.get("checkOut") ??
    searchParams.get("check_out") ??
    defaults.check_out;
  const guests = Number(searchParams.get("guests") ?? searchParams.get("adults") ?? 2);

  const roomTypes = searchParams.get("roomTypes")?.split(",").filter(Boolean) as
    | RoomCategory[]
    | undefined;

  try {
    const { rooms, source } = await searchRooms({
      hotel: searchParams.get("hotel") ?? undefined,
      branch_id: searchParams.get("branch_id") ?? undefined,
      check_in,
      check_out,
      guests: guests > 0 ? guests : 2,
      priceMin: searchParams.get("priceMin")
        ? Number(searchParams.get("priceMin"))
        : undefined,
      priceMax: searchParams.get("priceMax")
        ? Number(searchParams.get("priceMax"))
        : undefined,
      roomTypes,
      donorExclusive: searchParams.get("donorExclusive") === "true",
    });

    return NextResponse.json({
      rooms,
      meta: {
        source,
        check_in,
        check_out,
        guests: guests > 0 ? guests : 2,
      },
    });
  } catch (error) {
    const status = error instanceof ApiClientError ? error.status : 502;
    const message =
      error instanceof Error
        ? error.message
        : parseApiErrorMessage(error, "Room search failed.");
    return NextResponse.json({ error: message, rooms: [] }, { status });
  }
}
