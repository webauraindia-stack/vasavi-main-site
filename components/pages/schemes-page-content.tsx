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
    <div className="pt-20 pb-20 bg-white">
      {/* Header banner */}
      <div className="bg-surface py-14 md:py-20 border-b border-beige">
        <div className="page-container text-center">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6">
            {t("schemesPage.title")}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted leading-relaxed max-w-3xl mx-auto">
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

      {/* Scheme articles */}
      <div className="page-container py-14 space-y-14">
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
