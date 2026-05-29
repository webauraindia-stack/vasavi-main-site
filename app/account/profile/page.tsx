"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Crown, Mail, Phone, MapPin, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { formatPhoneDisplay } from "@/lib/auth/phone";
import { formatAadhaarDisplay } from "@/lib/aadhaar";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import { updateProfile } from "@/lib/api/accounts";

export default function ProfilePage() {
  const { t } = useAppLanguage();
  const { data: session, update } = useSession();
  const { withAccessToken } = useAuthenticatedSession();
  const [name, setName] = useState(session?.user?.name ?? "");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  const user = session?.user as {
    isDonor?: boolean;
    tier?: string;
    donorId?: string;
    phone?: string;
    city?: string;
    aadhaar?: string;
    categoryLabel?: string;
    isKnownMember?: boolean;
  };

  const displayPhone = user?.phone ? formatPhoneDisplay(user.phone) : "";
  const displayAadhaar = user?.aadhaar ? formatAadhaarDisplay(user.aadhaar) : "";

  const handleSave = async () => {
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setSaveError(t("account.nameTooShort", { defaultValue: "Name must be at least 2 characters." }));
      return;
    }
    setSaveError(null);
    setSaved(false);
    setSaving(true);
    try {
      await withAccessToken(async (token) => {
        const updated = await updateProfile(token, { name: trimmed });
        await update({ name: updated.name });
        setName(updated.name);
        setSaved(true);
      });
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : "Could not save profile.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6">{t("account.profileTitle")}</h2>

      <div className="card-surface rounded-xl p-6 border border-charcoal/10 space-y-6 max-w-lg">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-full bg-champagne/30 flex items-center justify-center text-2xl font-display text-champagne">
            {name?.[0] ?? session?.user?.name?.[0] ?? "U"}
          </div>
          <div>
            <p className="font-display text-xl text-charcoal">{name || session?.user?.name}</p>
            <p className="text-sm text-muted flex items-center gap-1">
              <Mail className="h-3.5 w-3.5" />
              {session?.user?.email}
            </p>
            {displayPhone && (
              <p className="text-sm text-muted flex items-center gap-1 mt-1">
                <Phone className="h-3.5 w-3.5" />
                {displayPhone}
              </p>
            )}
            {user?.isDonor && user.tier && (
              <Badge variant="donor" className="mt-2 capitalize">
                <Crown className="h-3 w-3 mr-1" />
                {t("account.donorTier", { tier: user.tier })}
              </Badge>
            )}
            {user?.categoryLabel && !user.isDonor && (
              <Badge variant="outline" className="mt-2">
                {user.categoryLabel}
              </Badge>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="name">{t("account.fullName")}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="email">{t("account.email")}</Label>
            <Input
              id="email"
              type="email"
              defaultValue={session?.user?.email ?? ""}
              disabled
              className="mt-1 opacity-60"
            />
          </div>
          <div>
            <Label htmlFor="phone">{t("account.mobile")}</Label>
            <Input
              id="phone"
              value={displayPhone}
              disabled
              className="mt-1 opacity-60"
            />
          </div>
          <div>
            <Label htmlFor="city">{t("account.city")}</Label>
            <Input
              id="city"
              defaultValue={user?.city ?? ""}
              disabled
              className="mt-1 opacity-60"
              title={t("account.cityReadOnly", {
                defaultValue: "City is shown from your session; contact support to update.",
              })}
            />
          </div>
          {displayAadhaar && (
            <div>
              <Label htmlFor="aadhaar">{t("account.aadhaar")}</Label>
              <Input
                id="aadhaar"
                value={displayAadhaar}
                disabled
                className="mt-1 font-mono tracking-[0.2em] tabular-nums opacity-60"
              />
            </div>
          )}
          {user?.isDonor && user.donorId && (
            <div>
              <Label>{t("account.donorId")}</Label>
              <Input value={user.donorId} disabled className="mt-1 opacity-60" />
            </div>
          )}
          {user?.city && (
            <p className="text-xs text-muted flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {user.city}
            </p>
          )}
        </div>

        {saveError && (
          <p className="text-sm text-red-600 font-medium" role="alert">
            {saveError}
          </p>
        )}
        {saved && (
          <p className="text-sm text-champagne font-medium">
            {t("account.profileSaved", { defaultValue: "Profile saved." })}
          </p>
        )}

        <Button type="button" onClick={() => void handleSave()} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              {t("account.saving", { defaultValue: "Saving…" })}
            </>
          ) : (
            t("account.saveChanges")
          )}
        </Button>
      </div>
    </div>
  );
}
