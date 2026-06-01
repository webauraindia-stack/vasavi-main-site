"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Clock, ChevronRight } from "lucide-react";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import { listBookings, getBooking } from "@/lib/api/bookings";
import { mapRoomFromBooking } from "@/lib/api/mappers";
import { useBookingStore } from "@/stores/booking-store";
import { formatCurrency, formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";

function isActivePending(expiresAt?: string | null): boolean {
  if (!expiresAt) return true;
  return new Date(expiresAt).getTime() > Date.now();
}

export function PendingBookingsResume() {
  const { isAuthenticated, accessToken, withAccessToken } = useAuthenticatedSession();
  const resumePendingBooking = useBookingStore((s) => s.resumePendingBooking);
  const [resumingId, setResumingId] = useState<string | null>(null);

  const { data: pending, isLoading } = useQuery({
    queryKey: ["pending-bookings", accessToken],
    queryFn: () =>
      withAccessToken(async (token) => {
        const rows = await listBookings(token, {
          status: "pending",
          payment_status: "unpaid",
        });
        return rows.filter((b) => isActivePending(b.expires_at));
      }),
    enabled: isAuthenticated,
    staleTime: 30_000,
  });

  const handleResume = useCallback(
    async (bookingId: string) => {
      setResumingId(bookingId);
      try {
      await withAccessToken(async (token) => {
        const booking = await getBooking(token, bookingId);
        const room = mapRoomFromBooking(booking);
        if (!room) return;

        const couponIds =
          booking.coupons_applied?.map((c) => c.id).filter(Boolean) ?? [];

        const isHall =
          booking.booking_kind === "function_hall" ||
          Boolean(booking.function_hall?.id);
        resumePendingBooking(
          booking.id,
          booking.booking_reference,
          room,
          new Date(booking.check_in_date),
          new Date(booking.check_out_date),
          2,
          couponIds,
          isHall ? "function_hall" : "room"
        );
      });
      } finally {
        setResumingId(null);
      }
    },
    [resumePendingBooking, withAccessToken]
  );

  if (!isAuthenticated || isLoading) return null;
  if (!pending?.length) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 -mt-4 mb-6">
      <div className="rounded-2xl border border-champagne/30 bg-gradient-to-r from-champagne/10 to-amber-50/40 p-4 sm:p-5 shadow-warm">
        <div className="flex items-center gap-2 mb-3">
          <Clock className="h-5 w-5 text-champagne-dark" />
          <h2 className="font-display font-bold text-charcoal text-lg">
            Continue your booking
          </h2>
        </div>
        <p className="text-sm text-muted mb-4">
          You have {pending.length === 1 ? "a reservation" : `${pending.length} reservations`}{" "}
          waiting to be completed. Finish blessings and payment before the hold expires.
        </p>
        <ul className="space-y-2">
          {pending.map((b) => {
            const hotel = b.branch?.name ?? "Vasavi Hotel";
            const isHall =
              b.booking_kind === "function_hall" || Boolean(b.function_hall?.id);
            const roomLabel = isHall
              ? `Hall · ${b.function_hall?.name ?? "Function hall"}`
              : b.room?.room_type?.name
                ? `${b.room.room_type.name} · ${b.room.room_number}`
                : b.room?.room_number ?? "Room";
            const total = Math.round((b.final_amount_paise ?? 0) / 100);
            return (
              <li
                key={b.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl bg-white/80 border border-beige/50 px-4 py-3"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-charcoal truncate">{hotel}</p>
                  <p className="text-sm text-muted">{roomLabel}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {formatDate(b.check_in_date)} – {formatDate(b.check_out_date)} ·{" "}
                    {formatCurrency(total)}
                  </p>
                  {b.booking_reference && (
                    <p className="text-[11px] font-mono text-muted mt-0.5">
                      {b.booking_reference}
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  size="sm"
                  className="shrink-0 gap-1"
                  loading={resumingId === b.id}
                  loadingText="Opening…"
                  onClick={() => void handleResume(b.id)}
                >
                  Continue
                  {!resumingId && <ChevronRight className="h-4 w-4" />}
                </Button>
              </li>
            );
          })}
        </ul>
        <p className="text-[11px] text-muted mt-3">
          Or view all bookings in{" "}
          <Link href="/account/bookings" className="text-champagne-dark font-semibold underline">
            My account
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
