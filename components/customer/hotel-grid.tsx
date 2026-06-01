"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { HelpCircle, X, BookOpen } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useHotels } from "@/lib/hooks/use-hotels";
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

const PRICE_MIN = 800;
const PRICE_MAX = 5000;

export function HotelGrid() {
  const { t } = useAppLanguage();
  const { data: hotels = [], isLoading, error } = useHotels();
  const [helpOpen, setHelpOpen] = useState(false);
  const [showFloatButton, setShowFloatButton] = useState(false);

  const cities = useMemo(
    () => Array.from(new Set(hotels.map((h) => h.city))).sort(),
    [hotels]
  );
  const allAmenities = useMemo(
    () =>
      Array.from(new Set(hotels.flatMap((h) => h.amenities))) as AmenityTag[],
    [hotels]
  );

  const [city, setCity] = useState<string>("all");
  const [amenities, setAmenities] = useState<AmenityTag[]>([]);
  const [priceRange, setPriceRange] = useState([PRICE_MIN, PRICE_MAX]);
  const [donorOnly, setDonorOnly] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowFloatButton(window.scrollY > 450);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const filtered = useMemo(() => {
    return hotels.filter((h) => {
      if (city !== "all" && h.city !== city) return false;
      if (donorOnly && !h.hasDonorRooms) return false;
      if (h.startingPrice < priceRange[0] || h.startingPrice > priceRange[1])
        return false;
      if (amenities.length > 0 && !amenities.every((a) => h.amenities.includes(a)))
        return false;
      return true;
    });
  }, [hotels, city, amenities, priceRange, donorOnly]);

  const toggleAmenity = (a: AmenityTag) => {
    setAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  if (error) {
    return (
      <section id="hotels" className="py-12 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 text-center text-red-600">
          Could not load guest houses. Run{" "}
          <code className="text-sm">python manage.py seed_demo_hotels</code> and ensure the
          backend is running.
        </div>
      </section>
    );
  }

  return (
    <section id="hotels" className="py-12 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-8 md:mb-12 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="text-center md:text-left max-w-2xl mx-auto md:mx-0">
            <h2 className="font-display text-2xl md:text-4xl text-charcoal mb-2 md:mb-3 font-bold">
              Explore recommended community stays
            </h2>
            <p className="text-base md:text-lg text-charcoal/85 font-semibold leading-relaxed px-2 md:px-0">
              Compare simple, highly trusted temple guest houses and premium boutique hotels curated for Vysya families and spiritual pilgrims.
            </p>
          </div>
          <HelpTrigger
            onClick={() => setHelpOpen(true)}
            variant="header"
            className="shrink-0 self-center md:self-end max-lg:hidden"
          />
        </div>

        <div className="lg:hidden -mx-4 px-4 mb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
            <FilterPill
              active={city === "all" && !donorOnly}
              onClick={() => {
                setCity("all");
                setDonorOnly(false);
              }}
            >
              All
            </FilterPill>
            {cities.map((c) => (
              <FilterPill key={c} active={city === c} onClick={() => setCity(c)}>
                {c}
              </FilterPill>
            ))}
            <FilterPill active={donorOnly} onClick={() => setDonorOnly(!donorOnly)}>
              Donor Rooms
            </FilterPill>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          <aside className="hidden lg:block lg:w-64 shrink-0 space-y-6">
            <FilterBlock title="City">
              <Select value={city} onValueChange={setCity}>
                <SelectTrigger>
                  <SelectValue placeholder="All cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FilterBlock>

            <FilterBlock title="Price per night">
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

            <FilterBlock title="Amenities">
              <div className="flex flex-wrap gap-2">
                {allAmenities.map((a) => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => toggleAmenity(a)}
                    className={cn(
                      "text-sm font-semibold px-3 py-1.5 rounded-full border transition-colors min-h-9",
                      amenities.includes(a)
                        ? "border-champagne bg-champagne/15 text-champagne-dark"
                        : "border-charcoal/15 text-muted hover:border-charcoal/30"
                    )}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </FilterBlock>

            <div className="flex items-center justify-between">
              <Label htmlFor="donor-toggle" className="text-charcoal">
                Donor rooms only
              </Label>
              <Switch
                id="donor-toggle"
                checked={donorOnly}
                onCheckedChange={setDonorOnly}
              />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-4 md:mb-6 gap-3">
              <p className="text-sm text-muted">
                {isLoading
                  ? "Loading guest houses…"
                  : t("hotels.staysAvailable", { count: filtered.length })}
              </p>
              <HelpTrigger
                onClick={() => setHelpOpen(true)}
                variant="inline"
                className="lg:hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-4 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 pb-24 lg:pb-0">
              {filtered.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
              {filtered.length === 0 && !isLoading && (
                <p className="text-center text-muted py-12 col-span-full">
                  {t("hotels.noMatch")}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

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

      <div className="hidden lg:block fixed right-6 bottom-8 z-40">
        <HelpTrigger onClick={() => setHelpOpen(true)} variant="fab" />
      </div>

      <AnimatePresence>
        {helpOpen && (
          <>
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
              <div className="flex items-center justify-between border-b border-champagne/10 pb-4 mb-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-champagne/15 text-champagne-dark">
                    <HelpCircle className="h-5 w-5" />
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

              <div className="space-y-3.5 mb-6">
                <HelpStep
                  step={1}
                  title="Search Pilgrim Stays"
                  description="Select a holy city and dates in the search bar. Filter for family stays, budget options, or donor rooms."
                />
                <HelpStep
                  step={2}
                  title="Access Donor Privileges"
                  description="Sign in with your donor profile. Gold, Silver, and Bronze members unlock priority booking quotas and premium stays."
                />
                <HelpStep
                  step={3}
                  title="Perform Free Annadanam"
                  description="Support holy offerings during booking. Reserve free meals at Vasavi Annadanam dining halls through your reservation."
                />
              </div>

              <div className="flex flex-col gap-3">
                <Link href="/help" className="w-full" onClick={() => setHelpOpen(false)}>
                  <Button className="w-full rounded-full py-6 font-bold shadow-warm-md flex items-center justify-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Read Detailed Guide &amp; FAQs
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => setHelpOpen(false)}
                  className="w-full rounded-full py-6 font-bold border-beige text-charcoal hover:bg-surface"
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

function HelpStep({
  step,
  title,
  description,
}: {
  step: number;
  title: string;
  description: string;
}) {
  return (
    <div className="flex gap-4 rounded-2xl border border-beige bg-white p-4 shadow-warm-sm">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-champagne text-white text-sm font-bold shadow-warm">
        {step}
      </span>
      <div>
        <h4 className="font-bold text-charcoal text-sm">{title}</h4>
        <p className="text-xs font-semibold text-muted mt-1 leading-relaxed">{description}</p>
      </div>
    </div>
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
        "shrink-0 rounded-full px-4 py-2 text-sm font-semibold border transition-colors min-h-10",
        active
          ? "bg-charcoal text-white border-charcoal"
          : "bg-white text-charcoal border-charcoal/15 hover:border-charcoal/30"
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
      <h3 className="text-sm font-bold uppercase tracking-wide text-charcoal mb-3">{title}</h3>
      {children}
    </div>
  );
}
