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
    <div className="pt-20 pb-20 bg-white">
      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-surface border-b border-beige">
        <div className="absolute inset-0 bg-gradient-to-br from-champagne/10 via-white to-white" />
        <div className="page-container relative text-center">
          <Badge variant="donor" className="mb-5">
            <Crown className="h-3 w-3 mr-1" />
            {t("donors.badge")}
          </Badge>
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-6 max-w-4xl mx-auto">
            {t("donors.headline")}
          </h1>
          <p className="text-base md:text-lg lg:text-xl text-muted max-w-3xl mx-auto mb-4 leading-relaxed">
            {t("donors.introP1")}
          </p>
          <p className="text-base md:text-lg lg:text-xl text-muted max-w-3xl mx-auto mb-6 leading-relaxed">
            {t("donors.introP2")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-8">
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

      {/* Founder note */}
      <section className="page-container py-12 md:py-16 text-center border-b border-beige/50">
        <p className="text-sm font-bold uppercase tracking-widest text-champagne mb-3">
          {t("donors.founderSpirit", { honorific: FOUNDER.honorific })}
        </p>
        <p className="text-base md:text-lg text-muted leading-relaxed max-w-3xl mx-auto">
          {t("donors.founderNote", {
            date: FOUNDER.date,
            place: FOUNDER.place,
            members: FOUNDER.foundingMembers,
          })}
        </p>
        <Link
          href="/founder"
          className="text-base text-champagne hover:underline mt-4 inline-block font-semibold"
        >
          {t("donors.readFounder")} →
        </Link>
      </section>

      {/* Community schemes */}
      <section className="py-14 md:py-20 bg-surface">
        <div className="page-container">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal text-center mb-3">
            {t("donors.communitySchemes")}
          </h2>
          <p className="text-base md:text-lg text-muted text-center max-w-2xl mx-auto mb-12">
            {t("donors.schemesIntro")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
            {COMMUNITY_SCHEMES.map((scheme) => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/schemes">
              <Button variant="outline">{t("donors.viewAllSchemes")}</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Perks */}
      <section className="page-container py-14 md:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {perkKeys.map((perk, i) => {
            const Icon = perkIcons[i];
            return (
              <div key={perk.title} className="card-surface p-7 md:p-8 text-center">
                <Icon className="h-9 w-9 text-champagne mx-auto mb-5" />
                <h3 className="font-display text-xl md:text-2xl text-charcoal mb-3">
                  {t(perk.title)}
                </h3>
                <p className="text-base text-muted leading-relaxed">{t(perk.desc)}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 md:py-20 bg-surface">
        <div className="page-container">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal text-center mb-14">
            {t("donors.howItWorks")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {HOW_TO_JOIN_STEPS.map(({ step }, i) => (
              <div key={step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-champagne text-white font-display text-2xl flex items-center justify-center mx-auto mb-5">
                  {step}
                </div>
                <h3 className="font-display text-xl md:text-2xl text-charcoal mb-3">
                  {t(stepKeys[i].title)}
                </h3>
                <p className="text-base md:text-lg text-muted leading-relaxed">
                  {t(stepKeys[i].desc)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Donor tiers */}
      <section className="page-container py-14 md:py-20">
        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal text-center mb-3">
          {t("donors.donorTiers")}
        </h2>
        <p className="text-base md:text-lg text-muted text-center mb-12 max-w-2xl mx-auto">
          {t("donors.tiersIntro")}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7 mb-20">
          {TIER_THRESHOLDS.map((tier) => (
            <div
              key={tier.tier}
              className="rounded-2xl p-7 border border-charcoal/10 bg-white shadow-warm"
            >
              <h3 className="font-display text-2xl md:text-3xl text-charcoal capitalize mb-2">
                {tier.name}
              </h3>
              <p className="text-base text-champagne mb-1">{t("donors.kcgfAligned")}</p>
              <p className="text-base text-muted mb-5">
                {formatCurrency(tier.minAmount)}
                {tier.maxAmount ? ` – ${formatCurrency(tier.maxAmount)}` : "+"}
              </p>
              <p className="text-4xl font-display text-champagne mb-5">
                {t("donors.percentOff", { percent: tier.discountPercent })}
              </p>
              <ul className="space-y-2.5">
                {tier.benefits.map((b) => (
                  <li
                    key={b}
                    className="text-base text-muted flex items-start gap-2 leading-relaxed"
                  >
                    <span className="text-champagne mt-0.5 shrink-0">✦</span>
                    {b}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h2 className="font-display text-3xl md:text-4xl text-charcoal text-center mb-10">
          {t("donors.becomeDonor")}
        </h2>
        <DonationForm />
      </section>

      {/* Footer contact */}
      <section className="py-10 border-t border-charcoal/10">
        <div className="page-container text-center text-base text-muted">
          <p>
            {t("donors.contactIntro")}{" "}
            <a href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline font-semibold">
              {VCI_CONTACT.phone}
            </a>
          </p>
        </div>
      </section>
    </div>
  );
}
