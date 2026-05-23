import { getGuestProfile } from "@/lib/auth/guest-profiles";
import { lookupMemberByPhone } from "@/lib/auth/users-by-phone";
import { formatPhoneDisplay, normalizePhone } from "@/lib/auth/phone";

export type CustomerProfileForm = {
  name: string;
  email: string;
  phone: string;
  city: string;
  memberId: string;
  categoryLabel: string;
  isKnownMember: boolean;
  isDonor: boolean;
};

export function getCustomerProfilePreview(phone: string): CustomerProfileForm {
  const normalized = normalizePhone(phone);
  const member = lookupMemberByPhone(normalized);

  if (member) {
    return {
      name: member.name,
      email: member.email,
      phone: formatPhoneDisplay(normalized),
      city: member.city,
      memberId: member.memberId,
      categoryLabel: member.categoryLabel,
      isKnownMember: true,
      isDonor: member.isDonor,
    };
  }

  const savedGuest = getGuestProfile(normalized);
  if (savedGuest) {
    return {
      name: savedGuest.name,
      email: savedGuest.email,
      phone: formatPhoneDisplay(normalized),
      city: savedGuest.city,
      memberId: "",
      categoryLabel: "Returning guest",
      isKnownMember: false,
      isDonor: false,
    };
  }

  return {
    name: "",
    email: "",
    phone: formatPhoneDisplay(normalized),
    city: "",
    memberId: "",
    categoryLabel: "",
    isKnownMember: false,
    isDonor: false,
  };
}
