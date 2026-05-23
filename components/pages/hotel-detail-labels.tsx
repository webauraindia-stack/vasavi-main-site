"use client";

import Link from "next/link";
import { MapPin } from "lucide-react";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import {
  useLocalizedHotel,
  useLocalizedNearby,
} from "@/hooks/use-localized-content";
import type { AmenityTag } from "@/types";

export function HotelDetailInfo({
  slug,
  name,
  description,
  city,
  country,
  region,
  starRating,
  roomCount,
  overallRating,
  hasDonorRooms,
  amenities,
  nearbyAttractions,
}: {
  slug: string;
  name: string;
  description: string;
  city: string;
  country: string;
  region: string;
  starRating: number;
  roomCount: number;
  overallRating: number;
  hasDonorRooms?: boolean;
  amenities: AmenityTag[];
  nearbyAttractions?: string[];
}) {
  const { t } = useAppLanguage();
  const localized = useLocalizedHotel(slug, { name, description });
  const cityLabel = t(`cities.${city}`, { defaultValue: city });

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-wrap items-center gap-2 mb-1.5">
          <h1 className="font-display text-2xl sm:text-3xl text-charcoal leading-tight font-semibold">
            {localized.name}
          </h1>
          {hasDonorRooms && (
            <span className="rounded-full bg-champagne/10 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-champagne border border-champagne/20">
              {t("hotel.donorRoomsBadge")}
            </span>
          )}
        </div>
        <p className="flex items-center gap-1 text-xs text-muted font-medium">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne/70" aria-hidden />
          {cityLabel}, {country}
        </p>
        <div className="mt-3.5 flex flex-wrap items-center gap-4 text-xs">
          <StarRating rating={overallRating} size="sm" showValue />
          <span className="text-muted/80">
            {t("hotel.starRooms", { stars: starRating, count: roomCount })}
          </span>
        </div>
      </div>

      <p className="text-charcoal/80 leading-relaxed text-sm sm:text-base font-normal">{localized.description}</p>

      {amenities.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            {t("hotel.amenities")}
          </h2>
          <ul className="flex flex-wrap gap-1.5">
            {amenities.map((a) => (
              <li
                key={a}
                className="rounded-full bg-beige/20 px-3 py-1 text-xs text-charcoal/80"
              >
                {t(`amenities.${a}`, { defaultValue: a })}
              </li>
            ))}
          </ul>
        </div>
      )}

      {nearbyAttractions && nearbyAttractions.length > 0 && (
        <div className="space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-muted">
            {t("hotel.nearby")}
          </h2>
          <ul className="grid gap-2 sm:grid-cols-2 text-xs text-charcoal/85">
            {nearbyAttractions.map((item, i) => (
              <NearbyItem key={i} slug={slug} index={i} fallback={item} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function NearbyItem({
  slug,
  index,
  fallback,
}: {
  slug: string;
  index: number;
  fallback: string;
}) {
  const text = useLocalizedNearby(slug, index, fallback);
  return <li className="flex items-center gap-1.5">• {text}</li>;
}

export function HotelDetailBookCard({
  startingPrice,
  hotelId,
  className,
}: {
  startingPrice: number;
  hotelId: string;
  className?: string;
}) {
  const { t } = useAppLanguage();
  return (
    <div
      className={
        className ??
        "rounded-xl border border-beige/40 bg-white/50 backdrop-blur-sm p-5 shadow-sm space-y-4"
      }
    >
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("hotel.startingFrom")}</p>
        <p className="mt-1 text-2xl font-bold text-champagne">
          {formatCurrency(startingPrice)}
          <span className="ml-1 text-xs font-medium text-muted font-body">
            {t("common.perNight")}
          </span>
        </p>
      </div>
      <Link
        href={`/search?hotel=${hotelId}`}
        className="flex h-10 w-full items-center justify-center rounded-lg bg-champagne text-xs font-bold uppercase tracking-wider text-white hover:bg-champagne/90 active:scale-[0.98] transition-all"
      >
        {t("hotel.searchAllRooms")}
      </Link>
    </div>
  );
}

/** Fixed book bar on mobile */
export function HotelDetailMobileBar({
  startingPrice,
  hotelId,
}: {
  startingPrice: number;
  hotelId: string;
}) {
  const { t } = useAppLanguage();
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-beige/40 bg-white/90 backdrop-blur-md lg:hidden">
      <div className="page-container flex items-center justify-between gap-3 py-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-muted">{t("hotel.startingFrom")}</p>
          <p className="text-base font-bold text-charcoal tabular-nums">
            {formatCurrency(startingPrice)}
            <span className="text-[10px] font-medium text-muted ml-1">
              {t("common.perNight")}
            </span>
          </p>
        </div>
        <Link
          href={`/search?hotel=${hotelId}`}
          className="shrink-0 rounded-lg bg-champagne px-4 py-2 text-xs font-bold uppercase tracking-wider text-white hover:bg-champagne/90"
        >
          {t("hotel.searchAllRooms")}
        </Link>
      </div>
    </div>
  );
}
