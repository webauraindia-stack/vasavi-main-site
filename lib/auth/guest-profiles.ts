import { normalizePhone } from "@/lib/auth/phone";

export type GuestProfile = {
  name: string;
  email: string;
  phone: string;
  city: string;
};

const guestProfiles = new Map<string, GuestProfile>();

function key(phone: string) {
  return normalizePhone(phone);
}

export function getGuestProfile(phone: string): GuestProfile | null {
  return guestProfiles.get(key(phone)) ?? null;
}

export function saveGuestProfile(profile: GuestProfile): GuestProfile {
  const normalized = {
    ...profile,
    phone: key(profile.phone),
    name: profile.name.trim(),
    email: profile.email.trim().toLowerCase(),
    city: profile.city.trim(),
  };

  guestProfiles.set(normalized.phone, normalized);
  return normalized;
}
