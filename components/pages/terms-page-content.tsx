"use client";

import Link from "next/link";
import { useAppLanguage } from "@/hooks/use-app-language";

export function TermsPageContent() {
  const { t } = useAppLanguage();

  return (
    <div className="pt-20 pb-16 bg-white">
      <div className="page-container max-w-3xl">
        <h1 className="font-display text-3xl text-charcoal mb-6">{t("termsPage.title")}</h1>
        <p className="text-muted leading-relaxed mb-4">{t("termsPage.p1")}</p>
        <p className="text-muted leading-relaxed mb-4">
          {t("termsPage.p2a")}
          <Link href="/donors" className="text-champagne hover:underline">
            {t("termsPage.donorProgramLink")}
          </Link>
          {t("termsPage.p2b")}
        </p>
        <p className="text-muted leading-relaxed">{t("termsPage.p3")}</p>
      </div>
    </div>
  );
}
