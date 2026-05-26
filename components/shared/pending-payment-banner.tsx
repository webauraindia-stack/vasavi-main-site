"use client";

import Link from "next/link";
import { AlertCircle, X } from "lucide-react";
import { useAppLanguage } from "@/hooks/use-app-language";
import { formatCurrency } from "@/lib/utils";
import { usePendingPaymentStore } from "@/stores/pending-payment-store";
import { Button } from "@/components/ui/button";

export function PendingPaymentBanner() {
  const { t } = useAppLanguage();
  const { payment, clearPending } = usePendingPaymentStore();

  if (!payment) return null;

  const payHref = payment.bookingId
    ? `/account/bookings/${payment.bookingId}?completePayment=1`
    : "/account/bookings?completePayment=1";

  return (
    <div
      role="alert"
      className="w-full border-b border-amber-700/25 bg-gradient-to-r from-amber-950 via-[#5c1818] to-amber-950 text-white"
    >
      <div className="page-container flex min-h-11 flex-wrap items-center gap-x-3 gap-y-2 py-2.5 lg:flex-nowrap lg:py-3">
        <AlertCircle className="h-5 w-5 lg:h-6 lg:w-6 shrink-0 text-amber-200" aria-hidden />
        <p className="flex-1 min-w-[12rem] text-sm lg:text-base font-semibold leading-snug lg:flex lg:items-center lg:gap-2">
          <span className="font-black uppercase tracking-wide text-amber-200/90 text-xs lg:text-sm shrink-0">
            {t("payment.pendingLabel")}
          </span>
          <span className="text-white/95">
            {t("payment.pendingMessage", {
              amount: formatCurrency(payment.amount),
              reference: payment.reference,
              hotel: payment.hotelName,
            })}
          </span>
        </p>
        <div className="flex shrink-0 items-center gap-1.5">
          <Button
            asChild
            size="sm"
            className="h-9 lg:h-10 rounded-full bg-white text-charcoal hover:bg-amber-50 font-bold text-xs lg:text-sm px-4 lg:px-5 shadow-sm"
          >
            <Link href={payHref}>{t("payment.completePayment")}</Link>
          </Button>
          <button
            type="button"
            onClick={clearPending}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full text-white/80 hover:bg-white/10 hover:text-white transition-colors"
            aria-label={t("payment.dismissPending")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
