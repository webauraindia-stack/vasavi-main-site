"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Crown, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { useBookingStore } from "@/stores/booking-store";
import { useSearchStore } from "@/stores/search-store";
import { formatCurrency } from "@/lib/utils";
import { canAccessDonorRoom } from "@/lib/donor-engine";
import { useSession } from "next-auth/react";
import type { Hotel, Room, Review } from "@/types";
import type { DonorTier } from "@/types";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedRoom } from "@/hooks/use-localized-content";
import {
  buildLoginCallbackUrl,
  clearPendingBooking,
  getPendingBooking,
  setPendingBooking,
} from "@/lib/pending-booking";

export function HotelGallery({
  images,
  name,
  variant = "card",
  className,
}: {
  images: string[];
  name: string;
  variant?: "card" | "hero";
  className?: string;
}) {
  const [index, setIndex] = useState(0);
  const active = images[index] ?? images[0];

  if (!active) return null;

  const nextSlide = () => {
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const isHero = variant === "hero";

  return (
    <div
      className={cn(
        "relative group w-full overflow-hidden bg-surface-deep",
        isHero
          ? "aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] lg:max-h-[min(52vh,540px)] shadow-none"
          : "aspect-[16/9] sm:aspect-[2/1] rounded-xl shadow-sm",
        className
      )}
    >
      <Image
        src={active}
        alt={name}
        fill
        className="object-cover transition-transform duration-300"
        sizes={isHero ? "100vw" : "(max-width: 1024px) 100vw, 70vw"}
        priority
      />
      {images.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            type="button"
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 duration-200 cursor-pointer"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={nextSlide}
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 hover:bg-white text-charcoal shadow-sm transition-opacity md:opacity-0 md:group-hover:opacity-100 duration-200 cursor-pointer"
            aria-label="Next photo"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <div className="absolute bottom-3 right-3 rounded-full bg-charcoal/70 px-2.5 py-1 text-[10px] font-bold text-white tracking-wider backdrop-blur-sm">
            {index + 1} / {images.length}
          </div>
        </>
      )}
    </div>
  );
}

export function RoomList({
  rooms,
  hotel,
}: {
  rooms: Room[];
  hotel: Hotel;
}) {
  return (
    <Suspense fallback={null}>
      <RoomListInner rooms={rooms} hotel={hotel} />
    </Suspense>
  );
}

