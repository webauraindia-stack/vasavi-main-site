"use client";

import { Suspense, useCallback, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { SearchSkeleton } from "@/components/customer/skeletons";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { Crown, Search, MapPin, Star, X, Loader2, Lightbulb, Tag } from "lucide-react";
import { HOTELS, getRoomsForHotel } from "@/lib/data/hotels";
import { useHotelSearch } from "@/hooks/use-hotel-search";
import { highlightMatches, type HotelSearchResult } from "@/lib/fuzzy-search";
import type { AmenityTag } from "@/types";

const CITIES = ["All Cities", ...Array.from(new Set(HOTELS.map((h) => h.city))).sort()];

const HOTEL_ROOM_SUMMARY: Record<
  string,
  { label: string; count: number; from: number; isDonor?: boolean }[]
> = {};
for (const hotel of HOTELS) {
  const rooms = getRoomsForHotel(hotel.id);
  const groups: Record<string, { count: number; minPrice: number; isDonor: boolean }> = {};
  for (const room of rooms) {
    const key = room.isDonorExclusive ? "Donor" : room.category;
    if (!groups[key]) groups[key] = { count: 0, minPrice: Infinity, isDonor: room.isDonorExclusive };
    groups[key].count++;
    groups[key].minPrice = Math.min(groups[key].minPrice, room.pricePerNight);
  }
  HOTEL_ROOM_SUMMARY[hotel.id] = Object.entries(groups).map(([label, v]) => ({
    label,
    count: v.count,
    from: v.minPrice,
    isDonor: v.isDonor,
  }));
}

function HighlightedText({
  text,
  indices,
  className,
}: {
  text: string;
  indices?: readonly [number, number][];
  className?: string;
}) {
  if (!indices?.length) return <span className={className}>{text}</span>;
  const segments = highlightMatches(text, indices);
  return (
    <span className={className}>
      {segments.map((seg, i) =>
        seg.highlight ? (
          <mark key={i} className="bg-champagne/20 text-champagne-dark font-black rounded-sm px-0.5 not-italic">
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </span>
  );
}

function HotelResultCard({
  result,
  selectedCity,
  selectedAmenity,
  onCityClick,
  onAmenityClick,
}: {
  result: HotelSearchResult;
  selectedCity: string;
  selectedAmenity: AmenityTag | null;
  onCityClick: (city: string) => void;
  onAmenityClick: (a: AmenityTag) => void;
}) {
  const hotel = result.hotel;
  const nameMatch = result.matches.find((m) => m.key === "name");
  const cityMatch = result.matches.find((m) => m.key === "city");

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl bg-white border border-charcoal/10 shadow-warm hover:border-champagne/30 hover:shadow-warm-md hover:-translate-y-0.5 transition-all duration-300">
      {result.score > 0 && result.score < 0.45 && !result.isExact && (
        <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1 bg-black/60 text-white text-[9px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full backdrop-blur-sm">
          ~{Math.round((1 - result.score) * 100)}% match
        </div>
      )}

      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={hotel.thumbnail}
          alt={hotel.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
        />
        {hotel.hasDonorRooms && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-champagne-dark/90 text-white text-[10px] font-black uppercase tracking-wide px-2 py-1 rounded-full shadow">
            <Crown className="h-3 w-3" />
            Donor
          </div>
        )}
      </div>

      <div className="flex flex-col gap-1.5 p-3.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <button
              type="button"
              onClick={() => onCityClick(hotel.city)}
              className={cn(
                "text-[0.625rem] font-black uppercase tracking-[0.12em] transition-colors hover:underline",
                selectedCity === hotel.city ? "text-champagne-dark" : "text-champagne"
              )}
            >
              <MapPin className="inline h-2.5 w-2.5 mr-0.5 -mt-0.5" />
              <HighlightedText text={`${hotel.city}, ${hotel.region}`} indices={cityMatch?.indices} />
            </button>
            <h3 className="font-display text-sm font-bold text-charcoal leading-snug mt-0.5 line-clamp-2">
              <HighlightedText text={hotel.name} indices={nameMatch?.indices} />
            </h3>
          </div>
          <div className="flex items-center gap-0.5 shrink-0 mt-0.5">
            <Star className="h-3.5 w-3.5 fill-champagne-dark text-champagne-dark" />
            <span className="text-xs font-bold text-charcoal">{hotel.overallRating}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1">
          {hotel.amenities.slice(0, 3).map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onAmenityClick(a)}
              className={cn(
                "rounded-full border px-2 py-0.5 text-[10px] font-semibold transition-all active:scale-95",
                selectedAmenity === a
                  ? "bg-champagne border-champagne text-white shadow-sm"
                  : "bg-surface border-beige/70 text-muted hover:border-champagne/40 hover:text-champagne"
              )}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-1.5 pt-2 border-t border-beige/50">
          {(HOTEL_ROOM_SUMMARY[hotel.id] ?? []).map((cat) => (
            <div
              key={cat.label}
              className={cn(
                "flex flex-col rounded-lg border px-2 py-1 text-center min-w-[3.5rem]",
                cat.isDonor ? "border-champagne-dark/30 bg-champagne-dark/5" : "border-charcoal/10 bg-surface"
              )}
            >
              <span className={cn("text-[9px] font-black uppercase tracking-wide", cat.isDonor ? "text-champagne-dark" : "text-charcoal/60")}>
                {cat.label}
              </span>
              <span className="text-xs font-black text-charcoal">{cat.count} room{cat.count !== 1 ? "s" : ""}</span>
              <span className="text-[9px] font-semibold text-muted">from {formatCurrency(cat.from)}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between pt-1">
          <Link href={`/hotels/${hotel.slug}`} className="text-[10px] font-bold text-champagne hover:underline">
            View details →
          </Link>
          <Link
            href={`/hotels/${hotel.slug}`}
            className="rounded-lg px-3 py-1.5 text-[10px] font-black bg-champagne text-white hover:bg-champagne/90 transition-all"
          >
            Book Rooms →
          </Link>
        </div>
      </div>
    </article>
  );
}

function SearchPageContent() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [selectedAmenity, setSelectedAmenity] = useState<AmenityTag | null>(null);

  const {
    query,
    setQuery,
    results: filteredHotels,
    rankedResults,
    didYouMean,
    suggestions,
    isSearching,
    hasQuery,
    applysuggestion,
  } = useHotelSearch({ selectedCity, selectedAmenity });

  const handleAmenityClick = useCallback((amenity: AmenityTag) => {
    setSelectedAmenity((prev) => (prev === amenity ? null : amenity));
  }, []);

  const handleCityClick = useCallback((city: string) => {
    setSelectedCity((prev) => (prev === city ? "All Cities" : city));
  }, []);

  const hasActiveFilters = selectedCity !== "All Cities" || selectedAmenity !== null;

  return (
    <div className="pt-20 pb-20 bg-surface min-h-screen">
      <div className="page-container space-y-6">
        <div>
          <p className="text-label text-champagne mb-1">Direct Access</p>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-charcoal">
            All Guest House Locations
          </h1>
          <p className="text-sm font-semibold text-muted mt-0.5">
            {HOTELS.length} properties across India — type to search
          </p>
        </div>

        {/* Text search only */}
        <div className="relative">
          <input
            ref={inputRef}
            type="search"
            autoFocus
            placeholder="Search by name, city, amenity… (typos OK)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            className="w-full h-12 pl-11 pr-10 rounded-xl border border-charcoal/15 bg-white text-charcoal font-semibold focus:outline-none focus:ring-2 focus:ring-champagne/40 focus:border-transparent placeholder:text-charcoal/40 shadow-sm"
          />
          {isSearching ? (
            <Loader2 className="absolute left-3.5 top-3.5 h-5 w-5 text-champagne animate-spin" />
          ) : (
            <Search className="absolute left-3.5 top-3.5 h-5 w-5 text-champagne pointer-events-none" />
          )}
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(""); inputRef.current?.focus(); }}
              className="absolute right-3.5 top-3.5 text-charcoal/40 hover:text-charcoal"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {showSuggestions && suggestions.length > 0 && query.trim() && (
            <div className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-xl border border-charcoal/12 bg-white shadow-warm-lg overflow-hidden">
              <p className="px-3 pt-2.5 pb-1 text-[10px] font-black uppercase tracking-wider text-muted">Suggestions</p>
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={() => {
                    applysuggestion(s.label);
                    if (s.type === "city") setSelectedCity(s.label);
                    if (s.type === "amenity") setSelectedAmenity(s.label as AmenityTag);
                  }}
                  className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left text-sm font-semibold text-charcoal hover:bg-champagne/5 border-t border-beige/40 first:border-t-0"
                >
                  {s.type === "city" && <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne" />}
                  {s.type === "hotel" && <Star className="h-3.5 w-3.5 shrink-0 text-champagne" />}
                  {s.type === "amenity" && <Tag className="h-3.5 w-3.5 shrink-0 text-champagne" />}
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {didYouMean && hasQuery && (
          <div className="flex items-center gap-2 text-sm">
            <Lightbulb className="h-4 w-4 text-champagne-dark shrink-0" />
            <span className="text-muted font-semibold">Did you mean:</span>
            <button type="button" onClick={() => applysuggestion(didYouMean)} className="font-bold text-champagne underline underline-offset-2">
              &ldquo;{didYouMean}&rdquo;
            </button>
          </div>
        )}

        {/* City pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CITIES.map((city) => (
            <button
              key={city}
              type="button"
              onClick={() => (city === "All Cities" ? setSelectedCity("All Cities") : handleCityClick(city))}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-xs font-bold transition-all",
                selectedCity === city
                  ? "border-champagne bg-champagne text-white shadow-sm"
                  : "border-charcoal/15 bg-white text-charcoal hover:border-champagne/40"
              )}
            >
              {city}
            </button>
          ))}
        </div>

        {(hasActiveFilters || hasQuery) && (
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-muted uppercase tracking-wider">Active:</span>
            {hasQuery && <span className="rounded-full bg-charcoal/6 px-3 py-1 font-bold">&ldquo;{query}&rdquo;</span>}
            {selectedCity !== "All Cities" && (
              <button type="button" onClick={() => setSelectedCity("All Cities")} className="inline-flex items-center gap-1 rounded-full bg-champagne/10 border border-champagne/30 px-3 py-1 font-bold text-champagne">
                {selectedCity} <X className="h-3 w-3" />
              </button>
            )}
            {selectedAmenity && (
              <button type="button" onClick={() => setSelectedAmenity(null)} className="inline-flex items-center gap-1 rounded-full bg-champagne/10 border border-champagne/30 px-3 py-1 font-bold text-champagne">
                {selectedAmenity} <X className="h-3 w-3" />
              </button>
            )}
            <button
              type="button"
              onClick={() => { setQuery(""); setSelectedCity("All Cities"); setSelectedAmenity(null); }}
              className="font-bold text-muted underline underline-offset-2"
            >
              Clear all
            </button>
            <span className="ml-auto font-semibold text-muted">{filteredHotels.length} locations</span>
          </div>
        )}

        {filteredHotels.length === 0 ? (
          <div className="text-center py-14 card-surface">
            <MapPin className="h-10 w-10 text-champagne/40 mx-auto mb-3" />
            <p className="font-display text-lg text-charcoal">No locations found</p>
            <Button variant="outline" className="mt-4" onClick={() => { setQuery(""); setSelectedCity("All Cities"); setSelectedAmenity(null); }}>
              Show all locations
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {rankedResults.map((result) => (
              <HotelResultCard
                key={result.hotel.id}
                result={result}
                selectedCity={selectedCity}
                selectedAmenity={selectedAmenity}
                onCityClick={handleCityClick}
                onAmenityClick={handleAmenityClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}
