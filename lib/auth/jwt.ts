import { ACCESS_TOKEN_REFRESH_BUFFER_MS } from "@/lib/auth/token-lifetime";

/** Decode JWT `exp` (seconds) without verifying signature — expiry check only. */
export function getJwtExpiryMs(accessToken: string): number | null {
  try {
    const segment = accessToken.split(".")[1];
    if (!segment) return null;
    const base64 = segment.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof Buffer !== "undefined"
        ? Buffer.from(base64, "base64").toString("utf8")
        : atob(base64);
    const payload = JSON.parse(json) as { exp?: number };
    return typeof payload.exp === "number" ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isJwtExpired(
  accessToken: string,
  bufferMs: number = ACCESS_TOKEN_REFRESH_BUFFER_MS
): boolean {
  const expMs = getJwtExpiryMs(accessToken);
  if (!expMs) return false;
  return Date.now() >= expMs - bufferMs;
}
