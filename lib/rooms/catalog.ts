import { listBranchRooms } from "@/lib/api/properties";
import { mapRoomFromCatalog } from "@/lib/api/mappers";
import type { Room } from "@/types";
import { searchRooms, type RoomSearchParams } from "@/lib/rooms/search";

const catalogCache = new Map<string, { rooms: Room[]; expires: number }>();
const CACHE_MS = 60_000;

/**
 * All active rooms for a branch from the database, with optional availability
 * overlay for the given search dates.
 */
export async function fetchBranchRoomCatalog(
  branchId: string,
  availability?: Pick<RoomSearchParams, "check_in" | "check_out" | "guests">
): Promise<Room[]> {
  const cacheKey = `${branchId}:${availability?.check_in ?? ""}:${availability?.check_out ?? ""}`;
  const now = Date.now();
  const hit = catalogCache.get(cacheKey);
  if (hit && now < hit.expires) {
    return hit.rooms;
  }

  const catalog = await listBranchRooms(branchId);
  let rooms = catalog.map(mapRoomFromCatalog);

  if (availability) {
    try {
      const { rooms: available } = await searchRooms({
        branch_id: branchId,
        check_in: availability.check_in,
        check_out: availability.check_out,
        guests: availability.guests,
      });
      const availableIds = new Set(
        available.filter((r) => !r.isFullyBooked).map((r) => r.id)
      );
      rooms = rooms.map((r) => ({
        ...r,
        isFullyBooked: !availableIds.has(r.id),
      }));
    } catch {
      /* Show catalog without availability overlay */
    }
  }

  catalogCache.set(cacheKey, { rooms, expires: now + CACHE_MS });
  return rooms;
}

export function invalidateBranchRoomCatalog(branchId?: string): void {
  if (!branchId) {
    catalogCache.clear();
    return;
  }
  for (const key of catalogCache.keys()) {
    if (key.startsWith(`${branchId}:`)) {
      catalogCache.delete(key);
    }
  }
}
