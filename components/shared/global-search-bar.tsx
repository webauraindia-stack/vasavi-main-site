"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isBefore, startOfDay } from "date-fns";
import type { DateRange } from "react-day-picker";
import { Minus, Plus, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { DateRangePickerField } from "@/components/shared/date-range-picker-field";
import { HOTELS } from "@/lib/data/hotels";
import { normalizeStayDates } from "@/lib/date-range-selection";
import { parseGuestParams, parseSearchDate } from "@/lib/parse-search-params";
import { useSearchStore } from "@/stores/search-store";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import "react-day-picker/style.css";

interface GlobalSearchBarProps {
  className?: string;
  variant?: "hero" | "compact";
}

const FIELD_H = "h-[3.25rem] min-h-[3.25rem]";

function getHotelLabels(
  id: string | null,
  allLabel: string,
  labelFor: (hotel: (typeof HOTELS)[number]) => { name: string; city: string }
) {
  if (!id) {
    return { full: allLabel, short: allLabel };
  }
  const hotel = HOTELS.find((h) => h.id === id);
  if (!hotel) {
    return { full: allLabel, short: allLabel };
  }
  const { name, city } = labelFor(hotel);
  const shortName = name
    .replace(/^Sri\s+/i, "")
    .replace(/\s+(Residency|Stay|Grand|Hotel)$/i, "")
    .trim();
  return {
    full: `${name} — ${city}`,
    short: `${shortName} · ${city}`,
  };
}

export function GlobalSearchBar({ className, variant = "hero" }: GlobalSearchBarProps) {
  const { t, language } = useAppLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hotelId, checkIn, checkOut, guests, setHotel, setDates, setGuests } =
    useSearchStore();
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [dateHint, setDateHint] = useState<string | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const [range, setRange] = useState<DateRange | undefined>(() => ({
    from: checkIn ?? undefined,
    to: checkOut ?? undefined,
  }));

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Keep store in sync, but don't overwrite an in-progress range selection
  useEffect(() => {
    if (calendarOpen) return;
    setRange({
      from: checkIn ?? undefined,
      to: checkOut ?? undefined,
    });
  }, [checkIn, checkOut, calendarOpen]);

  // Sync from URL on /search (and when landing with query params)
  useEffect(() => {
    if (calendarOpen) return;

    const hotel = searchParams.get("hotel");
    const from = parseSearchDate(searchParams.get("checkIn"));
    const to = parseSearchDate(searchParams.get("checkOut"));

    if (hotel) setHotel(hotel);
    if (from) {
      const { checkIn: inDate, checkOut: outDate } = normalizeStayDates(from, to);
      setDates(inDate, outDate);
      setRange({ from: inDate, to: outDate });
    }

    const guestUpdates = parseGuestParams({
      adults: searchParams.get("adults"),
      children: searchParams.get("children"),
      rooms: searchParams.get("rooms"),
    });
    if (Object.keys(guestUpdates).length > 0) setGuests(guestUpdates);
  }, [searchParams, calendarOpen, setHotel, setDates, setGuests]);

  const allGuestHouses = t("search.allGuestHouses");

  const labelForHotel = useCallback(
    (hotel: (typeof HOTELS)[number]) => ({
      name: t(`hotels.${hotel.slug}.name`, { defaultValue: hotel.name }),
      city: t(`cities.${hotel.city}`, { defaultValue: hotel.city }),
    }),
    [t]
  );

  const hotelLabels = useMemo(
    () => getHotelLabels(hotelId, allGuestHouses, labelForHotel),
    [hotelId, allGuestHouses, labelForHotel]
  );

  const handleRangeChange = useCallback(
    (next: DateRange | undefined, complete: boolean) => {
      setDateHint(null);
      setRange(next);

      if (complete && next?.from && next?.to) {
        setDates(next.from, next.to);
        setCalendarOpen(false);
      }
    },
    [setDates]
  );

  const handleSearch = () => {
    if (!range?.from || !range?.to) {
      setDateHint(t("search.selectDates"));
      setCalendarOpen(true);
      return;
    }

    if (isBefore(startOfDay(range.to), startOfDay(range.from))) {
      setDateHint(t("search.checkoutAfterCheckin"));
      setCalendarOpen(true);
      return;
    }

    setDateHint(null);
    const params = new URLSearchParams();
    if (hotelId) params.set("hotel", hotelId);
    params.set("checkIn", format(range.from, "yyyy-MM-dd"));
    params.set("checkOut", format(range.to, "yyyy-MM-dd"));
    params.set("adults", String(guests.adults));
    params.set("children", String(guests.children));
    params.set("rooms", String(guests.rooms));
    setDates(range.from, range.to);
    router.push(`/search?${params.toString()}`);
  };

  const fieldShell =
    "rounded-xl border border-charcoal/12 bg-surface text-charcoal shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]";

  const dateTriggerClass = cn(
    fieldShell,
    FIELD_H,
    "flex w-full items-center gap-2.5 px-3.5 font-semibold hover:border-champagne/35 transition-colors",
    isDesktop ? "text-[0.9375rem]" : "text-base"
  );

  const hotelSelect = (
    <Select
      key={`hotel-select-${language}`}
      value={hotelId ?? "all"}
      onValueChange={(v) => setHotel(v === "all" ? null : v)}
    >
      <SelectTrigger
        className={cn(
          fieldShell,
          FIELD_H,
          "w-full cursor-pointer gap-2 px-3.5 font-semibold hover:border-champagne/35 focus:ring-champagne/30",
          "[&>svg:last-child]:h-4 [&>svg:last-child]:w-4 [&>svg:last-child]:shrink-0 [&>svg:last-child]:text-charcoal/55"
        )}
      >
        <MapPin className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
        <span
          className="truncate text-left flex-1 min-w-0"
          title={hotelLabels.full}
        >
          {hotelId ? hotelLabels.short : allGuestHouses}
        </span>
      </SelectTrigger>
      <SelectContent
        className={cn(
          "max-h-[min(20rem,70dvh)]",
          variant === "hero" ? "z-[500]" : "z-[250]"
        )}
      >
        <SelectItem value="all">{allGuestHouses}</SelectItem>
        {HOTELS.map((h) => {
          const { name, city } = labelForHotel(h);
          return (
            <SelectItem key={h.id} value={h.id}>
              {name} — {city}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );

  const datePicker = (
    <DateRangePickerField
      range={range}
      onRangeChange={handleRangeChange}
      open={calendarOpen}
      onOpenChange={setCalendarOpen}
      triggerClassName={dateTriggerClass}
      numberOfMonths={isDesktop && variant !== "hero" ? 2 : 1}
      align={isDesktop && variant !== "hero" ? "start" : "center"}
    />
  );

  const guestPanel = (
    <div
      className={cn(
        fieldShell,
        isDesktop && variant !== "hero"
          ? cn(FIELD_H, "flex shrink-0 items-stretch divide-x divide-charcoal/12")
          : "grid grid-cols-3 gap-1 p-3"
      )}
    >
      <GuestStepper
        label={t("search.adults")}
        value={guests.adults}
        min={1}
        max={8}
        layout={isDesktop && variant !== "hero" ? "desktop" : "mobile"}
        onChange={(v) => setGuests({ adults: v })}
      />
      <GuestStepper
        label={t("search.children")}
        value={guests.children}
        min={0}
        max={6}
        layout={isDesktop && variant !== "hero" ? "desktop" : "mobile"}
        onChange={(v) => setGuests({ children: v })}
      />
      <GuestStepper
        label={t("search.rooms")}
        value={guests.rooms}
        min={1}
        max={5}
        layout={isDesktop && variant !== "hero" ? "desktop" : "mobile"}
        onChange={(v) => setGuests({ rooms: v })}
      />
    </div>
  );

  const searchButton = (
    <Button
      type="button"
      onClick={handleSearch}
      size={isDesktop ? "default" : "lg"}
      className={cn(
        FIELD_H,
        "rounded-xl font-bold shadow-warm bg-champagne hover:bg-champagne/90 text-white",
        variant === "hero" && "sm:rounded-2xl",
        isDesktop && variant !== "hero" ? "shrink-0 px-7 text-base" : "w-full"
      )}
    >
      <Search className="h-4 w-4 mr-2 shrink-0" />
      {t("search.searchRooms")}
    </Button>
  );

  return (
    <div
      className={cn(
        "relative z-20 w-full rounded-[var(--radius-devotional)] p-3 sm:p-4",
        variant === "hero" ? "devotional-search max-w-none" : "search-card gold-glow border border-charcoal/10 bg-white",
        className
      )}
    >
      {isDesktop && variant !== "hero" ? (
        <div className="flex items-stretch gap-2">
          <div className={cn("min-w-0 flex-[1.15]", FIELD_H)}>{hotelSelect}</div>
          <div className={cn("min-w-0 flex-1", FIELD_H)}>{datePicker}</div>
          {guestPanel}
          {searchButton}
        </div>
      ) : variant === "hero" && isDesktop ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">{hotelSelect}</div>
          <div className="col-span-2">{datePicker}</div>
          <div className="col-span-2">{guestPanel}</div>
          <div className="col-span-2">{searchButton}</div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {hotelSelect}
          {datePicker}
          {guestPanel}
          {searchButton}
        </div>
      )}

      {dateHint && (
        <p
          className="mt-2 text-center text-sm font-semibold text-champagne lg:text-left"
          role="alert"
        >
          {dateHint}
        </p>
      )}
    </div>
  );
}

function GuestStepper({
  label,
  value,
  min,
  max,
  layout,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  layout: "desktop" | "mobile";
  onChange: (v: number) => void;
}) {
  const { t } = useAppLanguage();
  const stepBtn =
    "flex items-center justify-center rounded-md border border-charcoal/12 bg-white text-charcoal hover:border-champagne/40 hover:bg-champagne/5 disabled:opacity-35 disabled:pointer-events-none transition-colors";

  if (layout === "desktop") {
    return (
      <div className="flex min-w-[6.25rem] flex-col items-center justify-center gap-1 px-3 py-2">
        <span className="text-[0.625rem] font-bold uppercase tracking-wider text-charcoal/65">
          {label}
        </span>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onChange(Math.max(min, value - 1))}
            disabled={value <= min}
            className={cn(stepBtn, "h-7 w-7")}
            aria-label={t("search.decrease", { label })}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-5 text-center text-sm font-bold tabular-nums text-charcoal">
            {value}
          </span>
          <button
            type="button"
            onClick={() => onChange(Math.min(max, value + 1))}
            disabled={value >= max}
            className={cn(stepBtn, "h-7 w-7")}
            aria-label={t("search.increase", { label })}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 px-1">
      <span className="text-[0.625rem] font-bold uppercase tracking-wider text-charcoal/70">
        {label}
      </span>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={cn(stepBtn, "h-9 w-9")}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-6 text-center text-sm font-bold tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={cn(stepBtn, "h-9 w-9")}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
