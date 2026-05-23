"use client";

import { useEffect } from "react";
import { useDonorStore } from "@/stores/donor-store";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";

/** Load donor coupon wallet from the API when a donor session is active. */
export function ApiSessionSync() {
  const { isAuthenticated, accessToken, session, withAccessToken } =
    useAuthenticatedSession();
  const hydrateFromApi = useDonorStore((s) => s.hydrateFromApi);

  useEffect(() => {
    if (!isAuthenticated || !accessToken || !session?.user?.isDonor) return;

    void withAccessToken((token) => hydrateFromApi(token)).catch(() => {
      /* sign-out handled by useAuthenticatedSession on refresh failure */
    });
  }, [
    isAuthenticated,
    accessToken,
    session?.user?.isDonor,
    hydrateFromApi,
    withAccessToken,
  ]);

  return null;
}
