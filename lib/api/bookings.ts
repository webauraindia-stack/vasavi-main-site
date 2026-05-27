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

export type ListBookingsParams = {
  status?: string;
  payment_status?: string;
};

export async function listBookings(
  accessToken: string,
  params?: ListBookingsParams
): Promise<BackendBooking[]> {
  const query = new URLSearchParams();
  if (params?.status) query.set("status", params.status);
  if (params?.payment_status) query.set("payment_status", params.payment_status);
  const qs = query.toString();
  const path = qs ? `bookings/?${qs}` : "bookings/";
  const data = await apiFetch<{ results: BackendBooking[] }>(path, {
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

export type ConfirmGuestBookingPayload = {
  coupon_ids?: string[];
  notes?: string;
};

/** Guest confirms a pending hold (confirmed, pay at property). */
export async function confirmGuestBooking(
  accessToken: string,
  bookingId: string,
  payload?: ConfirmGuestBookingPayload
): Promise<BackendBooking> {
  return apiFetch<BackendBooking>(`bookings/${bookingId}/confirm/`, {
    method: "POST",
    accessToken,
    body: JSON.stringify(payload ?? {}),
    idempotencyKey: crypto.randomUUID(),
  });
}

/** Staff-only: record cash payment at desk. */
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

export async function cancelBooking(
  accessToken: string,
  bookingId: string,
  reason: string
): Promise<BackendBooking> {
  return apiFetch<BackendBooking>(`bookings/${bookingId}/cancel/`, {
    method: "POST",
    accessToken,
    body: JSON.stringify({ reason }),
    idempotencyKey: crypto.randomUUID(),
  });
}