import { MOCK_MEMBER_PROFILES } from "@/lib/data/community-members";
import { normalizePhone } from "@/lib/auth/phone";
import type { CommunityMemberProfile } from "@/types";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phone: string;
  isDonor: boolean;
  donorId?: string;
  tier?: string | null;
  memberProfile?: CommunityMemberProfile;
};

export function lookupMemberByPhone(phone: string): CommunityMemberProfile | null {
  const normalized = normalizePhone(phone);
  const digits = normalized.replace(/\D/g, "");

  return (
    MOCK_MEMBER_PROFILES.find((profile) => {
      const profileDigits = profile.phone.replace(/\D/g, "");
      return profileDigits === digits || profileDigits.endsWith(digits.slice(-10));
    }) ?? null
  );
}

export function resolveAuthUser(phone: string): AuthUser {
  const normalized = normalizePhone(phone);
  const profile = lookupMemberByPhone(normalized);

  if (profile) {
    return {
      id: profile.id,
      name: profile.name,
      email: profile.email,
      phone: normalized,
      isDonor: profile.isDonor,
      donorId: profile.memberId,
      tier: profile.tier,
      memberProfile: profile,
    };
  }

  const local = normalized.replace(/^\+91/, "");
  return {
    id: `guest-${local}`,
    name: "Guest",
    email: `guest+${local}@vasavi.org`,
    phone: normalized,
    isDonor: false,
  };
}
