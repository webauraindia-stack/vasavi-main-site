"use client";

import { useSession } from "next-auth/react";
import { Calendar, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, formatDate } from "@/lib/utils";
import { MOCK_DONOR } from "@/lib/data/hotels";

import type { DonorBooking } from "@/types";

const mockBookings: DonorBooking[] = [
  ...MOCK_DONOR.bookings,
  {
    id: "b3",
    hotelName: "Metro Luxe Mumbai",
    roomType: "Classic Standard",
    checkIn: "2025-05-20",
    checkOut: "2025-05-22",
    totalPaid: 18900,
    discountApplied: 0,
    status: "pending",
  },
];

export default function BookingsPage() {
  const { data: session } = useSession();

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6">My Bookings</h2>
      <p className="text-sm text-muted mb-6">
        Signed in as {session?.user?.email}
      </p>

      <div className="space-y-4">
        {mockBookings.map((booking) => (
          <div
            key={booking.id}
            className="card-surface rounded-xl p-5 border border-charcoal/10"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div>
                <h3 className="font-display text-lg text-charcoal">
                  {booking.hotelName}
                </h3>
                <p className="text-sm text-muted">{booking.roomType}</p>
              </div>
              <Badge
                variant={
                  booking.status === "confirmed"
                    ? "default"
                    : booking.status === "completed"
                      ? "secondary"
                      : "outline"
                }
                className="capitalize"
              >
                {booking.status}
              </Badge>
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
          </div>
        ))}
      </div>
    </div>
  );
}
