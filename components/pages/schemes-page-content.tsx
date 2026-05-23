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
      className="scroll-mt-24 border-b border-charcoal/10 pb-12 last:border-0"
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-champagne mb-2">
        {localized.shortName}
      </p>
      <h2 className="font-display text-2xl text-charcoal mb-4">{localized.name}</h2>
      <p className="text-sm text-muted leading-relaxed mb-4">{localized.summary}</p>
      <p className="text-base text-charcoal/80 leading-relaxed whitespace-pre-line mb-6">
        {localized.description}
      </p>
      <div className="card-surface p-4 mb-4">
        <p className="text-xs uppercase tracking-wider text-muted mb-1">
          {t("schemesPage.hotelBenefit")}
        </p>
        <p className="text-sm text-charcoal">{localized.hotelBenefit}</p>
      </div>
      <a
        href={scheme.readMoreHref}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-champagne hover:underline"
      >
        {t("schemesPage.readMore")}
      </a>
    </article>
  );
}

export function SchemesPageContent() {
  const { t } = useAppLanguage();

  return (
    <div className="pt-20 pb-16 bg-white">
      <div className="bg-surface py-12 md:py-16">
        <div className="page-container max-w-3xl text-center">
          <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-4">
            {t("schemesPage.title")}
          </h1>
          <p className="text-muted leading-relaxed">{t("schemesPage.intro")}</p>
        </div>
      </div>

      <div className="page-container max-w-3xl py-12 space-y-16">
        {COMMUNITY_SCHEMES.map((scheme) => (
          <SchemeArticle key={scheme.id} scheme={scheme} />
        ))}
      </div>

      <div className="page-container max-w-3xl pb-12 text-center">
        <Link href="/donors">
          <Button variant="outline">{t("schemesPage.backDonors")}</Button>
        </Link>
      </div>
    </div>
  );
}
