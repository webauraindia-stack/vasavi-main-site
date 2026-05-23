import { NextRequest, NextResponse } from "next/server";
import { proxyToBackend } from "@/lib/api/proxy-handler";

/** Proxy OTP send to Django — OTP is printed in the backend console when DEBUG=true. */
export async function POST(request: NextRequest) {
  return proxyToBackend(request, ["accounts", "otp", "send"]);
}
