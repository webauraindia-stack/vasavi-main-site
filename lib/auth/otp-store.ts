type OtpRecord = {
  code: string;
  expiresAt: number;
  attempts: number;
};

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 60 * 1000;

const otpStore = new Map<string, OtpRecord>();
const lastSentAt = new Map<string, number>();

function generateCode(): string {
  return String(Math.floor(100000 + Math.random() * 900000));
}

export function createOtp(phone: string):
  | { ok: true; code: string; cooldownSeconds: number }
  | { ok: false; cooldownSeconds: number } {
  const now = Date.now();
  const last = lastSentAt.get(phone) ?? 0;
  const elapsed = now - last;

  if (elapsed < RESEND_COOLDOWN_MS) {
    return {
      ok: false,
      cooldownSeconds: Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000),
    };
  }

  const code = generateCode();
  otpStore.set(phone, {
    code,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
  });
  lastSentAt.set(phone, now);

  return { ok: true, code, cooldownSeconds: RESEND_COOLDOWN_MS / 1000 };
}

export function verifyOtp(phone: string, code: string): { ok: boolean; error?: string } {
  const record = otpStore.get(phone);

  if (!record) {
    return { ok: false, error: "OTP expired or not found. Request a new code." };
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(phone);
    return { ok: false, error: "OTP has expired. Request a new code." };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(phone);
    return { ok: false, error: "Too many attempts. Request a new code." };
  }

  record.attempts += 1;

  if (record.code !== code.trim()) {
    return { ok: false, error: "Invalid OTP. Please try again." };
  }

  otpStore.delete(phone);
  return { ok: true };
}
