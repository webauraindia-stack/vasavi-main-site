/**
 * Fallback image URLs for branches/rooms when the API has no photos.
 */

const q = "auto=format&fit=crop&w=800&q=80";

function img(photoId: string): string {
  return `https://images.unsplash.com/${photoId}?${q}`;
}

export const U = {
  charminarDay: "photo-1750834115164-8c2658f18dd0",
  charminarNight: "photo-1753068863517-a38273f2d7bd",
  charminarSilhouette: "photo-1743884092589-cbfe3689ebcf",
  templeFestival: "photo-1548013146-72479768bada",
  familyGathering: "photo-1511895426328-dc8714191300",
  heritageInterior: "photo-1618773928121-c32242e63f39",
  hotelLobby: "photo-1542314831-068cd1dbfeeb",
  hotelExterior: "photo-1551882547-ff40c63fe5fa",
  resortPool: "photo-1566073771259-6a8506099945",
  coastalHotel: "photo-1582719508461-905c673771fd",
  resortAerial: "photo-1571896349842-33c89424de2d",
  beachResort: "photo-1520250497591-112f2f40a3f4",
  hillLandscape: "photo-1606046604972-77cc76aee944",
  hotelRoom: "photo-1590490360182-c33d57733427",
  roomBalcony: "photo-1596394516093-501ba68a0ba6",
  andhraHotel: "photo-1584132967334-10e028bd69f7",
} as const;

export function unsplash(photoId: string): string {
  return img(photoId);
}

export const ROOM_IMAGES = {
  standard: img(U.hotelRoom),
  deluxe: img(U.roomBalcony),
  family: img(U.hotelLobby),
  suite: img(U.heritageInterior),
} as const;

export const DEFAULT_BRANCH_HERO = img(U.resortPool);
