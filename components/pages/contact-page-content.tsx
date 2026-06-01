"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VCI_CONTACT, QUICK_LINKS } from "@/lib/data/vasavi-community";
import { useHotelsCatalog } from "@/lib/context/hotels-catalog";
import { useAppLanguage } from "@/hooks/use-app-language";
import type { Hotel } from "@/types";
import { Suspense, useEffect, useMemo, useState } from "react";

function resolveHotelParam(hotels: Hotel[], param: string | null): string | null {
  if (!param) return null;
  const byId = hotels.find((h) => h.id === param);
  if (byId) return byId.id;
  const bySlug = hotels.find((h) => h.slug === param);
  return bySlug?.id ?? null;
}

export function ContactPageContent() {
  return (
    <Suspense fallback={<ContactPageSkeleton />}>
      <ContactPageContentInner />
    </Suspense>
  );
}

function ContactPageContentInner() {
  const { t } = useAppLanguage();
  const { hotels } = useHotelsCatalog();
  const hotelsSorted = useMemo(
    () => [...hotels].sort((a, b) => a.city.localeCompare(b.city) || a.name.localeCompare(b.name)),
    [hotels]
  );
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [hotelId, setHotelId] = useState("");
  const [hotelError, setHotelError] = useState(false);

  useEffect(() => {
    const fromUrl = resolveHotelParam(hotels, searchParams.get("hotel"));
    if (fromUrl) setHotelId(fromUrl);
  }, [searchParams, hotels]);

  const selectedHotel = useMemo(
    () => (hotelId && hotelId !== "general" ? hotels.find((h) => h.id === hotelId) : null),
    [hotelId, hotels]
  );

  return (
    <div className="pt-20 pb-20 bg-white">
      {/* Header */}
      <div className="bg-surface border-b border-beige py-14 md:py-20">
        <div className="page-container">
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-charcoal mb-4">
            {t("contact.title")}
          </h1>
          <p className="text-base md:text-lg text-muted max-w-2xl">
            {t("contact.bookings")}
          </p>
        </div>
      </div>

      <div className="page-container mt-12">
        <div className="grid gap-12 lg:grid-cols-[1fr_480px] lg:gap-16 items-start">
          {/* Contact cards */}
          <div>
            <div className="grid sm:grid-cols-2 gap-5 mb-12">
              <ContactCard
                icon={Phone}
                title={t("contact.vci")}
                lines={[
                  <a
                    key="p"
                    href={VCI_CONTACT.phoneHref}
                    className="text-champagne hover:underline text-lg font-bold"
                  >
                    {VCI_CONTACT.phone}
                  </a>,
                ]}
              />
              <ContactCard
                icon={MapPin}
                title={t("contact.headquarters")}
                lines={[VCI_CONTACT.address]}
              />
              <ContactCard
                icon={ExternalLink}
                title={t("contact.officialWebsite")}
                lines={[
                  <a
                    key="w"
                    href={VCI_CONTACT.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-champagne hover:underline font-semibold"
                  >
                    vasaviclubs.org
                  </a>,
                ]}
              />
              <ContactCard
                icon={Mail}
                title={t("contact.bookings")}
                lines={[
                  <Link key="b" href="/search" className="text-champagne hover:underline font-semibold">
                    {t("contact.searchBook")}
                  </Link>,
                  <Link
                    key="d"
                    href="/donors"
                    className="text-champagne hover:underline block mt-2 font-semibold"
                  >
                    {t("contact.donorKcgf")}
                  </Link>,
                ]}
              />
            </div>

            {/* Quick links */}
            <section>
              <h3 className="text-base font-bold text-charcoal mb-3">{t("about.quickLinks")}</h3>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                {QUICK_LINKS.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-champagne transition-colors"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          {/* Message form */}
          <div className="card-surface p-7 md:p-10 lg:sticky lg:top-24">
            <h2 className="font-display text-2xl md:text-3xl text-charcoal mb-6">
              {t("contact.sendMessage")}
            </h2>
            {submitted ? (
              <p className="text-base text-muted font-semibold">{t("contact.thankYou")}</p>
            ) : (
              <form
                className="space-y-5"
                onSubmit={async (e) => {
                  e.preventDefault();
                  if (!hotelId) {
                    setHotelError(true);
                    return;
                  }
                  setHotelError(false);
                  setSubmitError(null);
                  const form = e.currentTarget;
                  const data = new FormData(form);
                  const name = String(data.get("name") ?? "").trim();
                  const email = String(data.get("email") ?? "").trim();
                  const message = String(data.get("message") ?? "").trim();
                  setSubmitting(true);
                  try {
                    const res = await fetch("/api/contact", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        name,
                        email,
                        message,
                        hotel_id: hotelId === "general" ? null : hotelId,
                      }),
                    });
                    if (!res.ok) {
                      const body = (await res.json().catch(() => ({}))) as { error?: string };
                      throw new Error(body.error ?? "Could not send your message.");
                    }
                    setSubmitted(true);
                  } catch (err) {
                    setSubmitError(err instanceof Error ? err.message : "Could not send your message.");
                  } finally {
                    setSubmitting(false);
                  }
                }}
              >
                <div>
                  <Label htmlFor="name" className="text-base">{t("contact.name")}</Label>
                  <Input id="name" name="name" required className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="email" className="text-base">{t("contact.email")}</Label>
                  <Input id="email" name="email" type="email" required className="mt-1.5 h-11" />
                </div>
                <div>
                  <Label htmlFor="hotel" className="text-base">{t("contact.hotel")}</Label>
                  <Select
                    value={hotelId || undefined}
                    onValueChange={(v) => {
                      setHotelId(v);
                      setHotelError(false);
                    }}
                  >
                    <SelectTrigger
                      id="hotel"
                      aria-invalid={hotelError}
                      className="mt-1.5 h-11 text-sm font-semibold"
                    >
                      <SelectValue placeholder={t("contact.hotelPlaceholder")} />
                    </SelectTrigger>
                    <SelectContent className="max-h-[min(22rem,70dvh)]">
                      <SelectItem value="general">
                        <span className="text-sm font-semibold">{t("contact.hotelGeneral")}</span>
                      </SelectItem>
                      {hotelsSorted.map((h) => (
                        <SelectItem key={h.id} value={h.id}>
                          <span className="flex flex-col leading-tight py-0.5">
                            <span className="text-sm font-semibold text-charcoal">{h.name}</span>
                            <span className="text-xs font-medium text-muted">{h.city}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <input type="hidden" name="hotel" value={hotelId} />
                  {selectedHotel && (
                    <p className="mt-1.5 text-xs text-muted">
                      <Link
                        href={`/hotels/${selectedHotel.slug}`}
                        className="text-champagne hover:underline font-semibold"
                      >
                        {selectedHotel.name} — {selectedHotel.city}
                      </Link>
                    </p>
                  )}
                  {hotelError && (
                    <p className="mt-1.5 text-sm text-red-600 font-medium" role="alert">
                      {t("contact.hotelRequired")}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="message" className="text-base">{t("contact.message")}</Label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    className="mt-1.5 w-full rounded-lg border border-charcoal/15 px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-champagne/40"
                  />
                </div>
                {submitError && (
                  <p className="text-sm text-red-600 font-medium" role="alert">
                    {submitError}
                  </p>
                )}
                <Button
                  type="submit"
                  className="w-full h-11 text-base font-bold"
                  loading={submitting}
                  loadingText={t("contact.submitting", { defaultValue: "Sending…" })}
                >
                  {t("contact.submit")}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ContactPageSkeleton() {
  return (
    <div className="pt-20 pb-20 bg-white min-h-[50vh]">
      <div className="page-container mt-12 animate-pulse h-96 bg-beige/30 rounded-xl" />
    </div>
  );
}

function ContactCard({
  icon: Icon,
  title,
  lines,
}: {
  icon: typeof Phone;
  title: string;
  lines: React.ReactNode[];
}) {
  return (
    <div className="card-surface p-6 md:p-7">
      <Icon className="h-6 w-6 text-champagne mb-3" />
      <h3 className="font-display text-lg md:text-xl text-charcoal mb-2">{title}</h3>
      <div className="space-y-1 text-base text-muted">{lines}</div>
    </div>
  );
}
