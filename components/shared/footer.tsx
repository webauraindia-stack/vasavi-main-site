"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Facebook, Twitter, Linkedin, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { HOTELS } from "@/lib/data/hotels";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useLocalizedHotel } from "@/hooks/use-localized-content";

const social = [
  { Icon: Instagram, label: "Instagram" },
  { Icon: Facebook, label: "Facebook" },
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
];

export function Footer() {
  const { t } = useAppLanguage();
  const [email, setEmail] = useState("");
  const [openSection, setOpenSection] = useState<string | null>(null);

  const companyLinks = [
    { href: "/donors", label: t("nav.donorProgram") },
    { href: "/schemes", label: t("nav.schemes") },
    { href: "/founder", label: t("nav.founder") },
    { href: "/about", label: t("nav.about") },
    { href: "/health-centre", label: t("nav.healthCentre") },
    { href: "/contact", label: t("nav.contact") },
    { href: "https://vasaviclubs.org/", label: t("footer.vciLink") },
  ];

  const toggle = (id: string) =>
    setOpenSection((prev) => (prev === id ? null : id));

  return (
    <footer className="footer-devotional relative text-beige/90 mt-auto border-t border-champagne-dark/20">
      <div className="absolute inset-x-0 top-0 gold-divider opacity-50" />
      <div className="page-container py-12 lg:py-16 relative">
        <div className="md:hidden space-y-0 divide-y divide-white/10">
          <AccordionSection
            id="hotels"
            title={t("footer.ourHotels")}
            open={openSection === "hotels"}
            onToggle={() => toggle("hotels")}
          >
            <ul className="space-y-2 pb-4">
              {HOTELS.map((h) => (
                <FooterHotelLink key={h.id} slug={h.slug} name={h.name} description={h.description} variant="mobile" />
              ))}
            </ul>
          </AccordionSection>

          <AccordionSection
            id="company"
            title={t("footer.company")}
            open={openSection === "company"}
            onToggle={() => toggle("company")}
          >
            <ul className="space-y-2 pb-4">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-base font-semibold text-beige/85 hover:text-champagne-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </AccordionSection>
        </div>

        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          <div>
            <Link
              href="/"
              className="select-none flex items-center gap-3 hover:opacity-90 transition-opacity mb-4"
            >
              <div className="relative h-10 w-10 shrink-0 rounded-full border border-champagne-dark/40 p-1 bg-white/5">
                <Image
                  src="/images/vasavi-club-logo.svg"
                  alt="Vasavi Clubs Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              <span className="font-display text-lg tracking-wide uppercase text-white">
                {t("brand.vasavi")}{" "}
                <span className="text-champagne-dark">{t("brand.spiritualStays")}</span>
              </span>
            </Link>
            <p className="text-sm text-beige/75 mb-6 font-semibold leading-relaxed max-w-xs">
              {t("footer.tagline")}
            </p>
            <div className="flex gap-4">
              {social.map(({ Icon, label }) => (
                <a
                  key={label}
                  href="#"
                  aria-label={label}
                  className="text-beige/60 hover:text-champagne-dark transition-colors"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-display text-lg text-white mb-4">{t("footer.ourHotels")}</h3>
            <ul className="space-y-2 max-h-48 overflow-y-auto scrollbar-hide">
              {HOTELS.map((h) => (
                <FooterHotelLink key={h.id} slug={h.slug} name={h.name} description={h.description} variant="desktop" />
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg text-white mb-4">{t("footer.company")}</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-semibold text-beige/80 hover:text-champagne-dark transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-display text-lg text-white mb-4">{t("footer.newsletterTitle")}</h3>
            <p className="text-sm text-beige/75 font-semibold mb-4 leading-relaxed">
              {t("footer.newsletterDesc")}
            </p>
            <NewsletterForm email={email} setEmail={setEmail} subscribeLabel={t("common.subscribe")} placeholder={t("footer.emailPlaceholder")} />
          </div>
        </div>

        <div className="md:hidden mt-8 space-y-6 text-center">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="relative h-9 w-9 shrink-0 rounded-full border border-champagne-dark/40 p-1">
                <Image src="/images/vasavi-club-logo.svg" alt="" fill className="object-contain p-0.5" />
              </div>
              <span className="font-display text-lg text-white uppercase">Vasavi Hotels</span>
            </Link>
            <p className="text-sm text-beige/75 font-semibold leading-relaxed px-4">
              {t("footer.mobileTagline")}
            </p>
          </div>
          <div className="flex justify-center gap-5">
            {social.map(({ Icon, label }) => (
              <a key={label} href="#" aria-label={label} className="text-beige/60 hover:text-champagne-dark">
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
          <div className="text-left px-1">
            <h3 className="font-display text-lg text-white mb-3 text-center">{t("footer.newsletterTitle")}</h3>
            <NewsletterForm email={email} setEmail={setEmail} stacked subscribeLabel={t("common.subscribe")} placeholder={t("footer.emailPlaceholder")} />
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-4 text-sm font-semibold text-beige/65">
          <p>© {new Date().getFullYear()} Vasavi Hotels. {t("common.allRightsReserved")}</p>
          <div className="flex gap-6 justify-center sm:justify-end">
            <Link href="/privacy" className="hover:text-champagne-dark">{t("common.privacyPolicy")}</Link>
            <Link href="/terms" className="hover:text-champagne-dark">{t("common.termsOfService")}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function AccordionSection({
  id,
  title,
  open,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between py-4 font-display text-lg text-white"
        aria-expanded={open}
        aria-controls={`footer-${id}`}
      >
        {title}
        <ChevronDown
          className={cn("h-5 w-5 text-beige/60 transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={`footer-${id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NewsletterForm({
  email,
  setEmail,
  stacked = false,
  subscribeLabel,
  placeholder,
}: {
  email: string;
  setEmail: (v: string) => void;
  stacked?: boolean;
  subscribeLabel: string;
  placeholder: string;
}) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setEmail("");
      }}
      className={cn(stacked ? "flex flex-col gap-2" : "flex gap-2")}
    >
      <Input
        type="email"
        placeholder={placeholder}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        aria-label="Newsletter email"
        required
        className={cn(
          stacked ? "w-full" : "flex-1",
          "bg-white/10 border-white/15 text-white placeholder:text-beige/50"
        )}
      />
      <Button
        type="submit"
        className={cn(stacked ? "w-full" : "shrink-0", "bg-champagne-dark text-charcoal hover:bg-champagne-dark/90")}
      >
        {subscribeLabel}
      </Button>
    </form>
  );
}

function FooterHotelLink({
  slug,
  name,
  description,
  variant,
}: {
  slug: string;
  name: string;
  description: string;
  variant: "mobile" | "desktop";
}) {
  const localized = useLocalizedHotel(slug, { name, description });
  const className =
    variant === "mobile"
      ? "text-base font-semibold text-beige/85 hover:text-champagne-dark transition-colors"
      : "text-sm font-semibold text-beige/80 hover:text-champagne-dark transition-colors";

  return (
    <li>
      <Link href={`/hotels/${slug}`} className={className}>
        {localized.name}
      </Link>
    </li>
  );
}
