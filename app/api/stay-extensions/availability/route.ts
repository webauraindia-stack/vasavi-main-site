import {
  buildStayExtensionProxyHeaders,
  ROLE_PORTAL_BASE,
} from "@/lib/api/stay-extension-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = `${ROLE_PORTAL_BASE}/api/stay-extensions/availability${url.search}`;
  const headers = await buildStayExtensionProxyHeaders(request);

  if (!headers.has("Authorization")) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  const res = await fetch(target, { headers, cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
