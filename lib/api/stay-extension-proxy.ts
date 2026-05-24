import { resolveRequestAccessToken } from "@/lib/auth/server-access-token";

const ROLE_PORTAL_BASE =
  process.env.SUPERADMIN_URL ??
  process.env.NEXT_PUBLIC_ROLE_PORTAL_URL ??
  "http://localhost:3001";

export async function buildStayExtensionProxyHeaders(
  request: Request
): Promise<Headers> {
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);

  const token = await resolveRequestAccessToken(request);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return headers;
}

export { ROLE_PORTAL_BASE };
