import { formatPhoneDisplay } from "@/lib/auth/phone";

type SendResult = {
  ok: boolean;
  message: string;
  demoCode?: string;
};

export async function sendWhatsAppOtp(phone: string, code: string): Promise<SendResult> {
  const displayPhone = formatPhoneDisplay(phone);
  const message = `Your Vasavi Hotels login code is ${code}. Valid for 5 minutes. Do not share this code.`;

  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (accessToken && phoneNumberId) {
    try {
      const response = await fetch(
        `https://graph.facebook.com/v21.0/${phoneNumberId}/messages`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messaging_product: "whatsapp",
            to: phone.replace(/\D/g, ""),
            type: "template",
            template: {
              name: process.env.WHATSAPP_OTP_TEMPLATE ?? "vasavi_login_otp",
              language: { code: "en" },
              components: [
                {
                  type: "body",
                  parameters: [{ type: "text", text: code }],
                },
              ],
            },
          }),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("[WhatsApp OTP] API error:", errorText);
        return {
          ok: false,
          message: "Could not send OTP via WhatsApp. Please try again.",
        };
      }

      return {
        ok: true,
        message: `OTP sent to ${displayPhone} on WhatsApp.`,
      };
    } catch (error) {
      console.error("[WhatsApp OTP] send failed:", error);
      return {
        ok: false,
        message: "Could not send OTP via WhatsApp. Please try again.",
      };
    }
  }

  console.info(`[WhatsApp OTP demo] ${displayPhone}: ${code} — ${message}`);

  return {
    ok: true,
    message: `OTP sent to ${displayPhone} on WhatsApp.`,
    demoCode: process.env.NODE_ENV !== "production" ? code : undefined,
  };
}
