import { NextResponse } from "next/server";
import { createOtp } from "@/lib/auth/otp-store";
import { isValidIndianMobile, normalizePhone } from "@/lib/auth/phone";
import { sendWhatsAppOtp } from "@/lib/auth/whatsapp";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { phone?: string };
    const phone = normalizePhone(body.phone ?? "");

    if (!isValidIndianMobile(phone)) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit Indian mobile number." },
        { status: 400 }
      );
    }

    const otpResult = createOtp(phone);

    if (!otpResult.ok) {
      return NextResponse.json(
        { error: `Please wait ${otpResult.cooldownSeconds}s before requesting another OTP.` },
        { status: 429 }
      );
    }

    const result = await sendWhatsAppOtp(phone, otpResult.code);

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 502 });
    }

    return NextResponse.json({
      ok: true,
      message: result.message,
      cooldownSeconds: otpResult.cooldownSeconds,
      ...(result.demoCode ? { demoCode: result.demoCode } : {}),
    });
  } catch {
    return NextResponse.json({ error: "Unable to send OTP." }, { status: 500 });
  }
}
