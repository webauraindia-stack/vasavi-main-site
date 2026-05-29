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
import { useHotelsCatalog } from "@/lib/context/hotels-catalog";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedHotel, useLocalizedScheme } from "@/hooks/use-localized-content";

export function AboutPageContent() {
  const { t } = useAppLanguage();
  const { hotels } = useHotelsCatalog();
  const cityCount = new Set(hotels.map((h) => h.city)).size;

  return (
    <div className="pt-20 pb-20 bg-white">
      {/* Page header */}
      <div className="bg-surface border-b border-beige py-14 md:py-20">
        <div className="page-container">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 max-w-3xl">
            {t("about.title")}
          </h1>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 text-charcoal/80 leading-relaxed text-base md:text-lg">
            <p className="lg:col-span-2">
              <strong className="text-charcoal">{t("about.welcomeTitle")}</strong>{" "}
              {t("about.p1")}
            </p>
            <p className="text-charcoal/75">{t("about.p2")}</p>
            <p className="text-charcoal/75 md:col-span-2 lg:col-span-3">{t("about.p3")}</p>
          </div>
        </div>
      </div>

      <div className="page-container mt-14">
        <div className="grid gap-16 lg:grid-cols-[1fr_340px] lg:gap-20 items-start">
          {/* Main content */}
          <div className="space-y-16">
            {/* Hotel collection */}
            <section>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-3">
                {t("about.collection")}
              </h2>
              <p className="text-base md:text-lg text-muted mb-6">
                {t("about.propertiesInCities", { count: hotels.length, cities: cityCount })}
              </p>
              <ul className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
                {hotels.map((h) => (
                  <HotelListItem
                    key={h.id}
                    slug={h.slug}
                    name={h.name}
                    description={h.description}
                    city={h.city}
                  />
                ))}
              </ul>
            </section>

            {/* Community schemes */}
            <section>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
                {t("about.communitySchemes")}
              </h2>
              <ul className="space-y-2 text-base md:text-lg text-muted">
                {COMMUNITY_SCHEMES.map((s) => (
                  <SchemeListItem key={s.id} scheme={s} />
                ))}
              </ul>
              <Link
                href="/schemes"
                className="text-base text-champagne hover:underline mt-4 inline-block font-semibold"
              >
                {t("about.fullSchemeDetails")}
              </Link>
            </section>

            {/* International PST */}
            <section>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-6">
                {t("about.pst")}
              </h2>
              <ul className="grid sm:grid-cols-2 gap-5">
                {INTERNATIONAL_PST.map((p) => (
                  <li key={p.role} className="rounded-xl border border-beige bg-surface p-4">
                    <p className="text-base font-bold text-charcoal">{p.role}</p>
                    <p className="text-base text-muted mt-1">{p.name}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6 lg:sticky lg:top-24">
            {/* Contact card */}
            <div className="card-surface p-6 md:p-8">
              <h2 className="font-display text-xl md:text-2xl text-charcoal mb-4">
                {t("about.contact")}
              </h2>
              <p className="text-base text-muted">
                {t("about.vciLabel")}:{" "}
                <a href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline font-semibold">
                  {VCI_CONTACT.phone}
                </a>
              </p>
              <p className="text-base text-muted mt-3">{VCI_CONTACT.address}</p>
            </div>

            {/* Quick links */}
            <div className="card-surface p-6 md:p-8">
              <h3 className="text-base font-bold text-charcoal mb-3">{t("about.quickLinks")}</h3>
              <ul className="space-y-2 text-sm text-muted">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-champagne transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col gap-3">
              <Link href="/#hotels">
                <Button className="w-full">{t("about.browseHotels")}</Button>
              </Link>
              <Link href="/donors">
                <Button variant="outline" className="w-full">{t("about.donorProgram")}</Button>
              </Link>
              <Link href="/founder">
                <Button variant="outline" className="w-full">{t("about.ourFounder")}</Button>
              </Link>
            </div>
          </aside>
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
      <Link
        href={`/hotels/${slug}`}
        className="group flex items-start gap-2 rounded-lg p-3 hover:bg-surface transition-colors border border-transparent hover:border-beige"
      >
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-champagne/60 group-hover:bg-champagne" />
        <span className="text-base text-charcoal group-hover:text-champagne transition-colors leading-snug">
          {localized.name} — <span className="text-muted">{city}</span>
        </span>
      </Link>
    </li>
  );
}

function SchemeListItem({ scheme }: { scheme: (typeof COMMUNITY_SCHEMES)[number] }) {
  const localized = useLocalizedScheme(scheme);
  return (
    <li>
      <Link href={`/schemes#${scheme.id}`} className="hover:text-champagne transition-colors">
        <span className="font-semibold text-champagne">{localized.shortName}:</span>{" "}
        {localized.name.split("—")[0].trim()}
      </Link>
    </li>
  );
}
