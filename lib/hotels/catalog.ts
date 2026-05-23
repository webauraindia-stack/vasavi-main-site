/**
 * Branch resolution helpers (UUID checks + hotel ref → branch id).
 */

import { fetchHotels } from "@/lib/hotels/api";
import type { Hotel } from "@/types";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isUuid(value: string): boolean {
  return UUID_RE.test(value);
}

export async function resolveBranchIdForHotel(
  hotelRef: string
): Promise<string | null> {
  if (!hotelRef) return null;
  if (isUuid(hotelRef)) return hotelRef;

  const hotels = await fetchHotels();
  const hotel =
    hotels.find((h) => h.id === hotelRef) ??
    hotels.find((h) => h.slug === hotelRef);
  return hotel?.id ?? null;
}

export async function enrichHotelsWithBranches(): Promise<
  (Hotel & { branchId: string })[]
> {
  const hotels = await fetchHotels();
  return hotels.map((hotel) => ({
    ...hotel,
    branchId: hotel.id,
  }));
}
