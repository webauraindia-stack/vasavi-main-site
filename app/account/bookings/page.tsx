"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import { Calendar, ChevronRight, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { listBookings } from "@/lib/api/bookings";
import { mapBookingListItem } from "@/lib/api/mappers";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BookingsPage() {
  const { session, status, isAuthenticated, accessToken, withAccessToken } =
    useAuthenticatedSession();

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["my-bookings", accessToken],
    queryFn: () =>
      withAccessToken(async (token) => {
        const rows = await listBookings(token);
        return rows.map(mapBookingListItem);
      }),
    enabled: isAuthenticated,
  });

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted py-12">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading bookings…
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <p className="text-muted">
        Please{" "}
        <Link href="/login" className="text-champagne-dark underline">
          sign in
        </Link>{" "}
        to view your bookings.
      </p>
    );
  }

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6">My Bookings</h2>
      <p className="text-sm text-muted mb-6">
        Signed in as {session?.user?.phone ?? session?.user?.email}
      </p>

      {error && (
        <p className="text-sm text-red-600 mb-4">Could not load bookings from the server.</p>
      )}

      {!bookings?.length && !error && (
        <p className="text-muted text-sm">No bookings yet. Search for a room to book your first stay.</p>
      )}

      <div className="space-y-4">
        {bookings?.map((booking) => (
          <Link
            key={booking.id}
            href={`/account/bookings/${booking.id}`}
            className="card-surface rounded-xl p-5 border border-charcoal/10 block hover:border-champagne/40 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-display text-lg text-charcoal group-hover:text-champagne-dark">
                  {booking.hotelName}
                </h3>
                <p className="text-sm text-muted">{booking.roomType}</p>
                {booking.reference && (
                  <p className="text-xs font-mono text-muted mt-0.5">{booking.reference}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="capitalize">
                  {booking.status.replace(/_/g, " ")}
                </Badge>
                <ChevronRight className="h-4 w-4 text-muted" />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-muted">
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {formatDate(booking.checkIn)} – {formatDate(booking.checkOut)}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                {formatCurrency(booking.totalPaid)}
              </span>
            </div>
            {booking.discountApplied > 0 && (
              <p className="text-xs text-champagne mt-2">
                Donor savings: {formatCurrency(booking.discountApplied)}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
