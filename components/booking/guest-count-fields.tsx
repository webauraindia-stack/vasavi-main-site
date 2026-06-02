"use client";

import { Minus, Plus } from "lucide-react";
import type { GuestCount } from "@/types";
import { cn } from "@/lib/utils";

type GuestCountFieldsProps = {
  value: Pick<GuestCount, "adults" | "children">;
  onChange: (next: Pick<GuestCount, "adults" | "children">) => void;
  maxTotal?: number;
  className?: string;
};

export function GuestCountFields({
  value,
  onChange,
  maxTotal = 20,
  className,
}: GuestCountFieldsProps) {
  const total = value.adults + value.children;

  const setAdults = (adults: number) => {
    const next = { ...value, adults };
    if (next.adults + next.children <= maxTotal) onChange(next);
    else onChange({ adults: Math.max(1, maxTotal - next.children), children: next.children });
  };

  const setChildren = (children: number) => {
    const next = { ...value, children };
    if (next.adults + next.children <= maxTotal) onChange(next);
    else onChange({ adults: next.adults, children: Math.max(0, maxTotal - next.adults) });
  };

  return (
    <div className={cn("space-y-3", className)}>
      <div className="grid gap-3 sm:grid-cols-2">
        <GuestStepper
          label="Adults"
          subLabel="Ages 13+"
          value={value.adults}
          min={1}
          max={Math.max(1, maxTotal - value.children)}
          onChange={setAdults}
        />
        <GuestStepper
          label="Children"
          subLabel="Ages 2–12"
          value={value.children}
          min={0}
          max={Math.max(0, maxTotal - value.adults)}
          onChange={setChildren}
        />
      </div>
      <p className="text-sm text-muted">
        Total guests:{" "}
        <span className="font-bold text-charcoal tabular-nums">{total}</span>
      </p>
    </div>
  );
}

function GuestStepper({
  label,
  subLabel,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  subLabel?: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  const stepBtn =
    "flex h-8 w-8 items-center justify-center rounded-md border border-charcoal/12 bg-white text-charcoal hover:border-champagne/40 hover:bg-champagne/5 disabled:opacity-35 disabled:pointer-events-none";

  return (
    <div className="flex items-center justify-between gap-3 rounded-xl border border-beige/50 bg-white/80 px-3 py-2.5">
      <div className="min-w-0">
        <p className="text-sm font-bold text-charcoal">{label}</p>
        {subLabel && <p className="text-[11px] text-muted">{subLabel}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          className={stepBtn}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-bold tabular-nums">{value}</span>
        <button
          type="button"
          className={stepBtn}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
