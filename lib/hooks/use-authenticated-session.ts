"use client";

import { useCallback } from "react";
import { signOut, useSession } from "next-auth/react";
import { ApiClientError } from "@/lib/api/client";
import { refreshAccessToken } from "@/lib/auth/refresh-access-token";
import {
  isSessionExpiredError,
  isUnauthorizedError,
  SessionExpiredError,
} from "@/lib/auth/session-expired";
import { accessTokenExpiresAt } from "@/lib/auth/token-lifetime";

type SessionWithToken = {
  accessToken?: string;
  accessTokenExpires?: number;
  error?: string;
};

/**
 * Wraps NextAuth session with access-token refresh on 401 and session update.
 */
export function useAuthenticatedSession() {
  const { data: session, status, update } = useSession();
  const sessionWithToken = session as SessionWithToken | null;

  const applyFreshAccessToken = useCallback(
    async (accessToken: string) => {
      await update({
        accessToken,
        accessTokenExpires: accessTokenExpiresAt(),
      });
      return accessToken;
    },
    [update]
  );

  const refreshSession = useCallback(async (): Promise<string> => {
    const fresh = await refreshAccessToken();
    return applyFreshAccessToken(fresh);
  }, [applyFreshAccessToken]);

  const signOutExpired = useCallback(async (message?: string) => {
    await signOut({
      callbackUrl: `/login?session=expired${message ? `&reason=${encodeURIComponent(message)}` : ""}`,
    });
  }, []);

  /**
   * Run an API call with the current access token; on 401, refresh once and retry.
   */
  const withAccessToken = useCallback(
    async <T>(fn: (accessToken: string) => Promise<T>): Promise<T> => {
      let token = sessionWithToken?.accessToken;
      if (!token) {
        throw new ApiClientError("AUTH_REQUIRED", "Please sign in to continue.", 401);
      }

      try {
        return await fn(token);
      } catch (error) {
        if (!isUnauthorizedError(error)) {
          throw error;
        }

        try {
          token = await refreshSession();
          return await fn(token);
        } catch (refreshError) {
          if (isSessionExpiredError(refreshError)) {
            await signOutExpired(refreshError.message);
          }
          throw refreshError;
        }
      }
    },
    [sessionWithToken?.accessToken, refreshSession, signOutExpired]
  );

  const isAuthenticated =
    status === "authenticated" &&
    Boolean(sessionWithToken?.accessToken) &&
    sessionWithToken?.error !== "RefreshTokenError";

  return {
    session,
    status,
    isAuthenticated,
    accessToken: sessionWithToken?.accessToken,
    accessTokenExpires: sessionWithToken?.accessTokenExpires,
    sessionError: sessionWithToken?.error,
    withAccessToken,
    refreshSession,
    signOutExpired,
  };
}

export { SessionExpiredError };
