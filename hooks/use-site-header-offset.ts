"use client";

import { useEffect } from "react";

const NAVBAR_BORDER_PX = 3;
const BANNER_HEIGHT_PX = 44;

/** Keeps `--site-header-offset` in sync with navbar + optional payment banner. */
export function useSiteHeaderOffset(hasBanner: boolean) {
  useEffect(() => {
    const sync = () => {
      const isLg = window.matchMedia("(min-width: 1024px)").matches;
      const navHeight = isLg ? 80 : 64;
      const bannerHeight = hasBanner ? BANNER_HEIGHT_PX : 0;
      const total = navHeight + bannerHeight + NAVBAR_BORDER_PX;

      document.documentElement.style.setProperty("--navbar-height", `${navHeight}px`);
      document.documentElement.style.setProperty("--navbar-banner-height", `${bannerHeight}px`);
      document.documentElement.style.setProperty("--site-header-offset", `${total}px`);
    };

    sync();
    window.addEventListener("resize", sync);
    return () => window.removeEventListener("resize", sync);
  }, [hasBanner]);
}