function RoomListInner({
  rooms,
  hotel,
}: {
  rooms: Room[];
  hotel: Hotel;
}) {
  const { t } = useAppLanguage();
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const tier = (session?.user as { tier?: DonorTier })?.tier ?? null;
  const { openBooking } = useBookingStore();
  const searchCheckIn = useSearchStore((s) => s.checkIn);
  const searchCheckOut = useSearchStore((s) => s.checkOut);
  const searchGuests = useSearchStore((s) => s.guests);
  const resumedRef = useRef(false);

  const openBookingWithSearch = (room: Room) => {
    openBooking(
      room,
      searchCheckIn ?? undefined,
      searchCheckOut ?? undefined,
      searchGuests
    );
  };

  // After sign-in, resume the booking the user started
  useEffect(() => {
    if (status === "loading" || !session || resumedRef.current) return;

    const fromUrl = searchParams.get("resumeBooking");
    const pending = getPendingBooking();
    const roomId = fromUrl ?? (pending?.hotelSlug === hotel.slug ? pending.roomId : null);

    if (!roomId) return;

    const room = rooms.find((r) => r.id === roomId);
    clearPendingBooking();
    resumedRef.current = true;

    if (!room) {
      if (fromUrl) router.replace(`/hotels/${hotel.slug}#rooms`, { scroll: false });
      return;
    }

    const canBook =
      !room.isFullyBooked &&
      (!room.isDonorExclusive || canAccessDonorRoom(tier, room.donorTierRequired));

    if (canBook) {
      openBooking(
        room,
        searchCheckIn ?? undefined,
        searchCheckOut ?? undefined,
        searchGuests
      );
    }

    if (fromUrl) {
      router.replace(`/hotels/${hotel.slug}#rooms`, { scroll: false });
    }
  }, [
    session,
    status,
    searchParams,
    rooms,
    hotel.slug,
    tier,
    openBooking,
    searchCheckIn,
    searchCheckOut,
    searchGuests,
    router,
  ]);

  const standardRooms = rooms.filter((r) => !r.isDonorExclusive);
  const donorRooms = rooms.filter((r) => r.isDonorExclusive);

  const handleBook = (room: Room) => {
    if (!session) {
      setPendingBooking(room.id, hotel.slug);
      const callbackUrl = buildLoginCallbackUrl(hotel.slug, room.id);
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
      return;
    }
    openBookingWithSearch(room);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 border-b border-beige/20 pb-3">
        <h2 className="font-display text-lg sm:text-xl lg:text-3xl text-charcoal font-semibold">
          {t("hotel.rooms")}
        </h2>
        <a
          href={`/search?hotel=${hotel.id}`}
          className="text-xs lg:text-sm font-bold uppercase tracking-wider text-champagne hover:underline shrink-0"
        >
          {t("hotel.searchAllRooms")}
        </a>
      </div>

      <div className="space-y-4">
        {standardRooms.map((room) => (
          <RoomCard key={room.id} room={room} tier={tier} onBook={() => handleBook(room)} />
        ))}
        {donorRooms.length > 0 && (
          <>
            <p className="flex items-center gap-1.5 text-xs lg:text-sm font-bold uppercase tracking-wider text-champagne/80 pt-4">
              <Crown className="h-4 w-4 text-champagne-dark" aria-hidden />
              {t("hotel.donorExclusiveRooms")}
            </p>
            {donorRooms.map((room) => (
              <RoomCard key={room.id} room={room} tier={tier} onBook={() => handleBook(room)} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

function RoomCard({
  room,
  tier,
  onBook,
}: {
  room: Room;
  tier: DonorTier;
  onBook: () => void;
}) {
  const { t } = useAppLanguage();
  const localized = useLocalizedRoom(room);
  const canBook =
    !room.isFullyBooked &&
    (!room.isDonorExclusive || canAccessDonorRoom(tier, room.donorTierRequired));

  return (
    <div className="flex gap-4 lg:gap-5 rounded-xl border border-beige/35 bg-white/40 p-4 lg:p-5 transition-all hover:bg-white/60">
      <div className="relative h-20 w-24 sm:h-24 sm:w-28 lg:h-28 lg:w-36 shrink-0 rounded-lg overflow-hidden bg-surface-deep shadow-sm">
        <Image
          src={room.images[0]}
          alt={localized.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base lg:text-xl font-bold text-charcoal leading-snug line-clamp-1">
                {localized.name}
              </h3>
              <p className="text-[11px] lg:text-sm text-muted/80 font-medium mt-0.5">
                {localized.category} · {localized.bedType}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-base lg:text-xl font-bold text-champagne leading-none">
                {formatCurrency(room.pricePerNight)}
              </p>
              <span className="text-[9px] lg:text-xs font-semibold uppercase tracking-wider text-muted/70 block mt-0.5">
                {t("common.perNight")}
              </span>
            </div>
          </div>
          <p className="mt-2 text-xs lg:text-base text-muted/90 line-clamp-2 leading-relaxed">
            {localized.description}
          </p>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2 pt-2 border-t border-beige/10">
          <span className="flex items-center gap-1.5 text-xs lg:text-sm text-muted font-medium">
            <Users className="h-3.5 w-3.5 text-muted/65" aria-hidden />
            {t("hotel.maxOccupancy", { count: room.maxOccupancy })}
          </span>
          <Button
            size="sm"
            className="h-8 rounded-lg px-4 text-xs font-bold uppercase tracking-wider"
            disabled={!canBook}
            onClick={onBook}
          >
            {room.isFullyBooked
              ? t("common.soldOut")
              : room.isDonorExclusive && !canAccessDonorRoom(tier, room.donorTierRequired)
                ? t("hotel.donorAccessRequired")
                : t("common.bookNow")}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function HotelReview({ reviews }: { reviews: Review[] }) {
  const { t } = useAppLanguage();
  const review = reviews[0];
  if (!review) return null;

  return (
    <div className="space-y-4 max-w-2xl">
      <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
        {t("hotel.guestReviews")}
      </h2>
      <div className="border-l-2 border-champagne/20 pl-4 py-0.5 space-y-3">
        <blockquote className="text-charcoal/80 text-sm sm:text-base leading-relaxed italic">
          &ldquo;{review.text}&rdquo;
        </blockquote>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-xs font-bold text-charcoal/90">
            {review.guestName}
            <span className="text-muted/70 font-normal"> · {review.city}</span>
          </p>
          <StarRating rating={review.rating} size="sm" />
        </div>
      </div>
    </div>
  );
}

/** @deprecated Availability heatmap removed for simpler UI */
export function AvailabilityCalendar() {
  return null;
}

/** @deprecated Use HotelReview */
export const ReviewsList = HotelReview;
export const AmenitiesGrid = () => null;
export const ReviewsCarousel = HotelReview;
