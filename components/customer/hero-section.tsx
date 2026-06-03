"use client";

import { Suspense, useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, MapPin } from "lucide-react";
import { GlobalSearchBar } from "@/components/shared/global-search-bar";
import { useAppLanguage } from "@/hooks/use-app-language";
import { IntroAnimation } from "@/components/customer/intro-animation";
import { useSearchStore } from "@/stores/search-store";
import { useHotelsCatalog } from "@/lib/context/hotels-catalog";
import type { AppLanguage } from "@/lib/i18n";

// Dynamic spiritual Hindu temple images maps representing the local cities (strictly non-Islamic, glorious temple structures)
const CITY_TEMPLE_IMAGES: Record<string, { url: string; templeName: string; langCode: AppLanguage; langName: string }> = {
  "hyderabad": {
    url: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Birla Mandir & Sri Kanyaka Parameswari Temple",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "tirupati": {
    url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=90",
    templeName: "Tirumala Sri Venkateswara Swamy Temple",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "vijayawada": {
    url: "https://images.unsplash.com/photo-1600100397608-f010e4ba7dbd?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Kanaka Durga Temple",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "visakhapatnam": {
    url: "https://images.unsplash.com/photo-1621252179027-94459d278660?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Varaha Lakshmi Narasimha Temple, Simhachalam",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "bengaluru": {
    url: "https://images.unsplash.com/photo-1601058498421-a67500c5c369?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Someshwara Swamy Temple & Bull Temple",
    langCode: "kn",
    langName: "Kannada (ಕನ್ನಡ)"
  },
  "chennai": {
    url: "https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1920&q=90",
    templeName: "Kapaleeshwarar Temple, Mylapore",
    langCode: "ta",
    langName: "Tamil (தமிழ்)"
  },
  "srisailam": {
    url: "https://images.unsplash.com/photo-1600100397998-32ee0e94bb55?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Bhramaramba Mallikarjuna Jyotirlinga Temple",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "warangal": {
    url: "https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?auto=format&fit=crop&w=1920&q=90",
    templeName: "Bhadrakali Temple & Thousand Pillar Temple",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "rajahmundry": {
    url: "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1920&q=90",
    templeName: "Kotilingeshwara Temple & Sacred Godavari Ghats",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "kakinada": {
    url: "https://images.unsplash.com/photo-1614082242765-7c98ca0f3df3?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Bhimeswara Swamy Temple, Samalkot",
    langCode: "te",
    langName: "Telugu (తెలుగు)"
  },
  "mysore": {
    url: "https://images.unsplash.com/photo-1599930113854-d6d7fd521f10?auto=format&fit=crop&w=1920&q=90",
    templeName: "Sri Chamundeshwari Temple, Chamundi Hills",
    langCode: "kn",
    langName: "Kannada (ಕನ್ನಡ)"
  }
};

const DEFAULT_TEMPLE = {
  url: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1920&q=90",
  templeName: "Sri Venkateswara Temple",
  langCode: "te" as AppLanguage,
  langName: "Telugu (తెలుగు)"
};

function cityKeyFromHotelId(
  hotelId: string | null,
  hotels: { id: string; city: string }[]
): string {
  if (!hotelId) return "hyderabad";
  const selectedHotel = hotels.find((h) => h.id === hotelId);
  if (!selectedHotel) return "hyderabad";
  const cityLower = selectedHotel.city.toLowerCase();
  return CITY_TEMPLE_IMAGES[cityLower] ? cityLower : "hyderabad";
}

export function HeroSection() {
  const { t } = useAppLanguage();
  const { hotelId, setHotel } = useSearchStore();
  const { hotels } = useHotelsCatalog();
  const [activeCityKey, setActiveCityKey] = useState("hyderabad");

  const POPULAR_DESTINATIONS = useMemo(() => {
    const hotelForCity = (cityKey: string) =>
      hotels.find((h) => h.city.toLowerCase() === cityKey)?.id ?? null;

    return [
      {
        label: t("hero.destTirupati"),
        cityKey: "tirupati",
        hotelId: hotelForCity("tirupati"),
      },
      {
        label: t("hero.destVijayawada"),
        cityKey: "vijayawada",
        hotelId: hotelForCity("vijayawada"),
      },
      {
        label: t("hero.destHyderabad"),
        cityKey: "hyderabad",
        hotelId: hotelForCity("hyderabad"),
      },
    ];
  }, [hotels, t]);

  useEffect(() => {
    setActiveCityKey(cityKeyFromHotelId(hotelId, hotels));
  }, [hotelId, hotels]);

  const templeInfo = useMemo(
    () => CITY_TEMPLE_IMAGES[activeCityKey] ?? DEFAULT_TEMPLE,
    [activeCityKey]
  );

  // Intro animation visibility state to completely unmount once played
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const hasPlayed = sessionStorage.getItem("vasavi_intro_played");
    if (hasPlayed) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowIntro(false);
    }
  }, []);

  const isDestinationActive = (cityKey: string, destHotelId: string | null) =>
    activeCityKey === cityKey ||
    (destHotelId !== null && hotelId === destHotelId);

  const selectDestination = (cityKey: string, destHotelId: string | null) => {
    setActiveCityKey(cityKey);
    if (destHotelId) setHotel(destHotelId);
  };

  return (
    <>
      {showIntro && (
        <IntroAnimation onComplete={() => setShowIntro(false)} />
      )}

      <section className="relative min-h-[92vh] flex w-full max-w-full items-end overflow-hidden bg-charcoal">
        
        {/* Dynamic Landscape Spiritual Background Image */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCityKey}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full"
          >
            <Image
              src={templeInfo.url}
              alt={templeInfo.templeName}
              fill
              priority
              fetchPriority="high"
              className="object-cover object-center"
              sizes="100vw"
            />
            {/* Spiritual layout darkening overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#1f0a0a]/90 via-[#4a0e0e]/45 to-black/60" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 w-full min-w-0 max-w-full pt-[var(--site-header-offset,5.25rem)] pb-12 sm:pt-32 sm:pb-16 lg:pb-20">
          <div className="page-container min-w-0 max-w-full">
            <div className="grid min-w-0 max-w-full gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-12">

              {/* Left Column — Devotional Info (desktop only) */}
              <motion.div
                initial={{ opacity: 0, y: 28 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.75, ease: "easeOut" }}
                className="hidden lg:block rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 p-5 sm:p-8 overflow-hidden w-full min-w-0 max-w-full order-2 lg:order-1 relative shadow-warm-lg"
              >
                <div className="inline-flex max-w-full items-center gap-2 rounded-full border border-[#c9a84c]/60 bg-white/10 px-3.5 py-1.5 mb-5">
                  <Sparkles className="h-4 w-4 shrink-0 text-[#c9a84c]" />
                  <span className="truncate text-xs font-bold uppercase tracking-[0.15em] text-[#c9a84c]">
                    {templeInfo.templeName}
                  </span>
                </div>

                <h1 className="font-display text-2xl sm:text-4xl lg:text-5xl xl:text-6xl text-white font-black leading-[1.1] text-balance break-words">
                  {t("hero.title")}
                </h1>

                <p className="mt-4 text-sm sm:text-lg text-white/90 font-semibold leading-relaxed font-body">
                  {t("hero.subtitle")}
                </p>

                <div className="mt-6 flex flex-wrap gap-2.5 w-full">
                  {POPULAR_DESTINATIONS.map((dest) => (
                    <button
                      key={dest.cityKey}
                      type="button"
                      onClick={() => selectDestination(dest.cityKey, dest.hotelId)}
                      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2.5 text-xs sm:text-sm font-bold backdrop-blur-sm transition-all duration-300 ${
                        isDestinationActive(dest.cityKey, dest.hotelId)
                        ? "border-[#c9a84c] bg-[#c9a84c]/30 text-white shadow-md scale-105" 
                        : "border-white/20 bg-white/10 text-white hover:bg-[#c9a84c]/20 hover:border-[#c9a84c]/50"
                      }`}
                    >
                      <MapPin className="h-4 w-4 text-[#c9a84c]" />
                      {dest.label}
                    </button>
                  ))}
                </div>
              </motion.div>

              {/* Right Column — Global search bar */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.65, delay: 0.2 }}
                className="w-full min-w-0 max-w-full lg:order-2"
              >
                <p className="mb-3.5 hidden lg:block text-left text-xs sm:text-sm font-bold uppercase tracking-[0.15em] text-white drop-shadow-md px-1">
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
