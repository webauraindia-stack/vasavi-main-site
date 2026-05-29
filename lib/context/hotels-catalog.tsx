"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useHotels } from "@/lib/hooks/use-hotels";
import type { Hotel } from "@/types";

type HotelsCatalogValue = {
  hotels: Hotel[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

const HotelsCatalogContext = createContext<HotelsCatalogValue | null>(null);

export function HotelsCatalogProvider({ children }: { children: ReactNode }) {
  const { data = [], isLoading, isError, error } = useHotels();
  return (
    <HotelsCatalogContext.Provider
      value={{
        hotels: data,
        isLoading,
        isError,
        error: error as Error | null,
      }}
    >
      {children}
    </HotelsCatalogContext.Provider>
  );
}

export function useHotelsCatalog(): HotelsCatalogValue {
  const ctx = useContext(HotelsCatalogContext);
  if (ctx) return ctx;
  const { data = [], isLoading, isError, error } = useHotels();
  return {
    hotels: data,
    isLoading,
    isError,
    error: error as Error | null,
  };
}
