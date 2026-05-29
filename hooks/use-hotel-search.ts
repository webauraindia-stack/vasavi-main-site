"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  searchHotels,
  getDidYouMean,
  getAutocompleteSuggestions,
  type HotelSearchResult,
} from "@/lib/fuzzy-search";
import { useHotelsCatalog } from "@/lib/context/hotels-catalog";
import { setSearchCatalog } from "@/lib/fuzzy-search";
import type { AmenityTag, Hotel } from "@/types";

export interface UseHotelSearchOptions {
  debounceMs?: number;
  selectedCity?: string;
  selectedAmenity?: AmenityTag | null;
}

export interface UseHotelSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  debouncedQuery: string;
  results: Hotel[];
  rankedResults: HotelSearchResult[];
  didYouMean: string | null;
  suggestions: { label: string; type: "city" | "hotel" | "amenity" }[];
  isSearching: boolean;
  hasQuery: boolean;
  totalCount: number;
  applysuggestion: (label: string) => void;
}

export function useHotelSearch({
  debounceMs = 180,
  selectedCity = "All Cities",
  selectedAmenity = null,
}: UseHotelSearchOptions = {}): UseHotelSearchReturn {
  const { hotels } = useHotelsCatalog();

  useEffect(() => {
    if (hotels.length > 0) setSearchCatalog(hotels);
  }, [hotels]);

  const [query, setQueryRaw] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const setQuery = useCallback((q: string) => {
    setQueryRaw(q);
    setIsSearching(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setDebouncedQuery(q);
      setIsSearching(false);
    }, debounceMs);
  }, [debounceMs]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  // Run fuzzy search
  const rawResults = useMemo(
    () => searchHotels(debouncedQuery),
    [debouncedQuery]
  );

  // Apply city + amenity filters on top of fuzzy results
  const rankedResults = useMemo(() => {
    return rawResults.filter((r) => {
      if (selectedCity !== "All Cities" && r.hotel.city !== selectedCity) return false;
      if (selectedAmenity && !r.hotel.amenities.includes(selectedAmenity)) return false;
      return true;
    });
  }, [rawResults, selectedCity, selectedAmenity]);

  const results = useMemo(
    () => rankedResults.map((r) => r.hotel),
    [rankedResults]
  );

  const didYouMean = useMemo(
    () => (debouncedQuery.trim() ? getDidYouMean(debouncedQuery, rawResults) : null),
    [debouncedQuery, rawResults]
  );

  const suggestions = useMemo(
    () => (query.trim().length >= 1 ? getAutocompleteSuggestions(query) : []),
    [query]
  );

  const applysuggestion = useCallback((label: string) => {
    setQueryRaw(label);
    setDebouncedQuery(label);
    setIsSearching(false);
  }, []);

  return {
    query,
    setQuery,
    debouncedQuery,
    results,
    rankedResults,
    didYouMean,
    suggestions,
    isSearching,
    hasQuery: debouncedQuery.trim().length > 0,
    totalCount: results.length,
    applysuggestion,
  };
}
