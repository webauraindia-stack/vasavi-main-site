"use client";

import Link from "next/link";
import { COMMUNITY_SCHEMES, VCI_CONTACT } from "@/lib/data/vasavi-community";
import { Button } from "@/components/ui/button";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedScheme } from "@/hooks/use-localized-content";

function SchemeArticle({ scheme }: { scheme: (typeof COMMUNITY_SCHEMES)[number] }) {
  const { t } = useAppLanguage();
  const localized = useLocalizedScheme(scheme);

  return (
    <article
      id={scheme.id}
      className="scroll-mt-24 border-b border-charcoal/10 pb-14 last:border-0"
    >
      <p className="text-sm font-bold uppercase tracking-wider text-champagne mb-3">
        {localized.shortName}
      </p>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal mb-5">{localized.name}</h2>
      <p className="text-base md:text-lg text-muted leading-relaxed mb-5">{localized.summary}</p>
      <p className="text-base md:text-lg text-charcoal/80 leading-relaxed whitespace-pre-line mb-8">
        {localized.description}
      </p>
      <div className="card-surface p-5 md:p-6 mb-6">
        <p className="text-xs uppercase tracking-wider text-muted mb-2">
          {t("schemesPage.hotelBenefit")}
        </p>
        <p className="text-base md:text-lg text-charcoal">{localized.hotelBenefit}</p>
      </div>
      <a
        href={scheme.readMoreHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-base text-champagne hover:underline font-semibold"
      >
        {t("schemesPage.readMore")} →
      </a>
    </article>
  );
}

export function SchemesPageContent() {
  const { t } = useAppLanguage();

  return (
    <div className="pt-16 pb-20 bg-white">
      {/* Header banner with big photo background */}
      <div className="relative h-[320px] md:h-[420px] flex items-center justify-center overflow-hidden border-b border-beige">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out scale-105 hover:scale-100"
          style={{ backgroundImage: "url('/images/temple-corridor.png')" }}
        />
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1f0a0a]/75 via-[#4a0e0e]/55 to-[#1f0a0a]/85" />
        
        {/* Overlay Content */}
        <div className="page-container relative z-10 text-center text-white px-4 sm:px-6">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white drop-shadow-sm mb-4 leading-tight">
            {t("schemesPage.title")}
          </h1>
          <div className="w-24 h-[3px] bg-champagne-dark mx-auto mb-6 rounded-full shadow-sm"></div>
          <p className="text-base md:text-lg lg:text-xl text-white/90 leading-relaxed max-w-3xl mx-auto drop-shadow-sm font-body font-medium">
            {t("schemesPage.intro")}
          </p>
        </div>
      </div>

      {/* Contact bar */}
      <div className="bg-champagne/8 border-b border-champagne/15 py-4">
        <div className="page-container flex flex-wrap items-center justify-between gap-4">
          <p className="text-base text-muted font-semibold">
            {t("donors.contactIntro")}{" "}
            <a href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline font-bold">
              {VCI_CONTACT.phone}
            </a>
          </p>
          <Link href="/donors">
            <Button variant="outline" size="sm">{t("schemesPage.backDonors")}</Button>
          </Link>
        </div>
      </div>

      {/* Big photo in one row */}
      <div className="page-container py-10 max-w-4xl mx-auto">
        <div className="relative h-[280px] sm:h-[380px] md:h-[480px] w-full rounded-[var(--radius-devotional)] overflow-hidden shadow-warm-lg border border-beige/60 group">
          <div 
            className="absolute inset-0 bg-cover bg-center transition-transform duration-[10000ms] ease-out scale-105 group-hover:scale-100"
            style={{ backgroundImage: "url('/images/temple-guest-house-exterior.png')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1f0a0a]/90 via-[#4a0e0e]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 text-white flex flex-col justify-end">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-[0.2em] text-champagne-dark mb-2">
              Vasavi Spiritual Stays
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white drop-shadow-md leading-tight mb-3">
              Supporting Noble Causes Through Sacred Hospitality
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-white/80 max-w-2xl font-body leading-relaxed hidden sm:block">
              Every room booking across our eleven guest house properties directly strengthens the welfare and educational schemes of Vasavi Clubs International.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="page-container py-10 max-w-4xl mx-auto space-y-16">
        {COMMUNITY_SCHEMES.map((scheme) => (
          <SchemeArticle key={scheme.id} scheme={scheme} />
        ))}
      </div>

      <div className="page-container pb-10 text-center">
        <Link href="/donors">
          <Button variant="outline">{t("schemesPage.backDonors")}</Button>
        </Link>
      </div>
    </div>
  );
}
