"use client";

import { motion } from "framer-motion";
import { Crown, Gift, Wallet, Sparkles } from "lucide-react";
import type { BookingPricingResult } from "@/types";
import { formatCurrency, cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";

export function PaymentBreakdownPanel({
  pricing,
  compact = false,
}: {
  pricing: BookingPricingResult;
  compact?: boolean;
}) {
  const { t } = useAppLanguage();

  return (
    <div
      className={cn(
        "rounded-2xl border border-beige/50 bg-surface/80 p-4 space-y-2",
        compact ? "text-xs" : "text-sm"
      )}
    >
      <p className="font-display font-bold text-charcoal text-xs uppercase tracking-wider border-b border-beige/40 pb-2 mb-1">
        {t("booking.paymentBreakdown")}
      </p>

      <Row
        label={t("booking.roomNights", { nights: pricing.nights })}
        value={pricing.subtotal}
      />

      {pricing.tierDiscount > 0 && (
        <Row
          label={t("booking.tierDiscount")}
          value={-pricing.tierDiscount}
          tone="text-champagne"
          icon={<Crown className="h-3.5 w-3.5" />}
        />
      )}

      {pricing.appliedLines
        .filter((l) => l.type === "coupon")
        .map((line) => (
          <Row
            key={line.id}
            label={line.label}
            value={-line.amount}
            tone="text-emerald-700"
            icon={<Gift className="h-3.5 w-3.5" />}
            detail={line.detail}
          />
        ))}

      {pricing.walletApplied > 0 && (
        <Row
          label={t("booking.walletApplied")}
          value={-pricing.walletApplied}
          tone="text-emerald-700"
          icon={<Wallet className="h-3.5 w-3.5" />}
        />
      )}

      {pricing.promoDiscount > 0 && (
        <Row label="Promo" value={-pricing.promoDiscount} tone="text-emerald-700" />
      )}

      {pricing.sevaDonation > 0 && (
        <Row
          label={t("booking.sevaDonation")}
          value={pricing.sevaDonation}
          tone="text-champagne"
          icon={<Sparkles className="h-3.5 w-3.5" />}
        />
      )}

      {pricing.taxes > 0 && <Row label={t("booking.gst")} value={pricing.taxes} />}

      <div className="border-t border-beige/40 pt-2 flex justify-between items-center font-bold">
        <span className="text-charcoal">{t("booking.totalPayable")}</span>
        <span className="font-mono text-champagne-dark text-base">
          {formatCurrency(pricing.total)}
        </span>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  tone = "text-charcoal",
  icon,
  detail,
}: {
  label: string;
  value: number;
  tone?: string;
  icon?: React.ReactNode;
  detail?: string;
}) {
  return (
    <div className="flex justify-between items-start gap-2">
      <span className={cn("flex items-center gap-1.5 font-medium", tone)}>
        {icon}
        <span>
          {label}
          {detail && (
            <span className="block text-[10px] text-muted font-normal">{detail}</span>
          )}
        </span>
      </span>
      <span className={cn("font-mono font-bold shrink-0", tone)}>
        {value < 0 ? "−" : ""}
        {formatCurrency(Math.abs(value))}
      </span>
    </div>
  );
}
