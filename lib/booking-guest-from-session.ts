import { normalizeAadhaar, isValidAadhaarDigits } from "@/lib/aadhaar";
import type { Session } from "next-auth";
import type { GuestDetails } from "@/types";

/** Split display name into first / last for the booking form */
export function splitDisplayName(name?: string | null): {
  firstName: string;
  lastName: string;
} {
  const trimmed = (name ?? "").trim();
  if (!trimmed) return { firstName: "", lastName: "" };
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: parts[0] };
  }
  return { firstName: parts[0], lastName: parts.slice(1).join(" ") };
}

/** Local 10-digit mobile for form input */
export function phoneDigitsForForm(phone?: string | null): string {
  if (!phone) return "";
  const digits = phone.replace(/\D/g, "");
  if (digits.length >= 10) return digits.slice(-10);
  return digits;
}

export function guestDetailsFromSession(
  session: Session | null
): Partial<GuestDetails> | null {
  const user = session?.user;
  if (!user?.email) return null;

  const { firstName, lastName } = splitDisplayName(user.name);
  const phone = phoneDigitsForForm((user as { phone?: string }).phone);
  const aadhaar = normalizeAadhaar((user as { aadhaar?: string }).aadhaar ?? "");
  if (!firstName || phone.length < 10) return null;

  return {
    firstName,
    lastName: lastName || firstName,
    email: user.email,
    phone,
    countryCode: "+91",
    arrivalTime: "15:00",
    aadhaar: isValidAadhaarDigits(aadhaar) ? aadhaar : "",
    specialRequests: "",
  };
}

export function isGuestDetailsComplete(
  details: Partial<GuestDetails> | null | undefined
): boolean {
  if (!details) return false;
  const first = details.firstName?.trim() ?? "";
  const last = details.lastName?.trim() ?? "";
  const email = details.email?.trim() ?? "";
  const phone = details.phone?.replace(/\D/g, "") ?? "";
  const aadhaar = normalizeAadhaar(details.aadhaar ?? "");
  return (
    first.length >= 2 &&
    last.length >= 2 &&
    email.includes("@") &&
    phone.length >= 10 &&
    Boolean(details.arrivalTime?.trim()) &&
    isValidAadhaarDigits(aadhaar)
  );
}

export function mergeGuestDetails(
  stored: Partial<GuestDetails>,
  fromSession: Partial<GuestDetails> | null
): Partial<GuestDetails> {
  if (!fromSession) return stored;
  return {
    firstName: stored.firstName?.trim() || fromSession.firstName,
    lastName: stored.lastName?.trim() || fromSession.lastName,
    email: stored.email?.trim() || fromSession.email,
    phone: stored.phone?.replace(/\D/g, "") ? stored.phone : fromSession.phone,
    countryCode: stored.countryCode || fromSession.countryCode || "+91",
    arrivalTime: stored.arrivalTime || fromSession.arrivalTime || "15:00",
    aadhaar:
      normalizeAadhaar(stored.aadhaar ?? "") ||
      normalizeAadhaar(fromSession.aadhaar ?? ""),
    specialRequests: stored.specialRequests ?? fromSession.specialRequests ?? "",
  };
}

export function guestDetailsToFormValues(
  details: Partial<GuestDetails>
): GuestDetails {
  return {
    firstName: details.firstName ?? "",
    lastName: details.lastName ?? "",
    email: details.email ?? "",
    phone: details.phone ?? "",
    countryCode: details.countryCode ?? "+91",
    arrivalTime: details.arrivalTime ?? "15:00",
    aadhaar: normalizeAadhaar(details.aadhaar ?? ""),
    specialRequests: details.specialRequests ?? "",
  };
}
