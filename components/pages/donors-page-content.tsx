"use client";

import Link from "next/link";
import { Crown, GraduationCap, Users, Briefcase } from "lucide-react";
import { TIER_THRESHOLDS } from "@/lib/donor-engine";
import {
  COMMUNITY_SCHEMES,
  HOW_TO_JOIN_STEPS,
  FOUNDER,
  VCI_CONTACT,
} from "@/lib/data/vasavi-community";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SchemeCard } from "@/components/customer/scheme-card";
import { DonationForm } from "@/components/customer/donation-form";
import { useAppLanguage } from "@/hooks/use-app-language";

const perkIcons = [GraduationCap, Users, Briefcase, Crown] as const;
const perkKeys = [
  { title: "donors.perkKcgfTitle", desc: "donors.perkKcgfDesc" },
  { title: "donors.perkVkspTitle", desc: "donors.perkVkspDesc" },
  { title: "donors.perkSeTitle", desc: "donors.perkSeDesc" },
  { title: "donors.perkHotelTitle", desc: "donors.perkHotelDesc" },
] as const;

const stepKeys = [
  { title: "donors.step1Title", desc: "donors.step1Desc" },
  { title: "donors.step2Title", desc: "donors.step2Desc" },
  { title: "donors.step3Title", desc: "donors.step3Desc" },
] as const;

export function DonorsPageContent() {
  const { t } = useAppLanguage();

  return (
    <div className="pt-20 pb-16 bg-white">
      <section className="relative py-14 md:py-20 overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-gradient-to-br from-champagne/10 via-white to-white" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Badge variant="donor" className="mb-4">
            <Crown className="h-3 w-3 mr-1" />
            {t("donors.badge")}
          </Badge>
          <h1 className="font-display text-3xl md:text-5xl text-charcoal mb-4">
            {t("donors.headline")}
          </h1>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            {t("donors.introP1")}
          </p>
          <p className="text-sm md:text-base text-muted max-w-2xl mx-auto mb-4 leading-relaxed">
            {t("donors.introP2")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Link href="/login?callbackUrl=/donor-portal">
              <Button size="lg">{t("donors.accessPortal")}</Button>
            </Link>
            <a href={VCI_CONTACT.website} target="_blank" rel="noopener noreferrer">
              <Button variant="outline" size="lg">
                {t("donors.visitVci")}
              </Button>
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-10 text-center">
        <p className="text-xs uppercase tracking-widest text-champagne mb-2">
          {t("donors.founderSpirit", { honorific: FOUNDER.honorific })}
        </p>
        <p className="text-sm text-muted leading-relaxed">
          {t("donors.founderNote", {
            date: FOUNDER.date,
            place: FOUNDER.place,
            members: FOUNDER.foundingMembers,
          })}
        </p>
        <Link href="/founder" className="text-sm text-champagne hover:underline mt-3 inline-block">
          {t("donors.readFounder")}
        </Link>
      </section>

      <section className="py-12 md:py-16 bg-surface">
        <div className="page-container">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal text-center mb-2">
            {t("donors.communitySchemes")}
          </h2>
          <p className="text-sm text-muted text-center max-w-xl mx-auto mb-10">
            {t("donors.schemesIntro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {COMMUNITY_SCHEMES.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/schemes">
              <Button variant="outline">{t("donors.viewAllSchemes")}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="page-container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {perkKeys.map((perk, i) => {
            const Icon = perkIcons[i];
            return (
              <div key={perk.title} className="card-surface p-6 text-center">
                <Icon className="h-8 w-8 text-champagne mx-auto mb-4" />
                <h3 className="font-display text-lg text-charcoal mb-2">{t(perk.title)}</h3>
                <p className="text-sm text-muted leading-relaxed">{t(perk.desc)}</p>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-12 md:py-16 bg-surface">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="font-display text-2xl md:text-3xl text-charcoal text-center mb-10">
            {t("donors.howItWorks")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_TO_JOIN_STEPS.map(({ step }, i) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-champagne text-white font-display text-xl flex items-center justify-center mx-auto mb-4">
                  {step}
                </div>
                <h3 className="font-display text-lg text-charcoal mb-2">{t(stepKeys[i].title)}</h3>
                <p className="text-sm text-muted leading-relaxed">{t(stepKeys[i].desc)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="page-container py-12 md:py-16">
        <h2 className="font-display text-2xl md:text-3xl text-charcoal text-center mb-2">
          {t("donors.donorTiers")}
        </h2>
        <p className="text-sm text-muted text-center mb-10 max-w-lg mx-auto">{t("donors.tiersIntro")}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16">
          {TIER_THRESHOLDS.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-xl p-6 border border-charcoal/10 bg-white shadow-warm"
            >
              <h3 className="font-display text-2xl text-charcoal capitalize mb-1">{tier.name}</h3>
              <p className="text-sm text-champagne mb-1">{t("donors.kcgfAligned")}</p>
              <p className="text-sm text-muted mb-4">
                {formatCurrency(tier.minAmount)}
                {tier.maxAmount ? ` – ${formatCurrency(tier.maxAmount)}` : "+"}
              </p>
              <p className="text-3xl font-display text-champagne mb-4">
                {t("donors.percentOff", { percent: tier.discountPercent })}
              </p>
              <ul className="space-y-2">
                {tier.benefits.map((b) => (
                  <li key={b} className="text-sm text-muted flex items-start gap-2 leading-relaxed">
                    <span className="text-champagne mt-0.5 shrink-0">✦</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="font-display text-2xl md:text-3xl text-charcoal text-center mb-8">
          {t("donors.becomeDonor")}
        </h2>
        <DonationForm />
      </section>

      <section className="py-10 border-t border-charcoal/10">
        <div className="mx-auto max-w-xl px-4 text-center text-sm text-muted">
          <p>
            {t("donors.contactIntro")}{" "}
            <a href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline">
              {VCI_CONTACT.phone}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
