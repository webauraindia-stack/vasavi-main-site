import { ROOM_IMAGES } from "@/lib/images/hotel-images";
import { propertyImageUrls, type ApiPropertyImage } from "@/lib/images/property-images";
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

export function roomImagesFromApi(
  room: {
    images?: string[] | ApiPropertyImage[];
    category?: RoomCategory;
  },
  apiImages?: ApiPropertyImage[] | null
): string[] {
  const fromApi = propertyImageUrls(apiImages);
  if (fromApi.length > 0) return fromApi;

  const raw = room.images ?? [];
  if (raw.length > 0 && typeof raw[0] === "object") {
    const fromObjects = propertyImageUrls(raw as ApiPropertyImage[]);
    if (fromObjects.length > 0) return fromObjects;
  }

  const valid = (raw as string[]).filter(
    (url) => typeof url === "string" && url.trim().length > 0
  );
  if (valid.length > 0) return valid;
  return [getRoomImageUrl({ category: room.category })];
}
