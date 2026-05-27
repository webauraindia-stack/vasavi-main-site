import {
  buildStayExtensionProxyHeaders,
  ROLE_PORTAL_BASE,
} from "@/lib/api/stay-extension-proxy";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const target = `${ROLE_PORTAL_BASE}/api/stay-extensions${url.search}`;
  const headers = await buildStayExtensionProxyHeaders(request);
  const res = await fetch(target, { headers, cache: "no-store" });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function POST(request: Request) {
  const body = await request.text();
  const headers = await buildStayExtensionProxyHeaders(request);

  if (!headers.has("Authorization")) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  const res = await fetch(`${ROLE_PORTAL_BASE}/api/stay-extensions`, {
    method: "POST",
    headers,
    body,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}

export async function PATCH(request: Request) {
  const body = await request.text();
  const headers = await buildStayExtensionProxyHeaders(request);

  if (!headers.has("Authorization")) {
    return Response.json({ error: "Sign in required" }, { status: 401 });
  }

  const res = await fetch(`${ROLE_PORTAL_BASE}/api/stay-extensions`, {
    method: "PATCH",
    headers,
    body,
  });
  const data = await res.json();
  return Response.json(data, { status: res.status });
}
