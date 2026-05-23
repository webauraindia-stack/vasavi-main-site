/**
 * Hotel catalog loaded from Django branches API (no static mock catalog).
 */

import { fetchBranches, type BackendBranch } from "@/lib/api/branches";
import type { AmenityTag, Hotel } from "@/types";

import { DEFAULT_BRANCH_HERO } from "@/lib/images/hotel-images";

const DEFAULT_AMENITIES: AmenityTag[] = ["WiFi", "Parking", "Temple Transport"];

function slugifyBranch(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function mapBranchToHotel(branch: BackendBranch): Hotel {
  const slug = slugifyBranch(branch.name);
  const description =
    branch.address?.trim() ||
    `Vasavi community guest house in ${branch.city}. Comfortable stays for pilgrims and families.`;

  return {
    id: branch.id,
    slug,
    name: branch.name,
    city: branch.city,
    country: "India",
    region: branch.city,
    description,
    starRating: 4,
    startingPrice: 2000,
    roomCount: 12,
    amenities: DEFAULT_AMENITIES,
    images: [DEFAULT_BRANCH_HERO],
    heroImage: DEFAULT_BRANCH_HERO,
    thumbnail: DEFAULT_BRANCH_HERO,
    latitude: 17.385,
    longitude: 78.4867,
    hasDonorRooms: true,
    reviews: [],
    overallRating: 4.5,
    nearbyAttractions: [`${branch.city} city centre`],
  };
}

let cachedHotels: Hotel[] | null = null;
let cacheExpiry = 0;
const CACHE_MS = 60_000;

export async function fetchHotels(force = false): Promise<Hotel[]> {
  const now = Date.now();
  if (!force && cachedHotels && now < cacheExpiry) {
    return cachedHotels;
  }

  const branches = await fetchBranches(force);
  cachedHotels = branches
    .filter((b) => b.is_active !== false)
    .map(mapBranchToHotel);
  cacheExpiry = now + CACHE_MS;
  return cachedHotels;
}

export async function getHotelBySlug(slug: string): Promise<Hotel | undefined> {
  const hotels = await fetchHotels();
  return hotels.find((h) => h.slug === slug);
}

export async function getHotelById(id: string): Promise<Hotel | undefined> {
  const hotels = await fetchHotels();
  return hotels.find((h) => h.id === id);
}

export async function getAllHotelSlugs(): Promise<string[]> {
  const hotels = await fetchHotels();
  return hotels.map((h) => h.slug);
}

export function invalidateHotelCache(): void {
  cachedHotels = null;
  cacheExpiry = 0;
}
