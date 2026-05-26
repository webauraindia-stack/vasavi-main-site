"use client";

import Image from "next/image";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Award, BookOpen, Flag, Landmark, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FOUNDER, VCI_CONTACT } from "@/lib/data/vasavi-community";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";

export function FounderPageContent() {
  const { t } = useAppLanguage();
  return (
    <div className="pt-16 bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-champagne/15 bg-surface">
        <div className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(var(--color-champagne)_1px,transparent_1px)] [background-size:20px_20px]" />
        <div className="page-container relative py-12 md:py-20">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,340px)_1fr] lg:gap-14 lg:items-center">
            <div className="mx-auto w-full max-w-[340px] lg:mx-0">
              <div className="relative rounded-2xl border-4 border-champagne-dark/40 bg-white p-2 shadow-warm-lg">
                <div className="relative aspect-[3/4] overflow-hidden rounded-xl">
                  <Image
                    src={FOUNDER.image}
                    alt={FOUNDER.fullName}
                    fill
                    priority
                    className="object-cover object-top"
                    sizes="(max-width: 1024px) 340px, 340px"
                  />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-champagne px-4 py-1.5 text-xs font-bold uppercase tracking-wide text-white shadow-warm">
                  {t("founder.freedomFighter")}
                </div>
              </div>
              <p className="mt-5 text-center text-sm font-semibold text-charcoal/75 lg:text-left">
                {t("founder.portraitCourtesy")}{" "}
                <a
                  href={FOUNDER.imageSource}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-champagne hover:underline"
                >
                  {t("founder.vciName")}
                </a>
              </p>
            </div>

            <div className="text-center lg:text-left">
              <p className="text-sm font-bold uppercase tracking-wide text-champagne mb-4">
                {t("founder.heritageEyebrow")}
              </p>
              <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-charcoal leading-tight mb-3">
                {t("founder.honorific")}
              </h1>
              <p className="font-display text-xl sm:text-2xl text-champagne-dark mb-5">
                {t("founder.title")}
              </p>
              <p className="text-base md:text-lg font-semibold text-charcoal/80 mb-6">
                {t("founder.dates", { born: FOUNDER.born, died: FOUNDER.died })}
              </p>
              <p className="text-lg md:text-xl font-semibold text-charcoal leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 whitespace-pre-line">
                {t("founder.bio")}
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                <Link href="/schemes">
                  <Button>{t("founder.communitySchemesBtn")}</Button>
                </Link>
                <Link href="/donors">
                  <Button variant="outline">{t("founder.donorProgramBtn")}</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Milestones */}
      <section className="py-14 md:py-20 border-b border-charcoal/5">
        <div className="page-container max-w-5xl">
          <SectionHeading icon={Landmark} title={t("founder.lifeOfService")} />
          <div className="mt-8 relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-champagne/25 md:-translate-x-px" />
            <ol className="space-y-8">
              {FOUNDER.timeline.map((item, i) => (
                <li
                  key={`${item.year}-${item.title}`}
                  className={`relative flex flex-col md:flex-row gap-4 md:gap-8 ${
                    i % 2 === 0 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  <div className="hidden md:block md:w-1/2" />
                  <div
                    className={`md:w-1/2 pl-10 md:pl-0 ${
                      i % 2 === 0 ? "md:pr-12 md:text-right" : "md:pl-12"
                    }`}
                  >
                    <span className="absolute left-2.5 md:left-1/2 md:-translate-x-1/2 flex h-3 w-3 rounded-full bg-champagne ring-4 ring-white" />
                    <p className="font-display text-xl text-champagne">{item.year}</p>
                    <p className="text-lg font-bold text-charcoal mt-0.5">{item.title}</p>
                    <p className="text-base md:text-lg font-semibold text-charcoal/80 mt-1">{item.detail}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Bio-data */}
      <section className="py-14 md:py-20 bg-surface/60">
        <div className="page-container max-w-5xl">
          <SectionHeading icon={Users} title={t("founder.bioData")} />
          <p className="text-base md:text-lg text-muted mt-2 mb-8 text-center md:text-left">
            {t("founder.asRecordedBy")}{" "}
            <a
              href={FOUNDER.imageSource}
              target="_blank"
              rel="noopener noreferrer"
              className="text-champagne hover:underline"
            >
              {t("founder.vciName")}
            </a>
          </p>
          <dl className="grid sm:grid-cols-2 gap-4">
            {FOUNDER.personalDetails.map((row) => (
              <div
                key={row.label}
                className="rounded-xl border border-charcoal/10 bg-white p-5 shadow-warm"
              >
                <dt className="text-xs font-bold uppercase tracking-wide text-charcoal/70">
                  {row.label}
                </dt>
                <dd className="mt-1.5 text-base md:text-lg font-semibold text-charcoal leading-snug">{row.value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <HighlightStat label={t("founder.founded")} value={String(FOUNDER.year)} />
            <HighlightStat label={t("founder.firstClub")} value={FOUNDER.place} />
            <HighlightStat label={t("founder.members")} value={String(FOUNDER.foundingMembers)} />
          </div>
        </div>
      </section>

      {/* Political & Social */}
      <section className="py-14 md:py-16">
        <div className="page-container grid md:grid-cols-2 gap-10">
          <ContentCard
            icon={Flag}
            title={t("founder.politicalLife")}
            items={FOUNDER.political}
          />
          <div className="space-y-10">
            <ContentCard
              icon={Users}
              title={t("founder.orgsFounded")}
              items={FOUNDER.organizationsFounded}
            />
            <ContentCard icon={Users} title={t("founder.socialRoles")} items={FOUNDER.socialRoles} />
          </div>
        </div>
      </section>

      {/* Publications & Awards */}
      <section className="py-14 md:py-16 bg-charcoal text-white">
        <div className="page-container grid md:grid-cols-2 gap-10">
          <ContentCard
            icon={BookOpen}
            title={t("founder.publications")}
            items={FOUNDER.publications}
            variant="dark"
          />
          <div className="space-y-10">
            <ContentCard icon={Award} title={t("founder.awards")} items={FOUNDER.awards} variant="dark" />
            <ContentCard
              icon={BookOpen}
              title={t("founder.booksDedicated")}
              items={FOUNDER.booksDedicated}
              variant="dark"
            />
          </div>
        </div>
      </section>

      {/* Legacy CTA */}
      <section className="py-16 md:py-24">
        <div className="page-container max-w-4xl text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-charcoal mb-5">
            {t("founder.legacyTitle")}
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted leading-relaxed mb-10">{t("founder.legacy")}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/search">
              <Button size="lg">{t("founder.bookGuestHouse")}</Button>
            </Link>
            <a href={VCI_CONTACT.website} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline">
                {t("founder.visitVci")}
              </Button>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}

function SectionHeading({
  icon: Icon,
  title,
}: {
  icon: LucideIcon;
  title: string;
}) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-3">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-champagne/10 text-champagne">
        <Icon className="h-6 w-6" />
      </span>
      <h2 className="font-display text-3xl md:text-4xl text-charcoal">{title}</h2>
    </div>
  );
}

function HighlightStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-champagne/20 bg-champagne/5 p-5 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-charcoal/70">{label}</p>
      <p className="font-display text-2xl md:text-3xl text-champagne mt-2">{value}</p>
    </div>
  );
}

function ContentCard({
  icon: Icon,
  title,
  items,
  variant = "light",
}: {
  icon: LucideIcon;
  title: string;
  items: readonly string[];
  variant?: "light" | "dark";
}) {
  const isDark = variant === "dark";
  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <span
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-full",
            isDark ? "bg-white/10 text-champagne-dark" : "bg-champagne/10 text-champagne"
          )}
        >
          <Icon className="h-5 w-5" />
        </span>
        <h3 className={cn("font-display text-2xl md:text-3xl", isDark ? "text-white" : "text-charcoal")}>
          {title}
        </h3>
      </div>
      <ul className="space-y-3.5">
        {items.map((item) => (
          <li
            key={item}
            className={cn(
              "flex gap-3 text-base md:text-lg font-semibold leading-relaxed",
              isDark ? "text-white/90" : "text-charcoal"
            )}
          >
            <span
              className={cn(
                "mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full",
                isDark ? "bg-champagne-dark" : "bg-champagne"
              )}
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
