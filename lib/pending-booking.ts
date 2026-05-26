const STORAGE_KEY = "vasavi_pending_booking";

export interface PendingBooking {
  roomId: string;
  hotelSlug: string;
}

export function setPendingBooking(roomId: string, hotelSlug: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ roomId, hotelSlug }));
}

export function getPendingBooking(): PendingBooking | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingBooking;
  } catch {
    return null;
  }
}

export function clearPendingBooking() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}

export function buildLoginCallbackUrl(hotelSlug: string, roomId: string) {
  return `/hotels/${hotelSlug}?resumeBooking=${encodeURIComponent(roomId)}`;
}
