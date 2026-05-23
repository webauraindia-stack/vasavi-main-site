"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { COMMUNITY_SCHEMES } from "@/lib/data/vasavi-community";
import { useLocalizedScheme } from "@/hooks/use-localized-content";
import { useAppLanguage } from "@/hooks/use-app-language";

type Scheme = (typeof COMMUNITY_SCHEMES)[number];

export function SchemeCard({ scheme }: { scheme: Scheme }) {
  const { t } = useAppLanguage();
  const localized = useLocalizedScheme(scheme);

  return (
    <article className="card-surface flex flex-col p-5 sm:p-6 h-full">
      <p className="text-xs font-semibold uppercase tracking-wider text-champagne-dark mb-2">
        {localized.shortName}
      </p>
      <h3 className="font-display text-lg sm:text-xl text-charcoal mb-2 leading-snug">
        {localized.name}
      </h3>
      <p className="text-sm text-muted leading-relaxed flex-1">{localized.summary}</p>
      <p className="text-xs text-charcoal/70 mt-4 pt-4 border-t border-charcoal/10">
        <span className="font-medium text-champagne-dark">{t("schemeCard.hotelHubLabel")} </span>
        {localized.hotelBenefit}
      </p>
      <div className="flex flex-wrap gap-2 mt-4">
        <Link href={`/schemes#${scheme.id}`}>
          <Button variant="outline" size="sm" className="min-h-11">
            {t("schemeCard.readMore")}
            <ArrowRight className="h-3.5 w-3.5 ml-1" />
          </Button>
        </Link>
        <a
          href={scheme.readMoreHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-champagne-dark min-h-11 px-2"
        >
          {t("schemeCard.vciWebsite")}
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </article>
  );
}
