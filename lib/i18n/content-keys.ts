/** Maps canonical English room names to i18n keys under roomTemplates.* */
export const ROOM_TEMPLATE_KEYS: Record<string, string> = {
  "Standard Non-AC": "standardNonAc",
  "Standard AC": "standardAc",
  "Family Room": "familyRoom",
  "Donor AC Room": "donorAcRoom",
  "Penthouse Suite": "penthouseSuite",
};

export function roomTemplateKey(roomName: string): string {
  return ROOM_TEMPLATE_KEYS[roomName] ?? roomName.toLowerCase().replace(/\s+/g, "");
}

export function amenityKey(amenity: string): string {
  return `amenities.${amenity}`;
}
