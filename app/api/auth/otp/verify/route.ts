import { NextResponse } from "next/server";
import { getCustomerProfilePreview } from "@/lib/auth/customer-profile";
import { verifyOtp } from "@/lib/auth/otp-store";
import { normalizePhone } from "@/lib/auth/phone";
import { issueVerificationToken } from "@/lib/auth/verification-token";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string; otp?: string };
    const phone = normalizePhone(body.phone ?? "");
    const otp = String(body.otp ?? "").trim();

    if (!phone || otp.length !== 6) {
      return NextResponse.json({ error: "Enter a valid OTP." }, { status: 400 });
    }

    const verification = verifyOtp(phone, otp);
    if (!verification.ok) {
      return NextResponse.json({ error: verification.error }, { status: 401 });
    }

    const verificationToken = issueVerificationToken(phone);
    const profile = getCustomerProfilePreview(phone);

    return NextResponse.json({
      ok: true,
      verificationToken,
      profile,
    });
  } catch {
    return NextResponse.json({ error: "Unable to verify OTP." }, { status: 500 });
  }
}
