"use client";

import { useQuery } from "@tanstack/react-query";
import type { Hotel } from "@/types";

async function loadHotels(): Promise<Hotel[]> {
  const res = await fetch("/api/hotels", { cache: "no-store" });
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? "Could not load guest houses.");
  }
  return (await res.json()) as Hotel[];
}

export function useHotels() {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: loadHotels,
    staleTime: 60_000,
  });
}
