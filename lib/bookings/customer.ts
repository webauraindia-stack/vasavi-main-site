import { formatLocalDateString } from "@/lib/date-format";
import type { DonorBooking } from "@/types";

export function canExtendCustomerBooking(
  booking: Pick<DonorBooking, "status">
): boolean {
  return booking.status === "confirmed" || booking.status === "checked_in";
}

export function minExtensionDate(checkOut: string): string {
  const d = new Date(checkOut);
  d.setDate(d.getDate() + 1);
  return formatLocalDateString(d);
}
