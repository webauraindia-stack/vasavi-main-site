"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";
import { GlobalSearchBar } from "@/components/shared/global-search-bar";
import { useAppLanguage } from "@/hooks/use-app-language";
import { IntroAnimation } from "@/components/customer/intro-animation";

// HD 1920-wide, q=90 — no resizing artefacts
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=90";

export function HeroSection() {
  const { t } = useAppLanguage();

  const POPULAR_DESTINATIONS = [
    { label: t("hero.destTirupati"), href: "/search?hotel=2" },
    { label: t("hero.destVijayawada"), href: "/search?hotel=3" },
    { label: t("hero.destHyderabad"), href: "/search?hotel=1" },
    { label: t("hero.destAll"), href: "/search" },
  ];

  return (
    <>
      <IntroAnimation onComplete={() => {}} />

      <section className="relative min-h-[88vh] flex items-end overflow-hidden max-w-[100vw]">
        {/* ── Pure HD image — absolutely no colour overlay ── */}
        <Image
          src={HERO_IMAGE}
          alt="South Indian devotional festival and temple stay"
          fill
          priority
          fetchPriority="high"
          className="object-cover object-center"
          sizes="100vw"
        />

        {/* Only a paper-thin bottom scrim so the gold divider line reads */}
        <div
          className="absolute inset-x-0 bottom-0 h-16 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.18), transparent)" }}
          aria-hidden
        />

        {/* Content */}
        <div className="relative z-10 w-full min-w-0 max-w-full pt-[var(--site-header-offset,5.25rem)] pb-8 sm:pt-32 sm:pb-14 lg:pb-16">
          <div className="page-container min-w-0 max-w-full">
            <div className="grid min-w-0 max-w-full gap-6 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-10">

              {/* Left — frosted glass text card, no tint on image */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className="rounded-2xl bg-black/25 backdrop-blur-[6px] border border-white/8 p-4 sm:p-8 lg:bg-black/40 lg:backdrop-blur-md lg:border-white/10 overflow-hidden w-full min-w-0 max-w-full order-2 lg:order-1"
              >
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-champagne-dark/60 bg-white/10 px-3 py-1.5 mb-3.5 sm:mb-5 sm:px-4">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-champagne-dark" />
                  <span className="truncate text-[0.625rem] sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.18em] text-champagne-dark">
                    {t("hero.eyebrow")}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-black leading-[1.08] text-balance break-words">
                  {t("hero.title")}
                </h1>

                <p className="mt-3 sm:mt-4 text-[0.875rem] sm:text-lg text-white/90 font-semibold leading-relaxed">
                  {t("hero.subtitle")}
                </p>

                <div className="mt-5 flex flex-wrap gap-2 w-full lg:mt-6 lg:p-0">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <Link
                      key={dest.label}
                      href={dest.href}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-champagne-dark/50 bg-white/10 px-3.5 py-2 text-xs sm:text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-champagne-dark/30 hover:border-champagne-dark/80"
                    >
                      <MapPin className="h-3.5 w-3.5 text-champagne-dark" />
                      {dest.label}
                    </Link>
                  ))}
                </div>
              </motion.div>

              {/* Right — search card */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="w-full min-w-0 max-w-full order-1 lg:order-2"
              >
                <p className="mb-3 text-center lg:text-left text-xs sm:text-sm font-bold uppercase tracking-[0.12em] sm:tracking-[0.16em] text-white drop-shadow-md px-0.5">
                  {t("hero.searchPrompt")}
                </p>
                <Suspense
                  fallback={
                    <div className="h-[240px] w-full rounded-[var(--radius-devotional)] border border-white/20 bg-white/10 animate-pulse backdrop-blur-sm" />
                  }
                >
                  <GlobalSearchBar variant="hero" />
                </Suspense>
              </motion.div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 gold-divider opacity-80" />
      </section>
    </>
  );
}
