"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Sparkles, HelpCircle, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { HOTELS } from "@/lib/data/hotels";
import { HotelCard } from "@/components/customer/hotel-card";
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
  const [showFloatButton, setShowFloatButton] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Reveal the button only when scrolling past the hero header (450px)
      setShowFloatButton(window.scrollY > 450);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const [amenities, setAmenities] = useState<AmenityTag[]>([]);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [donorOnly, setDonorOnly] = useState(false);

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
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl text-charcoal font-black text-balance">
              {t("hotels.title")}
            </h2>
            <p className="mt-3 text-base md:text-lg lg:text-xl text-muted font-semibold leading-relaxed">
              {t("hotels.subtitle")}
            </p>
          </div>
          <HelpTrigger
            onClick={() => setHelpOpen(true)}
            variant="header"
            className="shrink-0 self-start md:self-end max-lg:hidden"
          />
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
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
              <p className="text-sm lg:text-lg font-bold text-muted">
                {t("hotels.staysAvailable", { count: filtered.length })}
              </p>
              <HelpTrigger
                onClick={() => setHelpOpen(true)}
                variant="inline"
                className="lg:hidden"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 auto-rows-fr pb-24 lg:pb-0">
              {filtered.map((hotel, index) => (
                <HotelCard
                  key={hotel.id}
                  hotel={hotel}
                  featured={index === 0 && featuredHotel?.id === hotel.id}
                />
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-muted py-16 col-span-full rounded-[var(--radius-devotional)] border border-dashed border-beige bg-white/70">
                  {t("hotels.noMatch")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: floating help after scroll */}
      <div
        className={cn(
          "lg:hidden fixed right-4 z-40 transition-all duration-300",
          "bottom-[max(5.25rem,calc(env(safe-area-inset-bottom)+4.25rem))]",
          showFloatButton
            ? "translate-y-0 opacity-100 pointer-events-auto"
            : "translate-y-12 opacity-0 pointer-events-none"
        )}
      >
        <HelpTrigger onClick={() => setHelpOpen(true)} variant="fab" />
      </div>

      {/* Desktop: always-visible floating help */}
      <div className="hidden lg:block fixed right-6 bottom-8 z-40">
        <HelpTrigger onClick={() => setHelpOpen(true)} variant="fab" />
      </div>

      <AnimatePresence>
        {helpOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[200] bg-charcoal/40 backdrop-blur-sm"
              onClick={() => setHelpOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.98 }}
              transition={{ type: "spring", damping: 26, stiffness: 280 }}
              className={cn(
                "fixed z-[201] bg-[#fffdf9] text-charcoal shadow-warm-lg overflow-y-auto",
                "inset-x-0 bottom-0 rounded-t-[2rem] border-t-2 border-champagne p-6 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] max-h-[85vh]",
                "lg:inset-auto lg:left-1/2 lg:top-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:bottom-auto lg:w-full lg:max-w-md lg:rounded-2xl lg:border lg:border-beige/80 lg:max-h-[min(90vh,40rem)]"
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between border-b border-champagne/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
                    <HelpCircle className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <h3 className="font-display text-lg font-black tracking-wide text-charcoal">
                      Pilgrim Support Desk
                    </h3>
                    <p className="text-[11px] font-bold text-muted uppercase tracking-wider mt-0.5">
                      Vasavi Stay Guide
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setHelpOpen(false)}
                  className="rounded-full bg-charcoal/5 p-2 text-muted hover:bg-charcoal/10 active:scale-95 transition-all"
                  aria-label="Close help"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Steps */}
              <div className="space-y-3.5 mb-6">
                <div className="flex gap-4 rounded-2xl border border-beige bg-white p-4 shadow-warm-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne text-white text-sm font-bold shadow-warm">
                    1
                  </span>
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">Search Pilgrim Stays</h4>
                    <p className="text-xs font-semibold text-muted mt-1 leading-relaxed">
                      Select a holy city and dates in the search bar. Easily filter for family stays, budget-friendly options, or amenities.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-2xl border border-beige bg-white p-4 shadow-warm-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne text-white text-sm font-bold shadow-warm">
                    2
                  </span>
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">Access Donor Privileges</h4>
                    <p className="text-xs font-semibold text-muted mt-1 leading-relaxed">
                      Sign in using your Donor credentials. Members (Gold, Silver, Bronze) unlock high-priority booking quotas and premium stays.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4 rounded-2xl border border-beige bg-white p-4 shadow-warm-sm">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne text-white text-sm font-bold shadow-warm">
                    3
                  </span>
                  <div>
                    <h4 className="font-bold text-charcoal text-sm">Perform Free Annadanam</h4>
                    <p className="text-xs font-semibold text-muted mt-1 leading-relaxed">
                      Support holy offerings during booking. Reserve free meals (lunch/dinner) at Vasavi Annadanam dining halls directly through your reservation.
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-3">
                <Link href="/help" className="w-full" onClick={() => setHelpOpen(false)}>
                  <Button className="w-full rounded-full py-6 font-bold shadow-warm-md flex items-center justify-center gap-2">
                    <BookOpen className="h-4.5 w-4.5" />
                    Read Detailed Guide & FAQs
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setHelpOpen(false)}
                  className="rounded-full py-6 font-bold border-beige text-charcoal hover:bg-surface"
                >
                  Got it, close
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

function HelpTrigger({
  onClick,
  variant,
  className,
}: {
  onClick: () => void;
  variant: "header" | "inline" | "fab";
  className?: string;
}) {
  const { t } = useAppLanguage();

  if (variant === "fab") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label={t("hotels.help")}
        className={cn(
          "inline-flex h-14 w-14 items-center justify-center rounded-full",
          "border-2 border-champagne-dark/30 bg-champagne text-white shadow-warm-lg ring-4 ring-white/80",
          "hover:bg-champagne/90 active:scale-95 transition-all",
          className
        )}
      >
        <HelpCircle className="h-6 w-6 stroke-[2.2]" aria-hidden />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t("hotels.help")}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all active:scale-95",
        variant === "header"
          ? "min-h-12 border border-champagne/35 bg-white px-5 text-sm text-charcoal shadow-warm-sm hover:bg-champagne/5"
          : "min-h-10 border border-champagne/30 bg-white px-4 text-sm text-charcoal hover:bg-champagne/5",
        className
      )}
    >
      <HelpCircle className="h-5 w-5 text-champagne shrink-0" aria-hidden />
      <span>{t("hotels.help")}</span>
    </button>
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
