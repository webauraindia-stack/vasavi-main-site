"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, ArrowLeft, ShieldCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  formatPhoneDisplay,
  toBackendPhone,
  validatePhoneField,
  isValidIndianMobile,
} from "@/lib/auth/phone";
import { PhoneInput } from "@/components/ui/phone-input";
import { ApiClientError } from "@/lib/api/client";
import { parseApiErrorMessage } from "@/lib/api/parse-error";
import type { ApiResponse } from "@/lib/api/types";
import type { LoginResult } from "@/lib/api/accounts";

type Step = "phone" | "otp" | "register";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account/bookings";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [name, setName] = useState("");
  const [registrationToken, setRegistrationToken] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    if (searchParams.get("session") === "expired") {
      setInfo("Your session expired. Please sign in again to continue.");
      setError("");
    }
  }, [searchParams]);

  const sendOtp = async () => {
    setError("");
    setInfo("");
    const validation = validatePhoneField(phone);
    if (validation) {
      setPhoneError(validation);
      return;
    }
    setPhoneError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: toBackendPhone(phone) }),
      });

      const data = (await response.json()) as ApiResponse<{
        ok?: boolean;
        cooldown_seconds?: number;
      }>;

      if (!response.ok || data.success === false) {
        setError(parseApiErrorMessage(data, "Could not send OTP."));
        if (response.status === 429) setCooldown(60);
        return;
      }

      setStep("otp");
      setOtp("");
      setInfo(
        "OTP sent. Check the Django server terminal for the code (DEBUG mode)."
      );
      setCooldown(data.data?.cooldown_seconds ?? 60);
    } catch {
      setError("Network error. Is the backend running on port 8000?");
    } finally {
      setLoading(false);
    }
  };

  const completeSignIn = async (payload: LoginResult) => {
    if (!payload.access || !payload.user) {
      setError("Login response missing token.");
      return;
    }

    const result = await signIn("whatsapp-otp", {
      phone: payload.user.phone,
      accessToken: payload.access,
      userJson: JSON.stringify(payload.user),
      donorProfileJson: payload.donor_profile
        ? JSON.stringify(payload.donor_profile)
        : "",
      redirect: false,
    });

    if (result?.error) {
      setError("Could not start session. Please try again.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({ phone: toBackendPhone(phone), otp }),
        credentials: "include",
      });

      const data = (await response.json()) as ApiResponse<LoginResult>;

      if (!response.ok || data.success === false) {
        setError(parseApiErrorMessage(data, "Invalid OTP."));
        return;
      }

      const payload = data.data;

      if (payload.access && payload.user) {
        await completeSignIn(payload);
        return;
      }

      if (payload.state === "registration" && payload.registration_token) {
        setRegistrationToken(payload.registration_token);
        setStep("register");
        setInfo("New number — enter your name to finish registration.");
        return;
      }

      setError("Unexpected login response.");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/backend/accounts/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Idempotency-Key": crypto.randomUUID(),
        },
        body: JSON.stringify({
          registration_token: registrationToken,
          name: name.trim(),
        }),
        credentials: "include",
      });

      const data = (await response.json()) as ApiResponse<LoginResult>;

      if (!response.ok || data.success === false) {
        setError(
          data.success === false ? data.error.message : "Registration failed."
        );
        return;
      }

      await completeSignIn(data.data);
    } catch (err) {
      if (err instanceof ApiClientError) {
        setError(err.message);
      } else {
        setError("Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-charcoal/10 shadow-warm-md">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
          </div>
        </div>

        <h1 className="font-display text-3xl text-charcoal text-center mb-2">Welcome Back</h1>
        <p className="text-sm text-muted text-center mb-8">
          {step === "register"
            ? "Complete your profile to book stays."
            : "Sign in with your mobile number. OTP is printed in the backend console for now."}
        </p>

        {step === "phone" && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void sendOtp();
            }}
            className="space-y-4"
          >
            <div>
              <Label htmlFor="phone">Mobile number</Label>
              <PhoneInput
                id="phone"
                className="mt-1"
                value={phone}
                onChange={(v) => {
                  setPhone(v);
                  if (phoneError) setPhoneError("");
                }}
                error={phoneError}
                required
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full gap-2"
              loading={loading}
              loadingText="Sending…"
              disabled={!isValidIndianMobile(phone)}
            >
              <MessageCircle className="h-4 w-4" />
              Send OTP
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="rounded-xl bg-surface border border-charcoal/10 px-4 py-3 text-sm">
              <p className="text-muted">Code sent to</p>
              <p className="font-semibold text-charcoal">{formatPhoneDisplay(phone)}</p>
            </div>

            <div>
              <Label htmlFor="otp">OTP (6 digits)</Label>
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                required
                className="mt-1 text-center text-lg tracking-[0.35em] font-semibold"
                placeholder="000000"
                maxLength={6}
              />
            </div>

            {info && <p className="text-sm text-emerald-700">{info}</p>}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              loadingText="Verifying…"
              disabled={otp.length !== 6}
            >
              Verify OTP
            </Button>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setError("");
                  setInfo("");
                  setOtp("");
                }}
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-charcoal"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Change number
              </button>
              <button
                type="button"
                onClick={() => void sendOtp()}
                disabled={loading || cooldown > 0}
                className="text-sm text-champagne-dark hover:underline disabled:opacity-50"
              >
                {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
              </button>
            </div>
          </form>
        )}

        {step === "register" && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="rounded-xl border border-charcoal/10 bg-surface/70 px-4 py-3 flex gap-3">
              <UserPlus className="h-5 w-5 text-champagne-dark shrink-0 mt-0.5" />
              <p className="text-sm text-muted">{info}</p>
            </div>

            <div>
              <Label htmlFor="reg-phone">Mobile</Label>
              <Input id="reg-phone" value={formatPhoneDisplay(phone)} disabled className="mt-1 opacity-70" />
            </div>

            <div>
              <Label htmlFor="reg-name">Full name</Label>
              <Input
                id="reg-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="mt-1"
                placeholder="Your name"
              />
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              loading={loading}
              loadingText="Creating account…"
              disabled={name.trim().length < 2}
            >
              Create account & sign in
            </Button>
          </form>
        )}

        <div className="mt-8 rounded-xl border border-charcoal/10 bg-surface/60 px-4 py-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-champagne-dark mt-0.5 shrink-0" />
            <p className="text-xs text-muted leading-relaxed">
              Staff and donors: use your registered 10-digit mobile. OTP appears in the Django
              terminal when <code className="text-[11px]">DEBUG=True</code>. Test admin:{" "}
              <strong>9876543210</strong>, donor: <strong>9876543211</strong>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="pt-32 text-center text-muted">Loading...</div>}>
      <LoginPageContent />
    </Suspense>
  );
}
