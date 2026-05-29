/** Distinguish bookable halls/venues from guest rooms in UI copy. */

export function isHallRoomType(typeName: string): boolean {
  const n = typeName.toLowerCase();
  return /hall|banquet|conference|auditorium|function|venue/.test(n);
}

export function formatRoomTypeLabel(typeName: string): string {
  if (!typeName.trim()) return "Room";
  return isHallRoomType(typeName) ? `${typeName} · Hall / venue` : `${typeName} · Guest room`;
}

export function formatRoomListingLabel(typeName: string, roomNumber: string): string {
  const kind = isHallRoomType(typeName) ? "Venue" : "Room";
  return `${typeName} · ${kind} ${roomNumber}`;
}
