import Fuse, { type FuseResult, type FuseResultMatch } from "fuse.js";
import type { Hotel } from "@/types";

// ─── Synonym map ────────────────────────────────────────────────────────────
// Maps common aliases / abbreviations to canonical search terms
const SYNONYMS: Record<string, string[]> = {
  hotel: ["guesthouse", "guest house", "stay", "residency", "retreat", "lodge"],
  restaurant: ["dining", "food", "kitchen", "annadanam", "prasadam", "satvik"],
  temple: ["mandir", "kovil", "devalayam", "shrine", "spiritual", "pooja"],
  wifi: ["internet", "broadband", "network"],
  pool: ["swimming", "water"],
  hyd: ["hyderabad"],
  hb: ["hyderabad"],
  vja: ["vijayawada"],
  vizag: ["visakhapatnam", "vishakhapatnam", "vishakapatnam"],
  blr: ["bengaluru", "bangalore"],
  mum: ["mumbai", "bombay"],
  che: ["chennai", "madras"],
  ap: ["andhra pradesh", "andhra"],
  ts: ["telangana"],
  ac: ["air conditioning", "air conditioned"],
  tv: ["television"],
  gym: ["fitness", "workout"],
  spa: ["wellness", "massage", "relaxation"],
  pilgrim: ["devotee", "spiritual", "religious", "sacred"],
  vip: ["donor", "premium", "exclusive"],
};

// ─── Build expanded query from synonyms ─────────────────────────────────────
export function expandQuery(raw: string): string {
  const lower = raw.toLowerCase().trim();
  const tokens = lower.split(/\s+/);
  const expanded = new Set<string>(tokens);
  for (const token of tokens) {
    for (const [key, vals] of Object.entries(SYNONYMS)) {
      if (token === key || vals.includes(token)) {
        expanded.add(key);
        vals.forEach((v) => expanded.add(v));
      }
    }
  }
  return Array.from(expanded).join(" ");
}

// ─── Flat searchable document ────────────────────────────────────────────────
export interface HotelDoc {
  id: string;
  slug: string;
  name: string;
  city: string;
  region: string;
  country: string;
  description: string;
  amenitiesText: string;   // "Temple View Restaurant Satsang Hall …"
  attractionsText: string; // "Charminar Birla Mandir …"
  tags: string;            // combined keyword bag
  startingPrice: number;
  overallRating: number;
  hasDonorRooms: boolean;
  starRating: number;
  // raw hotel reference for rendering
  hotel: Hotel;
}

function buildDocs(hotels: Hotel[]): HotelDoc[] {
  return hotels.map((h) => ({
    id: h.id,
    slug: h.slug,
    name: h.name,
    city: h.city,
    region: h.region,
    country: h.country,
    description: h.description,
    amenitiesText: h.amenities.join(" "),
    attractionsText: (h.nearbyAttractions ?? []).join(" "),
    tags: [
      h.name,
      h.city,
      h.region,
      h.country,
      ...h.amenities,
      ...(h.nearbyAttractions ?? []),
      h.hasDonorRooms ? "donor exclusive vip premium" : "",
    ]
      .join(" ")
      .toLowerCase(),
    startingPrice: h.startingPrice,
    overallRating: h.overallRating,
    hasDonorRooms: h.hasDonorRooms,
    starRating: h.starRating,
    hotel: h,
  }));
}

let catalogHotels: Hotel[] = [];
let fuse: Fuse<HotelDoc> | null = null;

const FUSE_OPTIONS = {
  includeScore: true,
  includeMatches: true,
  threshold: 0.45,
  ignoreLocation: true,
  distance: 200,
  minMatchCharLength: 2,
  useExtendedSearch: false,
  keys: [
    { name: "name", weight: 0.3 },
    { name: "city", weight: 0.25 },
    { name: "amenitiesText", weight: 0.15 },
    { name: "region", weight: 0.1 },
    { name: "description", weight: 0.08 },
    { name: "attractionsText", weight: 0.07 },
    { name: "tags", weight: 0.05 },
  ],
};

/** Rebuild the in-memory search index when the live hotel catalog loads. */
export function setSearchCatalog(hotels: Hotel[]): void {
  catalogHotels = hotels;
  fuse = hotels.length ? new Fuse(buildDocs(hotels), FUSE_OPTIONS) : null;
}

function getFuse(): Fuse<HotelDoc> {
  if (!fuse) {
    fuse = new Fuse(buildDocs(catalogHotels), FUSE_OPTIONS);
  }
  return fuse;
}

