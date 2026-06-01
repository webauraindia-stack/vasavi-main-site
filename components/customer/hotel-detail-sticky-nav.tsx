"use client";

import { Button } from "@/components/ui/button";
import { useAppLanguage } from "@/hooks/use-app-language";

interface HotelDetailStickyNavProps {
  hotelName: string;
}

export function HotelDetailStickyNav({ hotelName }: HotelDetailStickyNavProps) {
  const { t } = useAppLanguage();
  const scrollToBook = () => {
    const halls = document.getElementById("function-halls");
    const rooms = document.getElementById("rooms");
    (halls ?? rooms)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      {/* Mobile sticky bar */}
      <div className="fixed top-14 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-b border-charcoal/10 px-4 py-2 flex items-center justify-between gap-3 md:hidden">
        <p className="font-display text-sm text-charcoal truncate flex-1">{hotelName}</p>
        <Button size="sm" onClick={scrollToBook} className="shrink-0">
          {t("common.bookNow")}
        </Button>
      </div>

      {/* Desktop subnav */}
      <nav className="hidden md:block sticky top-16 z-30 bg-white/95 backdrop-blur-md border-b border-charcoal/10">
        <div className="page-container flex items-center gap-6 h-12 text-sm">
          {[
            { id: "overview", label: t("hotel.overview") },
            { id: "amenities", label: t("hotel.amenities") },
            { id: "rooms", label: t("hotel.rooms") },
            { id: "function-halls", label: "Function halls" },
            { id: "reviews", label: t("hotel.reviews") },
          ].map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="text-muted hover:text-champagne transition-colors"
            >
              {item.label}
            </a>
          ))}
          <Button size="sm" className="ml-auto" onClick={scrollToBook}>
            {t("common.bookNow")}
          </Button>
        </div>
      </nav>
    </>
  );
}
