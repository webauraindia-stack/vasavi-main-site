import { isBefore, parseISO, startOfDay } from "date-fns";
import { MOCK_DONOR } from "@/lib/data/hotels";
import type { DonorBooking } from "@/types";

const EXTRA_BOOKINGS: DonorBooking[] = [
  {
    id: "b3",
    reference: "VH-4D6E8F",
    hotelId: "1",
    hotelName: "Sri Vasavi Nityannadana Residency",
    roomType: "Standard Non-AC",
    roomNumber: "101",
    checkIn: "2026-05-21",
    checkOut: "2026-05-23",
    nights: 2,
    subtotal: 5000,
    totalPaid: 5600,
    discountApplied: 0,
    status: "checked_in",
    guestEmail: "priya@example.com",
    guestPhone: "+91 90123 45678",
  },
  {
    id: "b-upcoming",
    reference: "VH-2F8K1Q",
    hotelId: "2",
    hotelName: "Sri Venkateswara Pilgrim Stay",
    roomType: "Standard AC",
    checkIn: "2026-06-10",
    checkOut: "2026-06-12",
    nights: 2,
    subtotal: 3600,
    totalPaid: 3200,
    discountApplied: 400,
    status: "confirmed",
    guestEmail: "priya@example.com",
    guestPhone: "+91 90123 45678",
  },
  {
    id: "b-past-1",
    reference: "VH-9A1B2C",
    hotelId: "3",
    hotelName: "Sri Vasavi Kanyaka Grand",
    roomType: "Family Room",
    roomNumber: "312",
    checkIn: "2025-12-20",
    checkOut: "2025-12-22",
    nights: 2,
    subtotal: 3600,
    totalPaid: 2880,
    discountApplied: 720,
    status: "completed",
    guestEmail: "priya@example.com",
    guestPhone: "+91 90123 45678",
  },
  {
    id: "b-past-2",
    reference: "VH-3C7D9E",
    hotelId: "1",
    hotelName: "Sri Vasavi Nityannadana Residency",
    roomType: "Deluxe AC",
    checkIn: "2025-10-05",
    checkOut: "2025-10-07",
    nights: 2,
    subtotal: 5000,
    totalPaid: 0,
    discountApplied: 0,
    status: "cancelled",
    guestEmail: "priya@example.com",
    guestPhone: "+91 90123 45678",
  },
];

export const CUSTOMER_BOOKINGS: DonorBooking[] = [...MOCK_DONOR.bookings, ...EXTRA_BOOKINGS];

export function isPastBooking(booking: DonorBooking, today = startOfDay(new Date())): boolean {
  if (booking.status === "completed" || booking.status === "cancelled") return true;
  const checkOut = startOfDay(parseISO(booking.checkOut));
  return isBefore(checkOut, today);
}

export function splitCustomerBookings(
  bookings: DonorBooking[],
  today = startOfDay(new Date())
): { present: DonorBooking[]; past: DonorBooking[] } {
  const present: DonorBooking[] = [];
  const past: DonorBooking[] = [];

  for (const booking of bookings) {
    if (isPastBooking(booking, today)) past.push(booking);
    else present.push(booking);
  }

  const byCheckIn = (a: DonorBooking, b: DonorBooking) =>
    parseISO(b.checkIn).getTime() - parseISO(a.checkIn).getTime();

  present.sort(byCheckIn);
  past.sort(byCheckIn);

  return { present, past };
}

export function getCustomerBooking(id: string): DonorBooking | undefined {
  return CUSTOMER_BOOKINGS.find((b) => b.id === id);
}

export function canExtendCustomerBooking(booking: DonorBooking): boolean {
  return booking.status === "confirmed" || booking.status === "checked_in";
}

export function minExtensionDate(checkOut: string): string {
  const d = new Date(checkOut);
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}
