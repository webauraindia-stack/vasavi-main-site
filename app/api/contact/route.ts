import { NextResponse } from "next/server";
import { parseApiErrorMessage } from "@/lib/api/parse-error";

/** Proxy public contact form submissions to Django. */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const base = process.env.BACKEND_URL ?? "http://localhost:8000";
    const res = await fetch(`${base}/api/v1/support/contact/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const payload = await res.json().catch(() => ({}));
    if (!res.ok) {
      const message = parseApiErrorMessage(payload, "Could not send your message.");
      return NextResponse.json({ error: message }, { status: res.status });
    }
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Could not send your message.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
