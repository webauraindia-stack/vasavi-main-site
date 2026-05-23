"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar,
  CalendarPlus,
  Loader2,
  MapPin,
  Phone,
  Receipt,
  User,
} from "lucide-react";
import { StayExtensionDialog } from "@/components/booking/stay-extension-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getBooking } from "@/lib/api/bookings";
import { mapBookingDetail, type CustomerBookingDetail } from "@/lib/api/mappers";
import { canExtendCustomerBooking } from "@/lib/bookings/customer";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function BookingDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { session, status, isAuthenticated, accessToken, withAccessToken } =
    useAuthenticatedSession();
  const [checkOutOverride, setCheckOutOverride] = useState<string | null>(null);
  const [extendOpen, setExtendOpen] = useState(false);

  const {
    data: booking,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["booking-detail", id, accessToken],
    queryFn: () =>
      withAccessToken(async (token) => {
        const row = await getBooking(token, id);
        return mapBookingDetail(row);
      }),
    enabled: isAuthenticated && Boolean(id),
  });

  const displayBooking = useMemo((): CustomerBookingDetail | undefined => {
    if (!booking) return undefined;
    if (checkOutOverride) {
      return { ...booking, checkOut: checkOutOverride };
    }
    return booking;
  }, [booking, checkOutOverride]);

  if (status === "loading" || isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted py-12">
        <Loader2 className="h-5 w-5 animate-spin" />
        Loading booking…
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
        to view this booking.
      </p>
    );
  }

  if (error) {
    return (
      <div>
        <BackLink />
        <p className="text-sm text-red-600">
          {error instanceof Error ? error.message : "Could not load this booking."}
        </p>
      </div>
    );
  }

  if (!displayBooking) {
    return (
      <div>
        <BackLink />
        <p className="text-muted">Booking not found.</p>
      </div>
    );
  }

  const extendable = canExtendCustomerBooking(displayBooking);

  return (
    <div>
      <BackLink />

      <div className="card-surface rounded-xl p-6 border border-charcoal/10 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl text-charcoal">{displayBooking.hotelName}</h2>
            {displayBooking.branchCity && (
              <p className="text-sm text-muted mt-0.5">{displayBooking.branchCity}</p>
            )}
            <p className="text-sm text-muted mt-1">
              {displayBooking.roomType}
              {displayBooking.roomNumber ? ` · Room ${displayBooking.roomNumber}` : ""}
            </p>
            {displayBooking.reference && (
              <p className="text-xs font-mono text-muted mt-1">
                Ref: {displayBooking.reference}
              </p>
            )}
          </div>
          <div className="flex flex-col items-end gap-1.5">
            <Badge className="capitalize">
              {displayBooking.status.replace(/_/g, " ")}
            </Badge>
            <Badge variant="outline" className="capitalize text-xs">
              Payment: {displayBooking.paymentStatus.replace(/_/g, " ")}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 text-sm">
          <Detail icon={Calendar} label="Check-in" value={formatDate(displayBooking.checkIn)} />
          <Detail
            icon={Calendar}
            label="Check-out"
            value={formatDate(displayBooking.checkOut)}
          />
          {displayBooking.nights != null && (
            <Detail icon={Calendar} label="Nights" value={String(displayBooking.nights)} />
          )}
          {displayBooking.roomNumber && (
            <Detail icon={MapPin} label="Room" value={displayBooking.roomNumber} />
          )}
          <Detail
            icon={Receipt}
            label="Total"
            value={formatCurrency(displayBooking.totalPaid)}
          />
          {displayBooking.subtotal != null && displayBooking.discountApplied > 0 && (
            <Detail
              icon={Receipt}
              label="Subtotal (before discounts)"
              value={formatCurrency(displayBooking.subtotal)}
            />
          )}
          {displayBooking.guestName && (
            <Detail icon={User} label="Guest" value={displayBooking.guestName} />
          )}
          {displayBooking.guestPhone && (
            <Detail icon={Phone} label="Phone" value={displayBooking.guestPhone} />
          )}
        </div>

        {displayBooking.branchAddress && (
          <p className="text-sm text-muted">
            <MapPin className="inline h-3.5 w-3.5 mr-1 text-champagne" />
            {displayBooking.branchAddress}
          </p>
        )}

        {displayBooking.discountApplied > 0 && (
          <p className="text-sm text-champagne">
            Community savings: {formatCurrency(displayBooking.discountApplied)}
          </p>
        )}

        {displayBooking.paymentReference && (
          <p className="text-xs text-muted font-mono">
            Payment ref: {displayBooking.paymentReference}
            {displayBooking.paymentGateway
              ? ` · ${displayBooking.paymentGateway}`
              : ""}
          </p>
        )}

        {extendable && displayBooking.reference && (
          <div className="border-t border-charcoal/10 pt-5">
            <h3 className="font-display text-lg text-charcoal mb-2">Extend your stay</h3>
            <p className="text-sm text-muted mb-4">
              Need more time? Select a new checkout date — we&apos;ll verify room availability
              and show any additional charges before you pay.
            </p>
            <Button onClick={() => setExtendOpen(true)} className="gap-2">
              <CalendarPlus className="h-4 w-4" />
              Extend stay
            </Button>
          </div>
        )}

        {!extendable && (
          <p className="text-sm text-muted border-t border-charcoal/10 pt-4">
            This booking is not eligible for online extension. Contact the front desk for
            assistance.
          </p>
        )}
      </div>

      <StayExtensionDialog
        booking={displayBooking}
        open={extendOpen}
        onOpenChange={setExtendOpen}
        onCompleted={(newCheckOut) => setCheckOutOverride(newCheckOut)}
      />

      <p className="text-xs text-muted mt-4">
        Signed in as {session?.user?.phone ?? session?.user?.email}
      </p>
    </div>
  );
}

function BackLink() {
  return (
    <Link
      href="/account/bookings"
      className="text-sm text-champagne hover:underline inline-flex items-center gap-1 mb-4"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to bookings
    </Link>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="h-4 w-4 text-champagne shrink-0 mt-0.5" />
      <div>
        <p className="text-[10px] font-bold uppercase text-muted">{label}</p>
        <p className="font-medium text-charcoal">{value}</p>
      </div>
    </div>
  );
}
