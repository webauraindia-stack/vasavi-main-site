"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
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

const FIELD_H = "h-[3.25rem] min-h-[3.25rem] lg:h-[3.5rem] lg:min-h-[3.5rem]";

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
  const pathname = usePathname();
  const isSearchPage = pathname === "/search";

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

    setHotel(hotel);
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

  const hotelTriggerLabel = useMemo(() => {
    if (!hotelId) return allGuestHouses;
    if (variant === "hero" && !isDesktop) {
      const hotel = HOTELS.find((h) => h.id === hotelId);
      if (hotel) {
        const { city } = labelForHotel(hotel);
        return city;
      }
    }
    return hotelLabels.short;
  }, [hotelId, allGuestHouses, hotelLabels.short, variant, isDesktop, labelForHotel]);

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
    // Specific guest house selected → open that hotel's rooms
    if (hotelId) {
      const hotel = HOTELS.find((h) => h.id === hotelId);
      if (hotel) {
        const params = new URLSearchParams();
        params.set("adults", String(guests.adults));
        params.set("children", String(guests.children));
        params.set("rooms", String(guests.rooms));

        if (range?.from && range?.to) {
          if (isBefore(startOfDay(range.to), startOfDay(range.from))) {
            setDateHint(t("search.checkoutAfterCheckin"));
            setCalendarOpen(true);
            return;
          }
          setDateHint(null);
          setDates(range.from, range.to);
          params.set("checkIn", format(range.from, "yyyy-MM-dd"));
          params.set("checkOut", format(range.to, "yyyy-MM-dd"));
        } else {
          setDateHint(null);
        }

        const qs = params.toString();
        router.push(`/hotels/${hotel.slug}#rooms${qs ? `?${qs}` : ""}`);
        return;
      }
    }

    // No property selected — browse all locations
    if (!isSearchPage) {
      router.push("/search");
      return;
    }

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
    isDesktop ? "text-base lg:text-lg" : "text-base"
  );

  const renderHotelSelect = (isMobileUnified = false) => (
    <Select
      key={`hotel-select-${language}`}
      value={hotelId ?? "all"}
      onValueChange={(v) => setHotel(v === "all" ? null : v)}
    >
      <SelectTrigger
        iconClassName="text-champagne animate-arrow-pulse-blink"
        className={cn(
          isMobileUnified
            ? "w-full min-w-0 max-w-full cursor-pointer gap-2 px-3 py-3 font-semibold bg-transparent text-charcoal border-0 border-b border-charcoal/10 rounded-none shadow-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus:outline-none"
            : cn(fieldShell, "hover:border-champagne/35 focus:ring-champagne/30"),
          FIELD_H,
          "cursor-pointer gap-2 px-3.5 font-semibold min-w-0"
        )}
      >
        <MapPin className="h-4 w-4 shrink-0 text-champagne" aria-hidden />
        <span
          className="truncate text-left flex-1 min-w-0"
          title={hotelLabels.full}
        >
          {hotelTriggerLabel}
        </span>
      </SelectTrigger>
      <SelectContent
        className={cn(
          "max-h-[min(22rem,75dvh)] overflow-y-auto",
          // Mobile: span almost full viewport width, anchored left
          "w-[calc(100vw-2rem)] min-w-[16rem]",
          // Tablet+: auto-size to content, not pinned to narrow trigger
          "sm:w-auto sm:min-w-[18rem] sm:max-w-[min(28rem,90vw)]",
          variant === "hero" ? "z-[500]" : "z-[250]"
        )}
        position="popper"
        sideOffset={6}
      >
        <SelectItem value="all">
          <span className="text-sm font-semibold">{allGuestHouses}</span>
        </SelectItem>
        {HOTELS.map((h) => {
          const { name, city } = labelForHotel(h);
          return (
            <SelectItem key={h.id} value={h.id}>
              <span className="flex flex-col leading-tight py-0.5">
                <span className="text-sm font-semibold text-charcoal">{name}</span>
                <span className="text-xs font-medium text-muted">{city}</span>
              </span>
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  );

  const renderDatePicker = (isMobileUnified = false) => (
    <DateRangePickerField
      range={range}
      onRangeChange={handleRangeChange}
      open={calendarOpen}
      onOpenChange={setCalendarOpen}
      triggerClassName={cn(
        isMobileUnified
          ? "w-full min-w-0 max-w-full flex items-center gap-2 px-3 py-3 font-semibold bg-transparent text-charcoal border-0 border-b border-charcoal/10 rounded-none shadow-none focus:ring-0 focus-visible:ring-0 focus:ring-offset-0 focus:outline-none"
          : dateTriggerClass,
        FIELD_H
      )}
      numberOfMonths={isDesktop && variant !== "hero" ? 2 : 1}
      align={isDesktop && variant !== "hero" ? "start" : "center"}
    />
  );

  const renderGuestPanel = (isMobileUnified = false) => (
    <div
      className={cn(
        isMobileUnified
          ? "flex flex-col w-full divide-y divide-charcoal/10 bg-transparent border-0 rounded-none shadow-none"
          : cn(
              fieldShell,
              isDesktop && variant !== "hero"
                ? cn(FIELD_H, "flex shrink-0 items-stretch divide-x divide-charcoal/12")
                : "flex flex-col w-full divide-y divide-charcoal/10"
            )
      )}
    >
      <GuestStepper
        label={t("search.adults")}
        subLabel="Ages 13+"
        value={guests.adults}
        min={1}
        max={8}
        layout={isDesktop && variant !== "hero" ? "desktop" : "mobile"}
        onChange={(v) => setGuests({ adults: v })}
      />
      <GuestStepper
        label={t("search.children")}
        subLabel="Ages 2-12"
        value={guests.children}
        min={0}
        max={6}
        layout={isDesktop && variant !== "hero" ? "desktop" : "mobile"}
        onChange={(v) => setGuests({ children: v })}
      />
      <GuestStepper
        label={t("search.rooms")}
        subLabel="Max 5"
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
        "relative z-20 w-full min-w-0 max-w-full overflow-hidden rounded-[var(--radius-devotional)] p-2.5 sm:p-4",
        variant === "hero" ? "devotional-search" : "search-card gold-glow border border-charcoal/10 bg-white",
        className
      )}
    >
      {isDesktop && variant !== "hero" ? (
        <div className="flex items-stretch gap-2">
          <div className="flex flex-1 items-stretch gap-2">
            <div className={cn("min-w-0 flex-[1.15]", FIELD_H)}>{renderHotelSelect()}</div>
            <div className={cn("min-w-0 flex-1", FIELD_H)}>{renderDatePicker()}</div>
            {renderGuestPanel()}
          </div>
          {searchButton}
        </div>
      ) : variant === "hero" && isDesktop ? (
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2 grid grid-cols-2 gap-3">
            <div className="col-span-2">{renderHotelSelect()}</div>
            <div className="col-span-2">{renderDatePicker()}</div>
            <div className="col-span-2">{renderGuestPanel()}</div>
          </div>
          <div className="col-span-2">{searchButton}</div>
        </div>
      ) : (
        <div className="flex min-w-0 max-w-full flex-col gap-2.5">
          <div className="w-full min-w-0 max-w-full overflow-hidden rounded-xl border border-charcoal/12 bg-surface divide-y divide-charcoal/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
            {renderHotelSelect(true)}
            {renderDatePicker(true)}
            {renderGuestPanel(true)}
          </div>
          <div className="w-full min-w-0">{searchButton}</div>
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
  subLabel,
  value,
  min,
  max,
  layout,
  onChange,
}: {
  label: string;
  subLabel?: string;
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
    <div className="flex w-full min-w-0 max-w-full items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 bg-transparent">
      <div className="min-w-0 flex-1 pr-1 text-left">
        <span className="block text-sm lg:text-base font-bold text-charcoal/80 truncate">
          {label}
        </span>
        {subLabel && (
          <span className="block text-[0.6875rem] lg:text-xs font-semibold text-charcoal/50 truncate">
            {subLabel}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className={cn(
            stepBtn,
            "h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-charcoal/15 shadow-sm active:scale-95"
          )}
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 sm:w-6 text-center text-sm font-bold tabular-nums text-charcoal">
          {value}
        </span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className={cn(
            stepBtn,
            "h-8 w-8 sm:h-9 sm:w-9 rounded-full border border-charcoal/15 shadow-sm active:scale-95"
          )}
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
