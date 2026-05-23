import { ROOM_IMAGES } from "@/lib/images/hotel-images";
import type { RoomCategory } from "@/types";

const DEFAULT_ROOM_IMAGE = ROOM_IMAGES.standard;

/** Resolve a non-empty image URL for room cards (API rooms often have no images). */
export function getRoomImageUrl(room: {
  images?: string[];
  category?: RoomCategory;
}): string {
  const fromList = room.images?.find(
    (url) => typeof url === "string" && url.trim().length > 0
  );
  if (fromList) return fromList;

  switch (room.category) {
    case "Suite":
    case "Penthouse":
      return ROOM_IMAGES.suite;
    case "Deluxe":
      return ROOM_IMAGES.deluxe;
    default:
      return DEFAULT_ROOM_IMAGE;
  }
}

export function roomImagesFromApi(room: {
  images?: string[];
  category?: RoomCategory;
}): string[] {
  const valid = (room.images ?? []).filter(
    (url) => typeof url === "string" && url.trim().length > 0
  );
  if (valid.length > 0) return valid;
  return [getRoomImageUrl(room)];
}
