"use client";

import Link from "next/link";
import { useAppLanguage } from "@/hooks/use-app-language";

export function PrivacyPageContent() {
  const { t } = useAppLanguage();

  return (
    <div className="pt-20 pb-16 bg-white">
      <div className="page-container max-w-3xl">
        <h1 className="font-display text-3xl text-charcoal mb-6">{t("privacyPage.title")}</h1>
        <p className="text-muted leading-relaxed mb-4">{t("privacyPage.p1")}</p>
        <p className="text-muted leading-relaxed mb-4">{t("privacyPage.p2")}</p>
        <p className="text-muted leading-relaxed mb-4">{t("privacyPage.p3")}</p>
        <p className="text-muted leading-relaxed">
          {t("privacyPage.p4a")}
          <Link href="/contact" className="text-champagne hover:underline">
            {t("privacyPage.contactLink")}
          </Link>
          {t("privacyPage.p4b")}
        </p>
      </div>
    </div>
  );
}
