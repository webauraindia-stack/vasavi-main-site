"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Crown, MapPin, ArrowUpRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StarRating } from "@/components/shared/star-rating";
import { formatCurrency } from "@/lib/utils";
import type { Hotel } from "@/types";
import { cn } from "@/lib/utils";
import { unsplash, U } from "@/lib/data/hotel-images";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedHotel } from "@/hooks/use-localized-content";

const FALLBACK_THUMB = unsplash(U.hotelExterior);

interface HotelCardProps {
  hotel: Hotel;
  className?: string;
  featured?: boolean;
}

export function HotelCard({ hotel, className, featured = false }: HotelCardProps) {
  const { t } = useAppLanguage();
  const localized = useLocalizedHotel(hotel.slug, {
    name: hotel.name,
    description: hotel.description,
  });
  const cityLabel = t(`cities.${hotel.city}`, { defaultValue: hotel.city });
  const [imgSrc, setImgSrc] = useState(hotel.thumbnail);
  const accent = Number(hotel.id) % 4;
  const highlightAmenities = hotel.amenities.slice(0, 2);

  return (
    <article
      className={cn(
        "stay-card group",
        hotel.hasDonorRooms && "stay-card--donor",
        `stay-card--accent-${accent}`,
        featured && "stay-card--featured lg:col-span-2 lg:row-span-2",
        className
      )}
    >
      <Link href={`/hotels/${hotel.slug}`} className="stay-card__media aspect-[16/10] sm:aspect-[4/3]">
        <Image
          src={imgSrc}
          alt={`${localized.name} — ${cityLabel}`}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
          sizes={
            featured
              ? "(max-width: 1024px) 100vw, 50vw"
              : "(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
          }
          onError={() => setImgSrc(FALLBACK_THUMB)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/25 to-charcoal/5" />
        <div className="stay-card__shine" aria-hidden />
        <div className="stay-card__corner" aria-hidden />

        <div className="absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-3">
          <span className="inline-flex max-w-[65%] items-center gap-1 rounded-full border border-white/30 bg-white/95 px-2.5 py-1 text-xs font-bold text-charcoal shadow-sm backdrop-blur-sm sm:max-w-[65%] sm:px-2.5 sm:text-xs">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-champagne" aria-hidden />
            <span className="truncate">{cityLabel}</span>
          </span>

          {hotel.hasDonorRooms && (
            <span
              className="inline-flex shrink-0 items-center gap-0.5 rounded-full bg-gradient-to-r from-champagne-dark to-champagne px-2.5 py-1 text-[0.65rem] font-bold uppercase tracking-wide text-white shadow-md sm:gap-1 sm:px-2.5 sm:text-[0.65rem]"
              title={t("hotelCard.donorPrivilege")}
            >
              <Crown className="h-3 w-3 shrink-0" aria-hidden />
              <span className="max-w-[5.25rem] truncate sm:max-w-none">
                {t("hotelCard.donorPrivilege")}
              </span>
            </span>
          )}
        </div>

        {featured && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 hidden lg:block">
            <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wider text-beige backdrop-blur-sm">
              <Sparkles className="h-3 w-3 text-champagne-dark" />
              {t("hotels.eyebrow")}
            </span>
          </div>
        )}
      </Link>

      <div
        className={cn(
          "flex flex-1 flex-col gap-2.5 p-3 sm:gap-3 sm:p-4",
          featured && "p-5 sm:p-5"
        )}
      >
        <div className="min-w-0 space-y-1">
          <h3
            className={cn(
              "font-display font-bold text-charcoal leading-snug line-clamp-2 group-hover:text-champagne transition-colors",
              featured ? "text-lg sm:text-2xl" : "text-sm sm:text-base"
            )}
          >
            {localized.name}
          </h3>
          <p
            className={cn(
              "text-muted font-medium leading-snug line-clamp-2",
              featured ? "text-sm sm:text-base" : "text-[0.6875rem] sm:text-xs"
            )}
          >
            {localized.description}
          </p>
        </div>

        {highlightAmenities.length > 0 && (
          <ul className="flex flex-wrap gap-1" aria-label={t("hotels.amenities")}>
            {highlightAmenities.map((amenity) => (
              <li key={amenity}>
                <span className="inline-block max-w-full truncate rounded-md border border-beige/90 bg-surface/80 px-1.5 py-0.5 text-[0.55rem] sm:text-[0.625rem] font-bold text-charcoal/75 sm:px-2 sm:text-[0.625rem]">
                  {t(`amenities.${amenity}`, { defaultValue: amenity })}
                </span>
              </li>
            ))}
          </ul>
        )}

        <div
          className={cn(
            "flex items-center justify-between gap-1.5 rounded-xl bg-surface/60 px-2 py-1.5 sm:px-3 sm:py-2",
            featured && "sm:px-4 sm:py-2.5"
          )}
        >
          <div className="min-w-0">
            <StarRating rating={hotel.starRating} size="sm" showValue />
          </div>
          <div className="shrink-0 text-right leading-none">
            <span
              className={cn(
                "font-black text-charcoal tabular-nums",
                featured ? "text-xl sm:text-2xl" : "text-base sm:text-lg"
              )}
            >
              {formatCurrency(hotel.startingPrice)}
            </span>
            <span className="mt-0.5 block text-[0.55rem] font-bold text-muted sm:text-xs">
              {t("common.perNight")}
            </span>
          </div>
        </div>

        <Link href={`/hotels/${hotel.slug}`} className="mt-auto">
          <Button
            size={featured ? "default" : "sm"}
            className={cn(
              "w-full rounded-xl font-bold shadow-warm transition-all text-[0.6875rem] sm:text-sm",
              "bg-champagne text-white border-0 hover:bg-champagne/90 hover:shadow-warm-md",
              "group/btn",
              featured ? "h-11 sm:h-12" : "h-9 sm:h-10"
            )}
          >
            {t("hotelCard.exploreStay")}
            <ArrowUpRight
              className={cn(
                "ml-1 shrink-0 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5",
                featured ? "h-4 w-4" : "h-3.5 w-3.5"
              )}
              aria-hidden
            />
          </Button>
        </Link>
      </div>
    </article>
  );
}
