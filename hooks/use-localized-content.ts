"use client";

import { useMemo } from "react";
import { useAppLanguage } from "@/hooks/use-app-language";
import { amenityKey, roomTemplateKey } from "@/lib/i18n/content-keys";
import type { COMMUNITY_SCHEMES } from "@/lib/data/vasavi-community";

type Scheme = (typeof COMMUNITY_SCHEMES)[number];

export function useLocalizedScheme(scheme: Scheme) {
  const { t } = useAppLanguage();
  const id = scheme.id;
  return useMemo(
    () => ({
      shortName: t(`schemeContent.${id}.shortName`, { defaultValue: scheme.shortName }),
      name: t(`schemeContent.${id}.name`, { defaultValue: scheme.name }),
      summary: t(`schemeContent.${id}.summary`, { defaultValue: scheme.summary }),
      description: t(`schemeContent.${id}.description`, { defaultValue: scheme.description }),
      hotelBenefit: t(`schemeContent.${id}.hotelBenefit`, { defaultValue: scheme.hotelBenefit }),
      readMoreHref: scheme.readMoreHref,
      id: scheme.id,
      slug: scheme.slug,
    }),
    [t, id, scheme]
  );
}

export function useLocalizedHotel(slug: string, fallback: { name: string; description: string }) {
  const { t } = useAppLanguage();
  return useMemo(
    () => ({
      name: t(`hotels.${slug}.name`, { defaultValue: fallback.name }),
      description: t(`hotels.${slug}.description`, { defaultValue: fallback.description }),
    }),
    [t, slug, fallback.name, fallback.description]
  );
}

export function useLocalizedAmenity(amenity: string) {
  const { t } = useAppLanguage();
  return t(amenityKey(amenity), { defaultValue: amenity });
}

export function useLocalizedNearby(slug: string, index: number, fallback: string) {
  const { t } = useAppLanguage();
  return t(`hotels.${slug}.nearby.${index}`, { defaultValue: fallback });
}

export function useLocalizedRoom(room: {
  name: string;
  description: string;
  bedType: string;
  category: string;
}) {
  const { t } = useAppLanguage();
  const key = roomTemplateKey(room.name);
  return useMemo(
    () => ({
      name: t(`roomTemplates.${key}.name`, { defaultValue: room.name }),
      description: t(`roomTemplates.${key}.description`, { defaultValue: room.description }),
      bedType: t(`roomTemplates.${key}.bedType`, { defaultValue: room.bedType }),
      category: t(`roomTypes.${room.category}`, { defaultValue: room.category }),
    }),
    [t, key, room]
  );
}

export function useLocalizedHotelName(slug: string, fallback: string) {
  const { t } = useAppLanguage();
  return t(`hotels.${slug}.name`, { defaultValue: fallback });
}

export function useLocalizedCity(city: string) {
  const { t } = useAppLanguage();
  return t(`cities.${city}`, { defaultValue: city });
}