// ─── Search result types ─────────────────────────────────────────────────────
export interface SearchMatch {
  key: string;
  indices: readonly [number, number][];
  value: string;
}

export interface HotelSearchResult {
  hotel: Hotel;
  score: number;          // 0 (perfect) → 1 (worst)
  matches: SearchMatch[];
  isExact: boolean;
}

// ─── Main search function ────────────────────────────────────────────────────
export function searchHotels(rawQuery: string): HotelSearchResult[] {
  const docs = buildDocs(catalogHotels);
  if (!rawQuery.trim()) {
    return docs.map((d) => ({
      hotel: d.hotel,
      score: 0,
      matches: [],
      isExact: true,
    }));
  }

  const query = expandQuery(rawQuery);
  const results: FuseResult<HotelDoc>[] = getFuse().search(query);

  return results.map((r) => ({
    hotel: r.item.hotel,
    score: r.score ?? 1,
    matches: (r.matches ?? []).map((m: FuseResultMatch) => ({
      key: m.key ?? "",
      indices: m.indices as [number, number][],
      value: m.value ?? "",
    })),
    isExact: (r.score ?? 1) < 0.15,
  }));
}

// ─── "Did you mean?" suggestion ──────────────────────────────────────────────
// Returns the best alternate spelling suggestion when no exact match found
export function getDidYouMean(query: string, results: HotelSearchResult[]): string | null {
  if (!query.trim() || results.length === 0) return null;
  // If best result score is poor, suggest the matched field value as correction
  const best = results[0];
  if (best.score < 0.35) return null; // Good enough, no suggestion needed

  // Try to find the closest matching term from city/name matches
  const nameMatch = best.matches.find((m) => m.key === "name" || m.key === "city");
  if (nameMatch?.value) return nameMatch.value;
  return null;
}

// ─── Autocomplete suggestions ────────────────────────────────────────────────
// Returns up to `limit` label strings for the dropdown
export function getAutocompleteSuggestions(
  query: string,
  limit = 6
): { label: string; type: "city" | "hotel" | "amenity" }[] {
  if (query.trim().length < 1) return [];

  const q = query.toLowerCase().trim();
  const seen = new Set<string>();
  const suggestions: { label: string; type: "city" | "hotel" | "amenity" }[] = [];

  // Cities
  const cities = Array.from(new Set(catalogHotels.map((h) => h.city)));
  for (const city of cities) {
    if (city.toLowerCase().includes(q) || levenshtein(q, city.toLowerCase()) <= 2) {
      if (!seen.has(city)) {
        seen.add(city);
        suggestions.push({ label: city, type: "city" });
      }
    }
  }

  // Hotel names
  for (const h of catalogHotels) {
    if (
      h.name.toLowerCase().includes(q) ||
      levenshtein(q, h.name.toLowerCase().split(" ")[0]) <= 2
    ) {
      if (!seen.has(h.name)) {
        seen.add(h.name);
        suggestions.push({ label: h.name, type: "hotel" });
      }
    }
  }

  // Amenities
  const allAmenities = Array.from(new Set(catalogHotels.flatMap((h) => h.amenities)));
  for (const a of allAmenities) {
    if (a.toLowerCase().includes(q) || levenshtein(q, a.toLowerCase()) <= 2) {
      if (!seen.has(a)) {
        seen.add(a);
        suggestions.push({ label: a, type: "amenity" });
      }
    }
  }

  return suggestions.slice(0, limit);
}

// ─── Highlight helper ─────────────────────────────────────────────────────────
// Splits a string into segments: { text, highlight }[]
export interface TextSegment {
  text: string;
  highlight: boolean;
}

export function highlightMatches(
  text: string,
  indices: readonly [number, number][]
): TextSegment[] {
  if (!indices || indices.length === 0) return [{ text, highlight: false }];

  const segments: TextSegment[] = [];
  let cursor = 0;
  for (const [start, end] of indices) {
    if (start > cursor) segments.push({ text: text.slice(cursor, start), highlight: false });
    segments.push({ text: text.slice(start, end + 1), highlight: true });
    cursor = end + 1;
  }
  if (cursor < text.length) segments.push({ text: text.slice(cursor), highlight: false });
  return segments;
}

// ─── Levenshtein distance (small util for autocomplete) ──────────────────────
function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0))
  );
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] =
        a[i - 1] === b[j - 1]
          ? dp[i - 1][j - 1]
          : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}
