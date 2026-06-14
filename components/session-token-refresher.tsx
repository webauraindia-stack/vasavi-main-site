"use client";

import { useEffect, useRef } from "react";
import { signOut, useSession } from "next-auth/react";
import { refreshAccessToken } from "@/lib/auth/refresh-access-token";
import { isSessionExpiredError } from "@/lib/auth/session-expired";
import {
  accessTokenExpiresAt,
  PROACTIVE_REFRESH_INTERVAL_MS,
  shouldRefreshAccessToken,
} from "@/lib/auth/token-lifetime";

/**
 * Keeps the NextAuth access token in sync with the httpOnly refresh cookie before expiry.
 * Signs the user out when the refresh token is expired or missing.
 */
export function SessionTokenRefresher() {
  const { data: session, status, update } = useSession();
  const refreshingRef = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || !session?.accessToken) {
      return;
    }

    const expiresAt = (session as { accessTokenExpires?: number }).accessTokenExpires;

    let cancelled = false;

    const runRefresh = async () => {
      if (refreshingRef.current || cancelled) return;

      // Sessions created before we tracked expiry: backfill without calling refresh.
      if (!expiresAt) {
        await update({
          accessToken: session.accessToken,
          accessTokenExpires: accessTokenExpiresAt(),
        });
        return;
      }

      if (!shouldRefreshAccessToken(expiresAt)) return;

      refreshingRef.current = true;
      try {
        const access = await refreshAccessToken();
        if (cancelled) return;
        await update({
          accessToken: access,
          accessTokenExpires: accessTokenExpiresAt(),
        });
      } catch (error) {
        if (cancelled) return;
        if (isSessionExpiredError(error)) {
          console.warn("[auth] Session expired — signing out:", (error as Error).message);
          void signOut({
            callbackUrl: `/login?session=expired&reason=${encodeURIComponent((error as Error).message)}`,
          });
          return;
        }
      } finally {
        refreshingRef.current = false;
      }
    };

    void runRefresh();

    const interval = window.setInterval(() => {
      void runRefresh();
    }, PROACTIVE_REFRESH_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [
    status,
    session?.accessToken,
    (session as { accessTokenExpires?: number } | null)?.accessTokenExpires,
    update,
  ]);

  return null;
}
