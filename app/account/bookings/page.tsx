"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { CalendarClock, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CUSTOMER_BOOKINGS,
  splitCustomerBookings,
} from "@/lib/data/customer-bookings";
import { CustomerBookingsList } from "@/components/account/customer-bookings-list";
import { useAppLanguage } from "@/hooks/use-app-language";

export default function BookingsPage() {
  const { t } = useAppLanguage();
  const { data: session } = useSession();
  const { present, past } = splitCustomerBookings(CUSTOMER_BOOKINGS);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-xl text-charcoal">{t("account.myBookings")}</h2>
        <p className="text-sm text-muted mt-1 font-semibold">
          {t("account.signedInAs", { email: session?.user?.email ?? "" })}
        </p>
      </div>

      <section aria-labelledby="present-bookings-heading">
        <div className="flex items-center gap-2 mb-4">
          <CalendarClock className="h-5 w-5 text-champagne" aria-hidden />
          <h3
            id="present-bookings-heading"
            className="font-display text-lg text-charcoal"
          >
            {t("account.presentBookings")}
          </h3>
          <span className="ml-auto rounded-full bg-champagne/10 px-2.5 py-0.5 text-xs font-bold text-champagne">
            {present.length}
          </span>
        </div>
        <CustomerBookingsList
          bookings={present}
          emptyMessage={t("account.noPresentBookings")}
        />
      </section>

      <section aria-labelledby="past-bookings-heading">
        <div className="flex items-center gap-2 mb-4">
          <History className="h-5 w-5 text-muted" aria-hidden />
          <h3 id="past-bookings-heading" className="font-display text-lg text-charcoal">
            {t("account.pastBookings")}
          </h3>
          <span className="ml-auto rounded-full bg-surface border border-beige px-2.5 py-0.5 text-xs font-bold text-muted">
            {past.length}
          </span>
        </div>
        <CustomerBookingsList
          bookings={past}
          emptyMessage={t("account.noPastBookings")}
        />
      </section>

      {present.length === 0 && past.length === 0 && (
        <div className="text-center pt-4">
          <p className="text-muted mb-4">{t("account.noBookings")}</p>
          <Link href="/#hotels">
            <Button>{t("account.browseHotels")}</Button>
          </Link>
        </div>
      )}
    </div>
  );
}
