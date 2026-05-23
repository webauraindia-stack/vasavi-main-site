"use client";

import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";
import { GlobalSearchBar } from "@/components/shared/global-search-bar";
import { useAppLanguage } from "@/hooks/use-app-language";
import { unsplash, U } from "@/lib/data/hotel-images";
import { IntroAnimation } from "@/components/customer/intro-animation";

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
      <section className="relative min-h-[88vh] flex items-end overflow-hidden">
      <Image
        src={unsplash(U.heritageInterior)}
        alt=""
        fill
        priority
        fetchPriority="high"
        className="object-cover scale-105"
        sizes="100vw"
      />
      <div className="absolute inset-0 hero-overlay shadow-[inset_0_-100px_120px_rgba(0,0,0,0.7)]" />
      <div className="absolute inset-0 section-shell opacity-20" />

      <div className="relative z-10 w-full pt-28 pb-10 sm:pt-32 sm:pb-14 lg:pb-16">
        <div className="page-container">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_1fr] lg:items-end lg:gap-10">
            <div className="text-white">
              <motion.div
                initial={{ opacity: 0, y: 24, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="inline-flex items-center gap-2 rounded-full border border-champagne-dark/40 bg-white/10 px-4 py-1.5 backdrop-blur-md mb-5"
              >
                <Sparkles className="h-3.5 w-3.5 text-champagne-dark" />
                <span className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-beige">
                  {t("hero.eyebrow")}
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 1, delay: 0.15, ease: "easeOut" }}
                className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white drop-shadow-lg font-black leading-[1.05] text-balance max-w-2xl"
              >
                {t("hero.title")}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                className="mt-4 max-w-xl text-base sm:text-lg text-beige/95 font-semibold leading-relaxed drop-shadow-md"
              >
                {t("hero.subtitle")}
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.24 }}
                className="mt-6 flex flex-wrap gap-2"
              >
                {POPULAR_DESTINATIONS.map((dest) => (
                  <Link
                    key={dest.label}
                    href={dest.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3.5 py-2 text-sm font-bold text-white backdrop-blur-sm transition-colors hover:bg-champagne-dark/25 hover:border-champagne-dark/50"
                  >
                    <MapPin className="h-3.5 w-3.5 text-champagne-dark" />
                    {dest.label}
                  </Link>
                ))}
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.2 }}
              className="w-full"
            >
              <p className="mb-3 text-center lg:text-left text-sm font-bold uppercase tracking-[0.16em] text-beige/90">
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
