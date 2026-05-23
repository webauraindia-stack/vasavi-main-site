import { apiFetch } from "@/lib/api/client";
import type { BackendBooking } from "@/lib/api/mappers";

export type CreateBookingPayload = {
  room_id: string;
  check_in_date: string;
  check_out_date: string;
  guest_count: number;
  guest_name?: string;
  guest_phone?: string;
  coupon_ids?: string[];
  notes?: string;
};

export async function createBooking(
  accessToken: string,
  payload: CreateBookingPayload
): Promise<BackendBooking> {
  return apiFetch<BackendBooking>("bookings/", {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload),
    idempotencyKey: crypto.randomUUID(),
  });
}

export async function listBookings(accessToken: string): Promise<BackendBooking[]> {
  const data = await apiFetch<{ results: BackendBooking[] }>("bookings/", {
    method: "GET",
    accessToken,
  });
  return data.results ?? [];
}

export async function getBooking(
  accessToken: string,
  id: string
): Promise<BackendBooking> {
  return apiFetch<BackendBooking>(`bookings/${id}/`, {
    method: "GET",
    accessToken,
  });
}

export async function createPaymentOrder(
  accessToken: string,
  bookingId: string
): Promise<{
  order_id: string | null;
  amount_paise: number;
  booking_reference: string;
}> {
  return apiFetch(`bookings/${bookingId}/payment/order/`, {
    method: "POST",
    accessToken,
    body: JSON.stringify({}),
    idempotencyKey: crypto.randomUUID(),
  });
}

/** Confirm booking with cash — marks paid and confirmed (no Razorpay). */
export async function confirmCashPayment(
  accessToken: string,
  bookingId: string,
  notes?: string
): Promise<BackendBooking> {
  return apiFetch<BackendBooking>(`bookings/${bookingId}/payment/cash/`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(notes ? { notes } : {}),
    idempotencyKey: crypto.randomUUID(),
  });
}
