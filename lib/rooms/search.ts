import { searchRooms as searchRoomsApi } from "@/lib/api/properties";
import { mapRoomFromBackend } from "@/lib/api/mappers";
import { formatLocalDateString } from "@/lib/date-format";
import { fetchHotels } from "@/lib/hotels/api";
import { isUuid } from "@/lib/hotels/catalog";
import type { Room, RoomCategory } from "@/types";
import { ApiClientError } from "@/lib/api/client";

export type RoomSearchParams = {
  hotel?: string;
  branch_id?: string;
  check_in: string;
  check_out: string;
  guests: number;
  priceMin?: number;
  priceMax?: number;
  roomTypes?: RoomCategory[];
  donorExclusive?: boolean;
};

export function defaultSearchDates(): { check_in: string; check_out: string } {
  const checkIn = new Date();
  const checkOut = new Date();
  checkOut.setDate(checkOut.getDate() + 1);
  return {
    check_in: formatLocalDateString(checkIn),
    check_out: formatLocalDateString(checkOut),
  };
}

function applyClientFilters(rooms: Room[], params: RoomSearchParams): Room[] {
  let filtered = rooms;
  if (params.priceMin !== undefined) {
    filtered = filtered.filter((r) => r.pricePerNight >= params.priceMin!);
  }
  if (params.priceMax !== undefined) {
    filtered = filtered.filter((r) => r.pricePerNight <= params.priceMax!);
  }
  if (params.roomTypes?.length) {
    filtered = filtered.filter((r) => params.roomTypes!.includes(r.category));
  }
  return filtered;
}

async function resolveBranchId(hotelRef?: string): Promise<string | undefined> {
  if (!hotelRef) return undefined;
  if (isUuid(hotelRef)) return hotelRef;

  const hotels = await fetchHotels();
  const bySlug = hotels.find((h) => h.slug === hotelRef);
  if (bySlug) return bySlug.id;

  const byLegacyId = hotels.find((h) => h.id === hotelRef);
  return byLegacyId?.id;
}

/** Room availability from Django only. */
export async function searchRooms(
  params: RoomSearchParams
): Promise<{ rooms: Room[]; source: "api" }> {
  const branchId = params.branch_id ?? (await resolveBranchId(params.hotel));

  if (params.hotel && !branchId) {
    throw new ApiClientError(
      "NOT_FOUND",
      "Guest house not found. Ensure branches are seeded in the backend.",
      404
    );
  }

  const results = await searchRoomsApi({
    check_in: params.check_in,
    check_out: params.check_out,
    guests: params.guests,
    branch_id: branchId,
    donor_exclusive: params.donorExclusive,
  });

  let rooms = results.map(mapRoomFromBackend);

  if (params.hotel && branchId) {
    rooms = rooms.map((r) => ({
      ...r,
      hotelId: branchId,
    }));
  }

  rooms = applyClientFilters(rooms, params);
  return { rooms, source: "api" };
}

/** @deprecated Use searchRooms */
export const searchRoomsHybrid = searchRooms;
