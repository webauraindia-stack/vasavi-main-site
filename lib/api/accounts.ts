import { apiFetch } from "@/lib/api/client";
import type { BackendDonorProfile } from "@/lib/api/mappers";

export type BackendUser = {
  id: string;
  phone: string;
  name: string;
  role: string;
};

export type OtpSendResult = {
  ok: boolean;
  expires_in: number;
  cooldown_seconds: number;
};

export type LoginResult = {
  access: string | null;
  state: string;
  phone?: string;
  registration_token?: string;
  user?: BackendUser;
  donor_profile?: BackendDonorProfile | null;
};

export async function sendOtp(phone: string): Promise<OtpSendResult> {
  return apiFetch<OtpSendResult>("accounts/otp/send/", {
    method: "POST",
    body: JSON.stringify({ phone }),
  });
}

export async function verifyOtp(phone: string, otp: string): Promise<LoginResult> {
  return apiFetch<LoginResult>("accounts/otp/verify/", {
    method: "POST",
    body: JSON.stringify({ phone, otp }),
    idempotencyKey: crypto.randomUUID(),
  });
}

export async function registerUser(
  registrationToken: string,
  name: string
): Promise<LoginResult> {
  return apiFetch<LoginResult>("accounts/register/", {
    method: "POST",
    body: JSON.stringify({ registration_token: registrationToken, name }),
    idempotencyKey: crypto.randomUUID(),
  });
}

export async function fetchMe(accessToken: string): Promise<BackendUser> {
  return apiFetch<BackendUser>("accounts/me/", {
    method: "GET",
    accessToken,
  });
}

export async function logoutApi(): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>("accounts/logout/", {
    method: "POST",
    body: JSON.stringify({}),
    accessToken: " ", // cookie-only; backend may ignore empty bearer
  });
}
