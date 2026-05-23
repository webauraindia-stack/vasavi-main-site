"use client";

import Link from "next/link";
import { Calendar, ChevronRight, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import type { DonorBooking } from "@/types";

export function CustomerBookingsList({
  bookings,
  emptyMessage,
}: {
  bookings: DonorBooking[];
  emptyMessage: string;
}) {
  const { t } = useAppLanguage();

  const statusLabel = (status: string) => {
    const map: Record<string, string> = {
      confirmed: t("account.statusConfirmed"),
      checked_in: t("account.statusCheckedIn"),
      completed: t("account.statusCompleted"),
      cancelled: t("account.statusCancelled"),
      pending: t("account.statusPending"),
    };
    return map[status] ?? status.replace(/_/g, " ");
  };

  if (bookings.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-beige bg-surface/50 px-4 py-8 text-center text-sm font-semibold text-muted">
        {emptyMessage}
      </p>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <Link
          key={booking.id}
          href={`/account/bookings/${booking.id}`}
          className="block rounded-xl border border-beige/40 bg-white p-5 shadow-sm hover:shadow-md hover:border-champagne/30 transition-all duration-200 group animate-in fade-in-50 duration-300"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-beige/10 pb-4 mb-4">
            <div className="min-w-0 space-y-1.5">
              <h3 className="font-display text-xl sm:text-2xl font-bold text-charcoal leading-snug group-hover:text-champagne transition-colors">
                {booking.hotelName}
              </h3>
              <div className="flex flex-wrap items-center gap-2.5 text-base sm:text-lg">
                <span className="font-bold text-muted">{booking.roomType}</span>
                {booking.reference && (
                  <span className="text-xs font-mono bg-surface-deep px-2.5 py-0.5 rounded text-muted font-bold uppercase tracking-wider">
                    {booking.reference}
                  </span>
                )}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              <Badge
                className="text-xs sm:text-sm font-bold uppercase tracking-wider px-3 py-1.5"
                variant={
                  booking.status === "confirmed" || booking.status === "checked_in"
                    ? "default"
                    : booking.status === "completed"
                      ? "secondary"
                      : "outline"
                }
              >
                {statusLabel(booking.status)}
              </Badge>
              <ChevronRight className="h-6 w-6 text-muted/70 group-hover:translate-x-0.5 transition-transform" aria-hidden />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-base sm:text-lg">
            <div className="flex items-center gap-2.5 text-charcoal/90 font-bold">
              <Calendar className="h-5.5 w-5.5 text-champagne/70 shrink-0" aria-hidden />
              <span>{formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}</span>
            </div>
            
            <div className="flex items-baseline gap-2 text-left sm:text-right">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-muted">{t("common.total", { defaultValue: "Total Paid" })}:</span>
              <span className="text-xl sm:text-2xl font-bold text-champagne tabular-nums">
                {formatCurrency(booking.totalPaid)}
              </span>
            </div>
          </div>

          {(booking.discountApplied > 0 || ((booking.status === "confirmed" || booking.status === "checked_in") && booking.reference)) && (
            <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-4 border-t border-beige/10">
              {booking.discountApplied > 0 && (
                <p className="text-sm sm:text-base text-champagne font-bold">
                  {t("account.donorSavings", { amount: formatCurrency(booking.discountApplied) })}
                </p>
              )}
              {(booking.status === "confirmed" || booking.status === "checked_in") && booking.reference && (
                <p className="text-sm sm:text-base text-champagne-dark font-bold hover:underline">
                  {t("account.extendStay")}
                </p>
              )}
            </div>
          )}
        </Link>
      ))}
    </div>
  );
}
