"use client";

import { useEffect, useState } from "react";

/**
 * Match a media query after mount. Returns `defaultMatches` until mounted (use for SSR-safe layout).
 */
export function useMediaQuery(query: string, defaultMatches = false): boolean {
  const [matches, setMatches] = useState(defaultMatches);

  useEffect(() => {
    const mq = window.matchMedia(query);
    const update = () => setMatches(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, [query]);

  return matches;
}
