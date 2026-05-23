import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getHotelBySlug, getAllHotelSlugs } from "@/lib/hotels/api";
import { searchRooms, defaultSearchDates } from "@/lib/rooms/search";
import { formatCurrency } from "@/lib/utils";
import { StarRating } from "@/components/shared/star-rating";
import { Badge } from "@/components/ui/badge";
import { HotelDetailStickyNav } from "@/components/customer/hotel-detail-sticky-nav";
import {
  HotelGallery,
  RoomList,
  ReviewsList,
  AmenitiesGrid,
} from "@/components/customer/hotel-detail-client";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  try {
    const slugs = await getAllHotelSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) return { title: "Hotel Not Found" };
  return {
    title: hotel.name,
    description: hotel.description,
    openGraph: { images: [hotel.heroImage] },
  };
}

export default async function HotelDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const hotel = await getHotelBySlug(slug);
  if (!hotel) notFound();

  const dates = defaultSearchDates();
  let rooms: Awaited<ReturnType<typeof searchRooms>>["rooms"] = [];
  try {
    const result = await searchRooms({
      branch_id: hotel.id,
      check_in: dates.check_in,
      check_out: dates.check_out,
      guests: 2,
    });
    rooms = result.rooms;
  } catch {
    rooms = [];
  }

  return (
    <div className="bg-white">
      <HotelDetailStickyNav hotelName={hotel.name} />

      <div className="pt-14 md:pt-20 pb-16">
        <HotelGallery images={hotel.images} name={hotel.name} />

        <div className="mx-auto max-w-7xl px-4 lg:px-8 mt-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold text-charcoal">
                {hotel.name}
              </h1>
              <p className="flex items-center gap-1.5 text-muted mt-2">
                <MapPin className="h-4 w-4" />
                {hotel.city}, {hotel.country}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <StarRating rating={hotel.overallRating} />
                <span className="text-sm text-muted">
                  {hotel.overallRating.toFixed(1)} · Community guest house
                </span>
                {hotel.hasDonorRooms && (
                  <Badge variant="outline" className="text-champagne-dark border-champagne/40">
                    Donor rooms
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs uppercase tracking-wider text-muted font-bold">From</p>
              <p className="font-display text-2xl font-bold text-champagne-dark">
                {formatCurrency(hotel.startingPrice)}
                <span className="text-sm font-normal text-muted"> / night</span>
              </p>
              <Link
                href={`/search?hotel=${hotel.id}&checkIn=${dates.check_in}&checkOut=${dates.check_out}`}
                className="inline-block mt-3 text-sm font-bold text-champagne-dark underline"
              >
                Search availability →
              </Link>
            </div>
          </div>

          <p className="text-charcoal/85 leading-relaxed max-w-3xl mb-10">{hotel.description}</p>

          <AmenitiesGrid amenities={hotel.amenities} />

          <section id="rooms" className="mt-12 scroll-mt-24">
            <h2 className="font-display text-2xl font-bold text-charcoal mb-4">Rooms</h2>
            {rooms.length === 0 ? (
              <p className="text-sm text-muted">
                No rooms available for the default dates.{" "}
                <Link href={`/search?hotel=${hotel.id}`} className="underline text-champagne-dark">
                  Search other dates
                </Link>
                .
              </p>
            ) : (
              <RoomList rooms={rooms} hotel={hotel} />
            )}
          </section>

          <section id="reviews" className="mt-12 scroll-mt-24">
            <ReviewsList reviews={hotel.reviews} />
          </section>
        </div>
      </div>
    </div>
  );
}
