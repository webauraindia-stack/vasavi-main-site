"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  FOUNDER,
  COMMUNITY_SCHEMES,
  INTERNATIONAL_PST,
  VCI_CONTACT,
  QUICK_LINKS,
} from "@/lib/data/vasavi-community";
import { HOTELS } from "@/lib/data/hotels";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedHotel, useLocalizedScheme } from "@/hooks/use-localized-content";

export function AboutPageContent() {
  const { t } = useAppLanguage();
  const cityCount = new Set(HOTELS.map((h) => h.city)).size;

  return (
    <div className="pt-20 pb-16 bg-white">
      <div className="page-container max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
          {t("about.title")}
        </h1>

        <div className="space-y-4 text-charcoal/80 leading-relaxed">
          <p>
            <strong className="text-charcoal">{t("about.welcomeTitle")}</strong>{" "}
            {t("about.p1")}
          </p>
          <p>{t("about.p2")}</p>
          <p>{t("about.p3")}</p>
        </div>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-charcoal mb-4">{t("about.collection")}</h2>
          <p className="text-muted text-sm mb-4">
            {t("about.propertiesInCities", { count: HOTELS.length, cities: cityCount })}
          </p>
          <ul className="grid sm:grid-cols-2 gap-2 text-sm text-muted">
            {HOTELS.map((h) => (
              <HotelListItem key={h.id} slug={h.slug} name={h.name} description={h.description} city={h.city} />
            ))}
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-charcoal mb-4">{t("about.communitySchemes")}</h2>
          <ul className="space-y-2 text-sm text-muted">
            {COMMUNITY_SCHEMES.map((s) => (
              <SchemeListItem key={s.id} scheme={s} />
            ))}
          </ul>
          <Link href="/schemes" className="text-sm text-champagne hover:underline mt-3 inline-block">
            {t("about.fullSchemeDetails")}
          </Link>
        </section>

        <section className="mt-12">
          <h2 className="font-display text-2xl text-charcoal mb-4">{t("about.pst")}</h2>
          <ul className="space-y-3">
            {INTERNATIONAL_PST.map((p) => (
              <li key={p.role} className="text-sm">
                <p className="font-medium text-charcoal">{p.role}</p>
                <p className="text-muted">{p.name}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12 card-surface p-6">
          <h2 className="font-display text-xl text-charcoal mb-3">{t("about.contact")}</h2>
          <p className="text-sm text-muted">
            {t("about.vciLabel")}:{" "}
            <a href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline">
              {VCI_CONTACT.phone}
            </a>
          </p>
          <p className="text-sm text-muted mt-2">{VCI_CONTACT.address}</p>
        </section>

        <section className="mt-8">
          <h3 className="text-sm font-semibold text-charcoal mb-2">{t("about.quickLinks")}</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/#hotels">
            <Button>{t("about.browseHotels")}</Button>
          </Link>
          <Link href="/donors">
            <Button variant="outline">{t("about.donorProgram")}</Button>
          </Link>
          <Link href="/founder">
            <Button variant="outline">{t("about.ourFounder")}</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function HotelListItem({
  slug,
  name,
  description,
  city,
}: {
  slug: string;
  name: string;
  description: string;
  city: string;
}) {
  const localized = useLocalizedHotel(slug, { name, description });
  return (
    <li>
      <Link href={`/hotels/${slug}`} className="hover:text-champagne">
        {localized.name} — {city}
      </Link>
    </li>
  );
}

function SchemeListItem({ scheme }: { scheme: (typeof COMMUNITY_SCHEMES)[number] }) {
  const localized = useLocalizedScheme(scheme);
  return (
    <li>
      <Link href={`/schemes#${scheme.id}`} className="hover:text-champagne">
        {localized.shortName}: {localized.name.split("—")[0].trim()}
      </Link>
    </li>
  );
}
