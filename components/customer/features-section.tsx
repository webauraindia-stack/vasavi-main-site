"use client";

import { motion } from "framer-motion";
import {
  BadgeIndianRupee,
  Building2,
  CheckCircle2,
  Search,
  SlidersHorizontal,
  Sparkles,
} from "lucide-react";
import { useAppLanguage } from "@/hooks/use-app-language";

const FEATURES = [
  {
    id: "search",
    titleKey: "features.search.title",
    titleDefault: "Search simply",
    descKey: "features.search.description",
    descDefault:
      "Find rooms across all Vasavi guest houses in seconds — filter by city, dates, and room type.",
    Icon: SearchSimplyIcon,
    accent: "from-champagne/15 to-surface",
  },
  {
    id: "compare",
    titleKey: "features.compare.title",
    titleDefault: "Compare confidently",
    descKey: "features.compare.description",
    descDefault:
      "Compare prices, amenities, and donor-exclusive rooms side by side before you book.",
    Icon: CompareConfidentlyIcon,
    accent: "from-champagne-dark/15 to-white",
  },
  {
    id: "save",
    titleKey: "features.save.title",
    titleDefault: "Save with community benefits",
    descKey: "features.save.description",
    descDefault:
      "Unlock donor-tier discounts and welfare rates on every spiritual stay.",
    Icon: SaveBigIcon,
    accent: "from-surface to-beige/30",
  },
] as const;

export function FeaturesSection() {
  const { t } = useAppLanguage();

  return (
    <section
      className="relative border-t border-beige bg-white py-14 sm:py-20 md:py-24"
      aria-labelledby="features-heading"
    >
      <div className="absolute inset-x-0 top-0 gold-divider opacity-70" />
      <div className="page-container">
        <div className="text-center max-w-2xl mx-auto mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 text-label text-champagne mb-3">
            <Sparkles className="h-3.5 w-3.5 text-champagne-dark" />
            {t("features.eyebrow")}
          </span>
          <h2 id="features-heading" className="font-display text-3xl md:text-4xl font-black text-charcoal">
            {t("features.title")}
          </h2>
        </div>

        <ul className="grid gap-4 md:grid-cols-3 md:gap-5">
          {FEATURES.map((feature, index) => (
            <motion.li
              key={feature.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: index * 0.08 }}
              className={`rounded-[var(--radius-devotional)] border border-beige/70 bg-gradient-to-br ${feature.accent} p-6 sm:p-7 shadow-warm hover:shadow-warm-md transition-shadow`}
            >
              <div className="mb-5" aria-hidden>
                <feature.Icon />
              </div>
              <h3 className="text-xl font-black text-charcoal leading-tight">
                {t(feature.titleKey)}
              </h3>
              <p className="mt-3 text-sm sm:text-base font-semibold text-muted leading-relaxed">
                {t(feature.descKey)}
              </p>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function SearchSimplyIcon() {
  return (
    <div className="relative flex h-[88px] w-[88px] items-center justify-center">
      <div className="absolute inset-0 rounded-2xl bg-white border border-beige shadow-warm" />
      <Building2 className="absolute bottom-3 left-3 h-9 w-9 text-champagne/30" strokeWidth={1.5} />
      <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full bg-champagne text-white shadow-warm-md">
        <Search className="h-7 w-7" strokeWidth={2.25} />
      </div>
    </div>
  );
}

function CompareConfidentlyIcon() {
  return (
    <div className="relative flex h-[88px] w-[100px] items-end justify-center gap-1">
      <Building2 className="h-10 w-10 text-champagne/40" strokeWidth={1.5} />
      <Building2 className="h-12 w-12 text-champagne mb-1" strokeWidth={1.75} />
      <div className="absolute -right-1 top-2 flex h-8 w-8 items-center justify-center rounded-lg bg-champagne-dark text-white shadow-warm">
        <SlidersHorizontal className="h-4 w-4" strokeWidth={2} />
      </div>
    </div>
  );
}

function SaveBigIcon() {
  return (
    <div className="relative flex h-[88px] w-[88px] items-center justify-center">
      <div className="absolute top-0 right-1 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 shadow-md">
        <CheckCircle2 className="h-5 w-5 text-white" strokeWidth={2.5} />
      </div>
      <div className="absolute top-1 left-0 flex h-9 w-9 items-center justify-center rounded-full bg-champagne-dark shadow-md">
        <BadgeIndianRupee className="h-5 w-5 text-white" strokeWidth={2.25} />
      </div>
      <div className="mt-3 flex h-16 w-20 items-center justify-center rounded-xl border-2 border-beige bg-white shadow-warm">
        <div className="space-y-1">
          <div className="h-2 w-14 rounded-full bg-champagne/20" />
          <div className="h-8 w-14 rounded-md bg-champagne/10 border border-champagne/20" />
        </div>
      </div>
    </div>
  );
}
