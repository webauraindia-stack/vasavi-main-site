"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { LayoutGrid, Map, Sparkles } from "lucide-react";
import { HOTELS } from "@/lib/data/hotels";
import { HotelCard } from "@/components/customer/hotel-card";
import { HotelMap } from "@/components/customer/hotel-map";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AmenityTag } from "@/types";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";

const CITIES = Array.from(new Set(HOTELS.map((h) => h.city))).sort();
const ALL_AMENITIES = Array.from(
  new Set(HOTELS.flatMap((h) => h.amenities))
) as AmenityTag[];

const PRICE_MIN = 800;
const PRICE_MAX = 5000;

export function HotelGrid() {
  const { t } = useAppLanguage();
  const [city, setCity] = useState<string>("all");
  const [amenities, setAmenities] = useState<AmenityTag[]>([]);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [donorOnly, setDonorOnly] = useState(false);
  const [view, setView] = useState<"grid" | "map">("grid");
  const [highlightId, setHighlightId] = useState<string | undefined>();

  const filtered = useMemo(() => {
    return HOTELS.filter((h) => {
      if (city !== "all" && h.city !== city) return false;
      if (donorOnly && !h.hasDonorRooms) return false;
      if (h.startingPrice < priceRange[0] || h.startingPrice > priceRange[1])
        return false;
      if (amenities.length > 0 && !amenities.every((a) => h.amenities.includes(a)))
        return false;
      return true;
    });
  }, [city, amenities, priceRange, donorOnly]);

  const toggleAmenity = (a: AmenityTag) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  const featuredHotel = filtered[0];

  return (
    <section id="hotels" className="section-shell devotional-gradient py-14 md:py-24">
      <div className="page-container relative">
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2 text-label text-champagne mb-3">
              <Sparkles className="h-3.5 w-3.5 text-champagne-dark" />
              {t("hotels.eyebrow")}
            </span>
            <h2 className="font-display text-3xl md:text-5xl text-charcoal font-black text-balance">
              {t("hotels.title")}
            </h2>
            <p className="mt-3 text-base md:text-lg text-muted font-semibold leading-relaxed">
              {t("hotels.subtitle")}
            </p>
          </div>
          <Link href="/search">
            <Button size="lg" className="rounded-full px-6 shadow-warm-md">
              {t("hotels.openFullSearch")}
            </Button>
          </Link>
        </div>

        <div className="lg:hidden mb-5 overflow-x-auto scrollbar-hide">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <FilterPill
              active={city === "all" && !donorOnly}
              onClick={() => {
                setCity("all");
                setDonorOnly(false);
              }}
            >
              {t("common.all")}
            </FilterPill>
            {CITIES.map((c) => (
              <FilterPill key={c} active={city === c} onClick={() => setCity(c)}>
                {t(`cities.${c}`, { defaultValue: c })}
              </FilterPill>
            ))}
            <FilterPill active={donorOnly} onClick={() => setDonorOnly(!donorOnly)}>
              {t("hotels.donorRooms")}
            </FilterPill>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:w-72 shrink-0">
            <div className="sticky top-24 space-y-6 rounded-[var(--radius-devotional)] border border-beige/70 bg-white/90 p-5 shadow-warm-md backdrop-blur-sm">
              <FilterBlock title={t("hotels.city")}>
                <Select value={city} onValueChange={setCity}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("search.allGuestHouses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("search.allGuestHouses")}</SelectItem>
                    {CITIES.map((c) => (
                      <SelectItem key={c} value={c}>
                        {t(`cities.${c}`, { defaultValue: c })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FilterBlock>

              <FilterBlock title={t("hotels.pricePerNight")}>
                <Slider
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step={500}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-4"
                />
                <p className="text-sm font-semibold text-charcoal/80 mt-2">
                  ₹{priceRange[0].toLocaleString()} – ₹{priceRange[1].toLocaleString()}
                </p>
              </FilterBlock>

              <FilterBlock title={t("hotels.amenities")}>
                <div className="flex flex-wrap gap-2">
                  {ALL_AMENITIES.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => toggleAmenity(a)}
                      className={cn(
                        "text-xs font-bold px-3 py-1.5 rounded-full border transition-colors min-h-9",
                        amenities.includes(a)
                          ? "border-champagne bg-champagne text-white"
                          : "border-charcoal/15 text-muted hover:border-champagne/40"
                      )}
                    >
                      {t(`amenities.${a}`)}
                    </button>
                  ))}
                </div>
              </FilterBlock>

              <div className="flex items-center justify-between rounded-xl bg-surface px-3 py-2.5">
                <Label htmlFor="donor-toggle" className="text-charcoal text-sm">
                  {t("hotels.donorRoomsOnly")}
                </Label>
                <Switch
                  id="donor-toggle"
                  checked={donorOnly}
                  onCheckedChange={setDonorOnly}
                />
              </div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 md:mb-6">
              <p className="text-sm font-bold text-muted">
                {t("hotels.staysAvailable", { count: filtered.length })}
              </p>
              <div className="hidden lg:flex gap-1 rounded-full border border-beige bg-white p-1 shadow-warm">
                <Button
                  variant={view === "grid" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setView("grid")}
                  aria-label={t("hotels.showGrid")}
                >
                  <LayoutGrid className="h-4 w-4" />
                </Button>
                <Button
                  variant={view === "map" ? "default" : "ghost"}
                  size="sm"
                  className="rounded-full"
                  onClick={() => setView("map")}
                  aria-label={t("hotels.showMap")}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {view === "grid" ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 auto-rows-fr pb-24 lg:pb-0">
                {filtered.map((hotel, index) => (
                  <HotelCard
                    key={hotel.id}
                    hotel={hotel}
                    featured={index === 0 && featuredHotel?.id === hotel.id}
                    className={highlightId === hotel.id ? "ring-2 ring-champagne-dark" : ""}
                  />
                ))}
                {filtered.length === 0 && (
                  <p className="text-center text-muted py-16 col-span-full rounded-[var(--radius-devotional)] border border-dashed border-beige bg-white/70">
                    {t("hotels.noMatch")}
                  </p>
                )}
              </div>
            ) : (
              <HotelMap
                hotels={filtered}
                selectedId={highlightId}
                onSelect={setHighlightId}
                className="h-[60dvh] lg:h-[520px] rounded-[var(--radius-devotional)] overflow-hidden border border-beige/70 shadow-warm-md"
              />
            )}
          </div>
        </div>
      </div>

      <Button
        size="icon"
        className="fixed bottom-[max(1.25rem,env(safe-area-inset-bottom))] right-4 z-40 h-14 w-14 rounded-full border-2 border-champagne-dark/30 bg-champagne text-white shadow-warm-lg ring-4 ring-white/80 lg:hidden"
        onClick={() => setView(view === "map" ? "grid" : "map")}
        aria-label={view === "map" ? t("hotels.showGrid") : t("hotels.showMap")}
      >
        {view === "map" ? <LayoutGrid className="h-5 w-5" /> : <Map className="h-5 w-5" />}
      </Button>

      {view === "map" && (
        <div className="fixed inset-x-0 bottom-0 top-16 z-30 bg-white lg:hidden">
          <HotelMap
            hotels={filtered}
            selectedId={highlightId}
            onSelect={setHighlightId}
            className="h-full rounded-none border-0"
          />
        </div>
      )}
    </section>
  );
}

function FilterPill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 rounded-full px-4 py-2 text-sm font-bold border transition-all min-h-10",
        active
          ? "bg-champagne text-white border-champagne shadow-warm"
          : "bg-white text-charcoal border-beige hover:border-champagne/40"
      )}
    >
      {children}
    </button>
  );
}

function FilterBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-label text-charcoal mb-3">{title}</h3>
      {children}
    </div>
  );
}
