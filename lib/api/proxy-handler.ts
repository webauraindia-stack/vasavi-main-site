import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

const HOP_BY_HOP = new Set([
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailers",
  "transfer-encoding",
  "upgrade",
  "host",
  "content-length",
]);

/** Normalize refresh cookie path so the browser sends it on all site routes. */
function rewriteSetCookie(header: string): string {
  return header
    .replace(/path=\/api\/v1\/[^;]*/gi, "path=/")
    .replace(/path=\/api\/backend\/[^;]*/gi, "path=/");
}

function forwardRequestHeaders(
  request: NextRequest,
  options?: { injectIdempotencyKey?: boolean }
): Headers {
  const headers = new Headers();
  let hasIdempotency = false;

  request.headers.forEach((value, key) => {
    const lower = key.toLowerCase();
    if (HOP_BY_HOP.has(lower)) return;
    if (
      lower === "cookie" ||
      lower === "authorization" ||
      lower === "content-type" ||
      lower === "x-idempotency-key"
    ) {
      headers.set(key, value);
      if (lower === "x-idempotency-key") {
        hasIdempotency = true;
      }
    }
  });

  if (
    options?.injectIdempotencyKey &&
    !hasIdempotency &&
    request.method !== "GET" &&
    request.method !== "HEAD"
  ) {
    headers.set("X-Idempotency-Key", crypto.randomUUID());
  }

  return headers;
}

/** Django requires trailing slashes when APPEND_SLASH=True (default). */
function djangoApiPath(segments: string[]): string {
  const subpath = segments.filter(Boolean).join("/");
  return subpath.endsWith("/") ? subpath : `${subpath}/`;
}

export async function proxyToBackend(
  request: NextRequest,
  pathSegments: string[]
): Promise<NextResponse> {
  const target = `${BACKEND_URL}/api/v1/${djangoApiPath(pathSegments)}${request.nextUrl.search}`;

  const headers = forwardRequestHeaders(request, { injectIdempotencyKey: true });
  const init: RequestInit = {
    method: request.method,
    headers,
    cache: "no-store",
  };

  if (request.method !== "GET" && request.method !== "HEAD") {
    init.body = await request.text();
  }

  const backendRes = await fetch(target, init);
  const body = await backendRes.text();

  const response = new NextResponse(body, {
    status: backendRes.status,
    headers: {
      "content-type":
        backendRes.headers.get("content-type") ?? "application/json",
    },
  });

  backendRes.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") return;
    for (const part of value.split(/,(?=\s*[^;]+=)/)) {
      response.headers.append("set-cookie", rewriteSetCookie(part.trim()));
    }
  });

  return response;
}
