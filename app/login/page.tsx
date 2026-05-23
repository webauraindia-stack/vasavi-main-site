"use client";

import { Suspense, useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { MessageCircle, ArrowLeft, ShieldCheck, UserCheck, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { formatPhoneDisplay } from "@/lib/auth/phone";
import type { CustomerProfileForm } from "@/lib/auth/customer-profile";
import { useAppLanguage } from "@/hooks/use-app-language";

type Step = "phone" | "otp" | "profile";

const EMPTY_PROFILE: CustomerProfileForm = {
  name: "",
  email: "",
  phone: "",
  city: "",
  memberId: "",
  categoryLabel: "",
  isKnownMember: false,
  isDonor: false,
};

function LoginPageContent() {
  const { t } = useAppLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/account/bookings";

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [profile, setProfile] = useState<CustomerProfileForm>(EMPTY_PROFILE);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setInterval(() => {
      setCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [cooldown]);

  const sendOtp = async () => {
    setError("");
    setInfo("");
    setDemoCode(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = (await response.json()) as {
        error?: string;
        message?: string;
        demoCode?: string;
        cooldownSeconds?: number;
      };

      if (!response.ok) {
        setError(data.error ?? t("login.otpSendFail"));
        if (response.status === 429 && data.error) {
          const match = data.error.match(/(\d+)s/);
          if (match) setCooldown(Number(match[1]));
        }
        return;
      }

      setStep("otp");
      setOtp("");
      setInfo(data.message ?? t("login.otpSent"));
      setDemoCode(data.demoCode ?? null);
      setCooldown(data.cooldownSeconds ?? 60);
    } catch {
      setError(t("common.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp }),
      });

      const data = (await response.json()) as {
        error?: string;
        verificationToken?: string;
        profile?: CustomerProfileForm;
      };

      if (!response.ok) {
        setError(data.error ?? t("login.otpInvalid"));
        return;
      }

      setVerificationToken(data.verificationToken ?? "");
      setProfile(data.profile ?? EMPTY_PROFILE);
      setStep("profile");
      setInfo(
        data.profile?.isKnownMember ? t("login.profileKnownHint") : t("login.profileNewHint")
      );
    } catch {
      setError(t("common.networkError"));
    } finally {
      setLoading(false);
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("whatsapp-otp", {
      phone,
      verificationToken,
      name: profile.name,
      email: profile.email,
      city: profile.city,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t("login.signInFail"));
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  };

  const updateProfile = (field: keyof CustomerProfileForm, value: string) => {
    setProfile((current) => ({ ...current, [field]: value }));
  };

  return (
    <div className="pt-24 pb-16 min-h-[80vh] flex items-center justify-center px-4 devotional-gradient section-shell">
      <div className="relative w-full max-w-md bg-white rounded-[var(--radius-devotional)] p-8 border border-beige/70 shadow-warm-lg">
        <div className="flex justify-center mb-4">
          <div className="h-12 w-12 rounded-full bg-[#25D366]/10 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-[#25D366]" />
          </div>
        </div>

        <h1 className="font-display text-3xl text-charcoal text-center mb-2">{t("login.welcome")}</h1>
        <p className="text-sm text-muted text-center mb-8">
          {step === "profile"
            ? profile.isKnownMember
              ? t("login.profileKnown")
              : t("login.profileNew")
            : t("login.phoneIntro")}
        </p>

        {step === "phone" && (
          <form onSubmit={handlePhoneSubmit} className="space-y-4">
            <div>
              <Label htmlFor="phone">{t("login.mobile")}</Label>
              <div className="mt-1 flex rounded-lg border border-charcoal/15 overflow-hidden focus-within:ring-2 focus-within:ring-champagne/30">
                <span className="inline-flex items-center px-3 text-sm font-semibold text-muted bg-surface border-r border-charcoal/10">
                  +91
                </span>
                <Input
                  id="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  required
                  className="border-0 focus-visible:ring-0 rounded-none"
                  placeholder="98765 43210"
                />
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full gap-2" disabled={loading || phone.length < 10}>
              <MessageCircle className="h-4 w-4" />
              {loading ? t("login.sending") : t("login.sendOtp")}
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div className="rounded-xl bg-surface border border-charcoal/10 px-4 py-3 text-sm">
              <p className="text-muted">{t("login.codeSentTo")}</p>
              <p className="font-semibold text-charcoal">{formatPhoneDisplay(phone)}</p>
            </div>

            <div>
              <Label htmlFor="otp">{t("login.whatsappOtp")}</Label>
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
            {demoCode && (
              <p className="text-xs text-center rounded-lg bg-amber-50 border border-amber-200 text-amber-900 px-3 py-2">
                {t("login.demoOtp")}: <span className="font-bold tracking-widest">{demoCode}</span>
              </p>
            )}
            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button type="submit" className="w-full" disabled={loading || otp.length !== 6}>
              {loading ? t("login.verifying") : t("login.verifyOtp")}
            </Button>

            <div className="flex items-center justify-between gap-2">
              <button
                type="button"
                onClick={() => {
                  setStep("phone");
                  setError("");
                  setInfo("");
                  setDemoCode(null);
                  setOtp("");
                }}
                className="inline-flex items-center gap-1 text-sm text-muted hover:text-charcoal"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                {t("login.changeNumber")}
              </button>
              <button
                type="button"
                onClick={sendOtp}
                disabled={loading || cooldown > 0}
                className="text-sm text-champagne-dark hover:underline disabled:opacity-50"
              >
                {cooldown > 0 ? t("login.resendIn", { seconds: cooldown }) : t("login.resendOtp")}
              </button>
            </div>
          </form>
        )}

        {step === "profile" && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="rounded-xl border border-charcoal/10 bg-surface/70 px-4 py-3">
              <div className="flex items-start gap-3">
                {profile.isKnownMember ? (
                  <UserCheck className="h-5 w-5 text-emerald-600 mt-0.5 shrink-0" />
                ) : (
                  <UserPlus className="h-5 w-5 text-champagne-dark mt-0.5 shrink-0" />
                )}
                <div>
                  <p className="text-sm font-semibold text-charcoal">
                    {profile.isKnownMember ? t("login.profileFound") : t("login.newCustomer")}
                  </p>
                  <p className="text-xs text-muted mt-1">{info}</p>
                  {profile.isKnownMember && profile.categoryLabel && (
                    <Badge variant="donor" className="mt-2">
                      {profile.categoryLabel}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="profile-phone">{t("login.mobile")}</Label>
              <Input
                id="profile-phone"
                value={profile.phone || formatPhoneDisplay(phone)}
                disabled
                className="mt-1 opacity-70"
              />
            </div>

            <div>
              <Label htmlFor="profile-name">{t("login.fullName")}</Label>
              <Input
                id="profile-name"
                value={profile.name}
                onChange={(e) => updateProfile("name", e.target.value)}
                required
                readOnly={profile.isKnownMember}
                className={`mt-1 ${profile.isKnownMember ? "opacity-70" : ""}`}
                placeholder={t("login.namePlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="profile-email">{t("login.email")}</Label>
              <Input
                id="profile-email"
                type="email"
                value={profile.email}
                onChange={(e) => updateProfile("email", e.target.value)}
                required
                readOnly={profile.isKnownMember}
                className={`mt-1 ${profile.isKnownMember ? "opacity-70" : ""}`}
                placeholder={t("login.emailPlaceholder")}
              />
            </div>

            <div>
              <Label htmlFor="profile-city">{t("login.city")}</Label>
              <Input
                id="profile-city"
                value={profile.city}
                onChange={(e) => updateProfile("city", e.target.value)}
                readOnly={profile.isKnownMember}
                className={`mt-1 ${profile.isKnownMember ? "opacity-70" : ""}`}
                placeholder={t("login.cityPlaceholder")}
              />
            </div>

            {profile.isKnownMember && profile.memberId && (
              <div>
                <Label htmlFor="profile-member-id">{t("login.memberId")}</Label>
                <Input
                  id="profile-member-id"
                  value={profile.memberId}
                  disabled
                  className="mt-1 opacity-70"
                />
              </div>
            )}

            {error && <p className="text-sm text-red-600">{error}</p>}

            <Button
              type="submit"
              className="w-full"
              disabled={
                loading ||
                !profile.name.trim() ||
                !profile.email.trim() ||
                (!profile.isKnownMember && !profile.email.includes("@"))
              }
            >
              {loading
                ? t("login.signingIn")
                : profile.isKnownMember
                  ? t("login.continueBtn")
                  : t("login.saveSignIn")}
            </Button>

            <button
              type="button"
              onClick={() => {
                setStep("otp");
                setError("");
                setInfo("");
              }}
              className="inline-flex items-center gap-1 text-sm text-muted hover:text-charcoal"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {t("login.backToOtp")}
            </button>
          </form>
        )}

        <div className="mt-8 rounded-xl border border-charcoal/10 bg-surface/60 px-4 py-3">
          <div className="flex items-start gap-2">
            <ShieldCheck className="h-4 w-4 text-champagne-dark mt-0.5 shrink-0" />
            <p className="text-xs text-muted leading-relaxed">{t("login.demoHint")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LoginLoadingFallback() {
  const { t } = useAppLanguage();
  return <div className="pt-32 text-center text-muted">{t("common.loading")}</div>;
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginLoadingFallback />}>
      <LoginPageContent />
    </Suspense>
  );
}
