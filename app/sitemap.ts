import type { MetadataRoute } from "next";
import { getAllHotelSlugs } from "@/lib/hotels/api";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "https://vasavihotels.org";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let hotelPages: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllHotelSlugs();
    hotelPages = slugs.map((slug) => ({
      url: `${BASE}/hotels/${slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
  } catch {
    hotelPages = [];
  }

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/search`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE}/donors`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE}/schemes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/founder`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/health-centre`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/login`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    ...hotelPages,
  ];
}
