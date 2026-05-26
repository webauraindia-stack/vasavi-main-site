import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getHotelBySlug,
  getAllHotelSlugs,
  getRoomsForHotel,
} from "@/lib/data/hotels";
import {
  HotelDetailInfo,
} from "@/components/pages/hotel-detail-labels";
import { HotelGallery, RoomList, HotelReview } from "@/components/customer/hotel-detail-client";
import { HotelDetailUrlSync } from "@/components/customer/hotel-detail-url-sync";

export const revalidate = 3600;

export async function generateStaticParams() {
  return getAllHotelSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hotel = getHotelBySlug(slug);
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
  const hotel = getHotelBySlug(slug);
  if (!hotel) notFound();

  const rooms = getRoomsForHotel(hotel.id);

  return (
    <div className="bg-surface min-h-screen pb-20">
      <HotelDetailUrlSync />
      <HotelGallery
        images={hotel.images}
        name={hotel.name}
        variant="hero"
        className="mt-[var(--site-header-offset,5.25rem)]"
      />

      <div className="page-container max-w-6xl pt-8 md:pt-12 lg:pt-14 space-y-10 lg:space-y-12">
        <div className="border-b border-beige/30 pb-8 lg:pb-10">
          <HotelDetailInfo
            slug={hotel.slug}
            name={hotel.name}
            description={hotel.description}
            city={hotel.city}
            country={hotel.country}
            region={hotel.region}
            starRating={hotel.starRating}
            roomCount={hotel.roomCount}
            overallRating={hotel.overallRating}
            hasDonorRooms={hotel.hasDonorRooms}
            amenities={hotel.amenities}
            nearbyAttractions={hotel.nearbyAttractions}
          />
        </div>

        <section id="rooms" className="pt-2">
          <RoomList rooms={rooms} hotel={hotel} />
        </section>

        {hotel.reviews.length > 0 && (
          <section className="border-t border-beige/30 pt-8">
            <HotelReview reviews={hotel.reviews} />
          </section>
        )}
      </div>

    </div>
  );
}
