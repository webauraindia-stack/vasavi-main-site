import type { BackendFunctionHall } from "@/lib/api/function-halls";
import { propertyImageUrls } from "@/lib/images/property-images";
import { roomImagesFromApi } from "@/lib/images/room-image";
import type { Hotel, Room } from "@/types";

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Map API function hall to a Room-shaped object for the shared booking modal. */
export function mapFunctionHallToBookableRoom(
  hall: BackendFunctionHall,
  hotel: Hotel
): Room {
  const priceRupees = Math.round(hall.base_price_per_day / 100);
  const mapped = {
    id: hall.id,
    hotelId: hotel.id,
    hotelSlug: hotel.slug || slugify(hotel.name),
    hotelName: hotel.name,
    name: hall.name,
    category: "Suite" as const,
    description:
      hall.description ??
      `Function hall at ${hotel.name} · up to ${hall.capacity} guests`,
    pricePerNight: priceRupees || 1,
    bedType: "Event space",
    sizeSqFt: hall.capacity * 10,
    maxOccupancy: hall.capacity,
    floor: 0,
    amenities: hall.amenities ?? [],
    images: [] as string[],
    isDonorExclusive: false,
    isFullyBooked: hall.is_available === false,
    availableDates: [] as string[],
  };
  return {
    ...mapped,
    images: roomImagesFromApi(mapped, hall.images),
  };
}

export function hallImageUrls(hall: BackendFunctionHall): string[] {
  return propertyImageUrls(hall.images);
}

export async function fetchBranchFunctionHallCatalog(
  hotel: Hotel,
  params: { check_in: string; check_out: string; guests?: number }
): Promise<Room[]> {
  const { searchFunctionHalls } = await import("@/lib/api/function-halls");
  const rows = await searchFunctionHalls({
    branch_id: hotel.id,
    check_in_date: params.check_in,
    check_out_date: params.check_out,
    guests: params.guests ?? 50,
  });
  return rows
    .filter((h) => h.is_available !== false)
    .map((h) => mapFunctionHallToBookableRoom(h, hotel));
}
