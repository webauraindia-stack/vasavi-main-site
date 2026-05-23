import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy-handler";

/** Proxy OTP verify to Django (sets vasavi_refresh cookie via proxy path rewrite). */
export async function POST(request: NextRequest) {
  const headers = new Headers(request.headers);
  if (!headers.has("x-idempotency-key")) {
    headers.set("x-idempotency-key", crypto.randomUUID());
  }
  const body = await request.text();
  const subpath = ["accounts", "otp", "verify"];
  const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:8000";
  const target = `${BACKEND_URL}/api/v1/${subpath.join("/")}/`;

  const backendRes = await fetch(target, {
    method: "POST",
    headers,
    body,
    cache: "no-store",
  });

  const text = await backendRes.text();
  const response = new NextResponse(text, {
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
