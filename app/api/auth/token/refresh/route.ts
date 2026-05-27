import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";

/** Refresh access JWT using httpOnly vasavi_refresh cookie; rotate refresh cookie for browser. */
export async function POST(request: NextRequest) {
  const cookieHeader = request.headers.get("cookie") ?? "";

  const backendRes = await fetch(`${BACKEND_URL}/api/v1/accounts/token/refresh/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Idempotency-Key": crypto.randomUUID(),
      cookie: cookieHeader,
    },
    body: "{}",
    cache: "no-store",
  });

  const body = await backendRes.text();
  const response = new NextResponse(body, {
    status: backendRes.status,
    headers: {
      "content-type": backendRes.headers.get("content-type") ?? "application/json",
    },
  });

  backendRes.headers.forEach((value, key) => {
    if (key.toLowerCase() !== "set-cookie") return;
    for (const part of value.split(/,(?=\s*[^;]+=)/)) {
      const rewritten = part
        .trim()
        .replace(/path=\/api\/v1\/[^;]*/gi, "path=/")
        .replace(/path=\/api\/backend\/[^;]*/gi, "path=/");
      response.headers.append("set-cookie", rewritten);
    }
  });

  return response;
}
