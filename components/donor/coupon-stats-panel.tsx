"use client";

import { Ticket, Clock, CheckCircle2, Package } from "lucide-react";
import type { CouponStats } from "@/types";
import { cn } from "@/lib/utils";

type Variant = "compact" | "grid";

export function CouponStatsPanel({
  stats,
  variant = "grid",
  className,
}: {
  stats: CouponStats;
  variant?: Variant;
  className?: string;
}) {
  const items = [
    {
      label: "Total issued",
      value: stats.total,
      icon: Package,
      hint: "Coupons from your donations",
    },
    {
      label: "Pending dispatch",
      value: stats.issued,
      icon: Clock,
      hint: "Awaiting release to wallet",
    },
    {
      label: "Available",
      value: stats.available,
      icon: Ticket,
      hint: "Ready to use at checkout",
    },
    {
      label: "Used",
      value: stats.used,
      icon: CheckCircle2,
      hint: "Redeemed on bookings",
    },
  ];

  if (variant === "compact") {
    return (
      <div
        className={cn(
          "flex flex-wrap gap-2 text-xs",
          className
        )}
      >
        {items.map(({ label, value }) => (
          <span
            key={label}
            className="inline-flex items-center gap-1 rounded-full border border-champagne/30 bg-champagne/10 px-2.5 py-1 font-medium text-charcoal"
          >
            <span className="text-muted">{label}:</span>
            <span className="tabular-nums">{value}</span>
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-4 gap-3",
        className
      )}
    >
      {items.map(({ label, value, icon: Icon, hint }) => (
        <div
          key={label}
          className="card-surface rounded-lg border border-beige/80 px-3 py-3"
        >
          <div className="flex items-center gap-2 text-champagne mb-1">
            <Icon className="h-4 w-4 shrink-0" />
            <span className="text-[10px] font-bold uppercase tracking-wide text-muted">
              {label}
            </span>
          </div>
          <p className="font-display text-2xl text-charcoal tabular-nums">{value}</p>
          <p className="text-[10px] text-muted mt-0.5 leading-snug">{hint}</p>
        </div>
      ))}
    </div>
  );
}
