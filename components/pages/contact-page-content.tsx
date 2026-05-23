"use client";

import Link from "next/link";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VCI_CONTACT, QUICK_LINKS } from "@/lib/data/vasavi-community";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useState } from "react";

export function ContactPageContent() {
  const { t } = useAppLanguage();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="pt-20 pb-16 bg-white">
      <div className="page-container max-w-3xl">
        <h1 className="font-display text-3xl md:text-4xl text-charcoal mb-6">{t("contact.title")}</h1>

        <div className="grid sm:grid-cols-2 gap-6 mb-12">
          <ContactCard
            icon={Phone}
            title={t("contact.vci")}
            lines={[
              <a key="p" href={VCI_CONTACT.phoneHref} className="text-champagne hover:underline text-lg">
                {VCI_CONTACT.phone}
              </a>,
            ]}
          />
          <ContactCard icon={MapPin} title={t("contact.headquarters")} lines={[VCI_CONTACT.address]} />
          <ContactCard
            icon={ExternalLink}
            title={t("contact.officialWebsite")}
            lines={[
              <a
                key="w"
                href={VCI_CONTACT.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-champagne hover:underline"
              >
                vasaviclubs.org
              </a>,
            ]}
          />
          <ContactCard
            icon={Mail}
            title={t("contact.bookings")}
            lines={[
              <Link key="b" href="/search" className="text-champagne hover:underline">
                {t("contact.searchBook")}
              </Link>,
              <Link key="d" href="/donors" className="text-champagne hover:underline block mt-1">
                {t("contact.donorKcgf")}
              </Link>,
            ]}
          />
        </div>

        <div className="card-surface p-6 sm:p-8">
          <h2 className="font-display text-xl text-charcoal mb-6">{t("contact.sendMessage")}</h2>
          {submitted ? (
            <p className="text-muted font-semibold">{t("contact.thankYou")}</p>
          ) : (
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
              }}
            >
              <div>
                <Label htmlFor="name">{t("contact.name")}</Label>
                <Input id="name" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="email">{t("contact.email")}</Label>
                <Input id="email" type="email" required className="mt-1" />
              </div>
              <div>
                <Label htmlFor="message">{t("contact.message")}</Label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  className="mt-1 w-full rounded-lg border border-charcoal/15 px-3 py-2 text-base"
                />
              </div>
              <Button type="submit">{t("contact.submit")}</Button>
            </form>
          )}
        </div>

        <section className="mt-12">
          <h3 className="text-sm font-semibold text-charcoal mb-2">{t("about.quickLinks")}</h3>
          <ul className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted">
            {QUICK_LINKS.map((l) => (
              <li key={l.label}>
                <a href={l.href} target="_blank" rel="noopener noreferrer" className="hover:text-champagne">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </div>
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
    <div className="card-surface p-5">
      <Icon className="h-5 w-5 text-champagne mb-2" />
      <h3 className="font-display text-lg text-charcoal mb-2">{title}</h3>
      <div className="space-y-1 text-sm text-muted">{lines}</div>
    </div>
  );
}
