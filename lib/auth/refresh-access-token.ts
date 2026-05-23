import { parseApiErrorMessage } from "@/lib/api/parse-error";
import type { ApiResponse } from "@/lib/api/types";
import { SessionExpiredError } from "@/lib/auth/session-expired";

type RefreshPayload = { access: string };

let inFlightRefresh: Promise<string> | null = null;

/**
 * Exchange the httpOnly `vasavi_refresh` cookie for a new access token.
 * Deduplicates concurrent refresh calls (e.g. multiple API requests on 401).
 */
export async function refreshAccessToken(): Promise<string> {
  if (inFlightRefresh) {
    return inFlightRefresh;
  }

  inFlightRefresh = (async () => {
    const response = await fetch("/api/auth/token/refresh", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-Idempotency-Key": crypto.randomUUID(),
      },
      body: "{}",
      cache: "no-store",
    });

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new SessionExpiredError();
    }

    if (!response.ok) {
      const message = parseApiErrorMessage(
        payload,
        "Your session has expired. Please sign in again."
      );
      throw new SessionExpiredError(message);
    }

    const envelope = payload as ApiResponse<RefreshPayload>;
    if (envelope.success === false || !envelope.data?.access) {
      throw new SessionExpiredError(
        parseApiErrorMessage(payload, "Could not refresh session.")
      );
    }

    return envelope.data.access;
  })();

  try {
    return await inFlightRefresh;
  } finally {
    inFlightRefresh = null;
  }
}
