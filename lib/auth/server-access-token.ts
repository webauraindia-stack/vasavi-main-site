import { auth } from "@/auth";
import { isJwtExpired } from "@/lib/auth/jwt";
import { shouldRefreshAccessToken } from "@/lib/auth/token-lifetime";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

type ApiEnvelope<T> = { success: boolean; data?: T };

function bearerFromRequest(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (header?.startsWith("Bearer ")) return header.slice(7);
  return null;
}

function tokenIsUsable(
  token: string,
  sessionExpiresAtMs?: number
): boolean {
  if (isJwtExpired(token)) return false;
  if (sessionExpiresAtMs !== undefined && shouldRefreshAccessToken(sessionExpiresAtMs)) {
    return false;
  }
  return true;
}

/** Exchange `vasavi_refresh` cookie for a new access JWT (server-side). */
export async function refreshCustomerAccessFromCookies(
  cookieHeader: string
): Promise<string | null> {
  if (!cookieHeader.trim()) return null;

  try {
    const res = await fetch(`${BACKEND_URL}/api/v1/accounts/token/refresh/`, {
      method: "POST",
      headers: {
        Cookie: cookieHeader,
        "Content-Type": "application/json",
      },
      body: "{}",
      cache: "no-store",
    });
    if (!res.ok) return null;
    const payload = (await res.json()) as ApiEnvelope<{ access: string }>;
    if (payload.success && payload.data?.access) {
      return payload.data.access;
    }
  } catch {
    /* fall through */
  }
  return null;
}

/**
 * Valid access token for API routes: prefers a non-expired bearer/session token,
 * otherwise refreshes using the httpOnly refresh cookie.
 */
export async function resolveRequestAccessToken(
  request: Request
): Promise<string | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const bearerToken = bearerFromRequest(request);
  const session = await auth();
  const sessionToken = (session as { accessToken?: string } | null)?.accessToken ?? null;
  const sessionExpires = (session as { accessTokenExpires?: number } | null)
    ?.accessTokenExpires;

  if (bearerToken && tokenIsUsable(bearerToken)) {
    return bearerToken;
  }
  if (sessionToken && tokenIsUsable(sessionToken, sessionExpires)) {
    return sessionToken;
  }

  return refreshCustomerAccessFromCookies(cookie);
}
