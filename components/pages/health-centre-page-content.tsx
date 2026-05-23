"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  HeartPulse,
  Clock,
  Phone,
  MapPin,
  ArrowUpRight,
  Stethoscope,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { HOTELS } from "@/lib/data/hotels";
import {
  HEALTH_CENTRE_HOTEL_SLUGS,
  type HealthCentreQueryType,
} from "@/lib/data/health-centre";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedHotel } from "@/hooks/use-localized-content";
import { formatCurrency } from "@/lib/utils";

const RELATED_HOTELS = HEALTH_CENTRE_HOTEL_SLUGS.map(
  (slug) => HOTELS.find((h) => h.slug === slug)!
).filter(Boolean);

export function HealthCentrePageContent() {
  const { t } = useAppLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [queryType, setQueryType] = useState<HealthCentreQueryType>("general");

  const infoBullets = [
    t("healthCentre.infoBullet1"),
    t("healthCentre.infoBullet2"),
    t("healthCentre.infoBullet3"),
  ];

  const relatedSentences = [
    t("healthCentre.relatedSentence1"),
    t("healthCentre.relatedSentence2"),
    t("healthCentre.relatedSentence3"),
  ];

  return (
    <div className="pt-20 pb-16 bg-surface min-h-screen">
      <div className="page-container">
        <header className="max-w-3xl mb-10 md:mb-12">
          <span className="inline-flex items-center gap-2 rounded-full border border-champagne/30 bg-champagne/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-champagne mb-4">
            <HeartPulse className="h-3.5 w-3.5" aria-hidden />
            {t("healthCentre.eyebrow")}
          </span>
          <h1 className="font-display text-3xl md:text-4xl text-charcoal font-black text-balance">
            {t("healthCentre.title")}
          </h1>
          <p className="mt-4 text-base md:text-lg text-muted font-semibold leading-relaxed">
            {t("healthCentre.subtitle")}
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 mb-14 md:mb-16">
          {/* Information card */}
          <div className="rounded-2xl border border-beige bg-white p-6 sm:p-8 shadow-warm">
            <div className="flex items-center gap-3 mb-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-champagne/15 text-champagne">
                <Stethoscope className="h-5 w-5" aria-hidden />
              </span>
              <h2 className="font-display text-xl text-charcoal">{t("healthCentre.infoTitle")}</h2>
            </div>
            <p className="text-charcoal/85 leading-relaxed font-medium">{t("healthCentre.infoP1")}</p>
            <p className="mt-4 text-charcoal/85 leading-relaxed font-medium">{t("healthCentre.infoP2")}</p>
            <ul className="mt-5 space-y-2">
              {infoBullets.map((line) => (
                <li key={line} className="flex gap-2 text-sm text-charcoal/80 font-semibold">
                  <span className="text-champagne shrink-0">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 pt-6 border-t border-beige space-y-3 text-sm">
              <p className="flex items-center gap-2 text-muted font-semibold">
                <Clock className="h-4 w-4 text-champagne shrink-0" aria-hidden />
                {t("healthCentre.hours")}
              </p>
              <p className="flex items-center gap-2 text-muted font-semibold">
                <Phone className="h-4 w-4 text-champagne shrink-0" aria-hidden />
                <a href="tel:+914023345678" className="text-champagne hover:underline">
                  {t("healthCentre.phoneNumber")}
                </a>
              </p>
              <p className="flex items-start gap-2 text-muted font-semibold">
                <MapPin className="h-4 w-4 text-champagne shrink-0 mt-0.5" aria-hidden />
                {t("healthCentre.location")}
              </p>
            </div>
          </div>

          {/* Query submission card */}
          <div className="rounded-2xl border border-champagne/25 bg-white p-6 sm:p-8 shadow-warm-md">
            <h2 className="font-display text-xl text-charcoal mb-1">{t("healthCentre.queryTitle")}</h2>
            <p className="text-sm text-muted font-semibold mb-6">{t("healthCentre.querySubtitle")}</p>

            {submitted ? (
              <div className="rounded-xl bg-champagne/10 border border-champagne/20 px-4 py-8 text-center">
                <HeartPulse className="h-10 w-10 text-champagne mx-auto mb-3" aria-hidden />
                <p className="font-display text-lg text-charcoal font-bold">{t("healthCentre.thankYouTitle")}</p>
                <p className="text-sm text-muted mt-2 font-semibold">{t("healthCentre.thankYou")}</p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-6"
                  onClick={() => setSubmitted(false)}
                >
                  {t("healthCentre.submitAnother")}
                </Button>
              </div>
            ) : (
              <form
                className="space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
              >
                <div>
                  <Label htmlFor="hc-name">{t("healthCentre.name")}</Label>
                  <Input id="hc-name" name="name" required className="mt-1" autoComplete="name" />
                </div>
                <div>
                  <Label htmlFor="hc-phone">{t("healthCentre.phone")}</Label>
                  <Input
                    id="hc-phone"
                    name="phone"
                    type="tel"
                    required
                    className="mt-1"
                    autoComplete="tel"
                  />
                </div>
                <div>
                  <Label htmlFor="hc-email">{t("healthCentre.email")}</Label>
                  <Input
                    id="hc-email"
                    name="email"
                    type="email"
                    className="mt-1"
                    autoComplete="email"
                  />
                </div>
                <div>
                  <Label htmlFor="hc-type">{t("healthCentre.queryType")}</Label>
                  <Select
                    value={queryType}
                    onValueChange={(v) => setQueryType(v as HealthCentreQueryType)}
                  >
                    <SelectTrigger id="hc-type" className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="general">{t("healthCentre.queryTypeGeneral")}</SelectItem>
                      <SelectItem value="booking">{t("healthCentre.queryTypeBooking")}</SelectItem>
                      <SelectItem value="senior">{t("healthCentre.queryTypeSenior")}</SelectItem>
                      <SelectItem value="other">{t("healthCentre.queryTypeOther")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="hc-message">{t("healthCentre.message")}</Label>
                  <textarea
                    id="hc-message"
                    name="message"
                    required
                    rows={4}
                    className="mt-1 w-full rounded-lg border border-charcoal/15 bg-surface px-3 py-2 text-base font-medium focus:outline-none focus:ring-2 focus:ring-champagne/40"
                    placeholder={t("healthCentre.messagePlaceholder")}
                  />
                </div>
                <Button type="submit" className="w-full h-11 font-bold">
                  {t("healthCentre.submit")}
                </Button>
              </form>
            )}
          </div>
        </div>

        {/* Related hotels & contextual copy */}
        <section className="rounded-2xl border border-beige bg-white/90 p-6 sm:p-8 shadow-warm">
          <h2 className="font-display text-2xl text-charcoal mb-3">{t("healthCentre.relatedTitle")}</h2>
          <p className="text-muted font-semibold leading-relaxed max-w-3xl mb-6">
            {t("healthCentre.relatedIntro")}
          </p>
          <ul className="space-y-3 mb-8 max-w-3xl">
            {relatedSentences.map((sentence) => (
              <li
                key={sentence}
                className="flex gap-2 text-sm sm:text-base text-charcoal/85 font-medium leading-relaxed"
              >
                <span className="text-champagne font-bold shrink-0">—</span>
                {sentence}
              </li>
            ))}
          </ul>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {RELATED_HOTELS.map((hotel) => (
              <RelatedHotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link href="/#hotels">
              <Button variant="outline" className="rounded-full font-bold">
                {t("healthCentre.browseAllHotels")}
                <ArrowUpRight className="h-4 w-4 ml-1" aria-hidden />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

function RelatedHotelCard({
  hotel,
}: {
  hotel: (typeof HOTELS)[number];
}) {
  const { t } = useAppLanguage();
  const localized = useLocalizedHotel(hotel.slug, {
    name: hotel.name,
    description: hotel.description,
  });
  const cityLabel = t(`cities.${hotel.city}`, { defaultValue: hotel.city });

  return (
    <Link
      href={`/hotels/${hotel.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-beige bg-white hover:border-champagne/40 hover:shadow-warm-md transition-all"
    >
      <div className="relative aspect-[4/3] bg-surface">
        <Image
          src={hotel.thumbnail}
          alt={localized.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <p className="text-[0.65rem] font-bold uppercase tracking-wide text-champagne">{cityLabel}</p>
        <h3 className="font-display text-sm font-bold text-charcoal line-clamp-2 leading-snug mt-0.5 group-hover:text-champagne">
          {localized.name}
        </h3>
        <p className="mt-1 text-xs text-muted line-clamp-2 flex-1">{localized.description}</p>
        <p className="mt-2 text-sm font-black text-charcoal">
          {formatCurrency(hotel.startingPrice)}
          <span className="text-xs font-semibold text-muted ml-1">{t("common.perNight")}</span>
        </p>
        <span className="mt-2 inline-flex items-center text-xs font-bold text-champagne">
          {t("healthCentre.viewHotel")}
          <ArrowUpRight className="h-3.5 w-3.5 ml-0.5" aria-hidden />
        </span>
      </div>
    </Link>
  );
}
