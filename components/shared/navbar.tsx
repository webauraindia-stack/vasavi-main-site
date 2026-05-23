"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Crown,
  ChevronDown,
  Star,
  Globe,
  Heart,
  CircleUser,
  Bell,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { HOTELS } from "@/lib/data/hotels";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import type { AppLanguage } from "@/lib/i18n";
import { NotificationsMenu } from "@/components/shared/notifications-menu";

export function Navbar() {
  const { t, languages, changeLanguage } = useAppLanguage();
  const { data: session } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isDonor = (session?.user as { isDonor?: boolean })?.isDonor;
  const [scrolled, setScrolled] = useState(false);

  useBodyScrollLock(mobileOpen);

  const closeMobile = () => setMobileOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!userMenuOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [userMenuOpen]);

  const desktopLinks = [
    { href: "/donors", label: t("nav.donorProgram") },
    { href: "/schemes", label: t("nav.schemes") },
    { href: "/founder", label: t("nav.founder") },
    { href: "/about", label: t("nav.about") },
    { href: "/health-centre", label: t("nav.healthCentre") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const drawerLinks = [
    ...desktopLinks,
    { href: "/search", label: t("nav.search", "Search") },
  ];

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "navbar-glass-scrolled" : "navbar-glass"
        )}
      >
        <nav
          className="page-container flex h-14 items-center justify-between gap-3 lg:h-16"
          aria-label="Main navigation"
        >
          {/* Logo — Trivago-style wordmark */}
          <Link
            href="/"
            className="select-none shrink-0 hover:opacity-90 transition-opacity group"
            aria-label="Vasavi Hotels home"
          >
            <span className="flex items-center gap-2.5">
              <span className="relative hidden h-9 w-9 shrink-0 sm:block rounded-full border border-champagne-dark/35 p-1 bg-white shadow-warm">
                <Image
                  src="/images/vasavi-club-logo.svg"
                  alt=""
                  fill
                  className="object-contain p-0.5"
                />
              </span>
              <span className="flex flex-col leading-none">
                <span className="font-display text-[1.05rem] sm:text-xl font-black tracking-[0.04em] text-charcoal uppercase">
                  {t("brand.vasavi")}
                </span>
                <span className="text-[0.65rem] sm:text-xs font-bold uppercase tracking-[0.22em] text-champagne-dark">
                  {t("brand.spiritualStays")}
                </span>
              </span>
            </span>
          </Link>

          {/* Desktop inline nav */}
          <div className="hidden lg:flex flex-1 items-center justify-center gap-6 xl:gap-8">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 text-base font-semibold text-charcoal hover:text-champagne transition-colors"
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                {t("nav.hotels")} <ChevronDown className="h-4 w-4" />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute left-1/2 top-full -translate-x-1/2 pt-4 w-screen max-w-5xl"
                  >
                    <div className="bg-white rounded-[var(--radius-devotional)] p-6 grid grid-cols-3 gap-4 border border-beige/70 shadow-warm-lg">
                      {HOTELS.map((hotel) => (
                        <Link
                          key={hotel.id}
                          href={`/hotels/${hotel.slug}`}
                          className="flex gap-3 rounded-lg p-2 hover:bg-surface transition-colors group"
                          onClick={() => setMegaOpen(false)}
                        >
                          <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md">
                            <Image
                              src={hotel.thumbnail}
                              alt={hotel.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform"
                              sizes="80px"
                            />
                          </div>
                          <div>
                            <p className="font-display text-sm font-bold text-charcoal">{hotel.name}</p>
                            <p className="text-sm font-semibold text-muted">{hotel.city}</p>
                            <div className="flex items-center gap-0.5 mt-0.5">
                              {Array.from({ length: hotel.starRating }).map((_, i) => (
                                <Star key={i} className="h-3 w-3 fill-champagne-dark text-champagne-dark" />
                              ))}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {desktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-bold text-charcoal hover:text-champagne transition-colors whitespace-nowrap relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-champagne-dark after:transition-all hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right icons — Trivago-style cluster */}
          <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
            <LanguageSelect variant="desktop" languages={languages} onChange={changeLanguage} />
            <LanguageSelect variant="mobile" languages={languages} onChange={changeLanguage} />

            <NavIconButton
              href={session ? "/account/bookings" : "/search"}
              label={session ? t("common.savedStays") : t("common.searchStays")}
              className="hidden md:inline-flex"
            >
              <Heart className="h-6 w-6 stroke-[1.75]" />
            </NavIconButton>

            <NotificationsMenu />

            <div className="relative" ref={userMenuRef}>
              <NavIconButton
                label={session ? t("common.accountMenu") : t("common.signIn")}
                active={userMenuOpen || !!session}
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
              >
                {session?.user?.name?.[0] ? (
                  <span className="text-sm font-bold">{session.user.name[0]}</span>
                ) : (
                  <CircleUser className="h-6 w-6 stroke-[1.75]" />
                )}
                {isDonor && (
                  <Crown className="absolute -top-0.5 -right-0.5 h-3.5 w-3.5 text-champagne-dark" aria-hidden />
                )}
              </NavIconButton>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-charcoal/10 bg-white py-2 shadow-warm-lg z-[60]"
                  >
                    {session ? (
                      <>
                        <DropdownLink href="/account/notifications" onClick={() => setUserMenuOpen(false)}>
                          {t("nav.notifications")}
                        </DropdownLink>
                        <DropdownLink href="/account/bookings" onClick={() => setUserMenuOpen(false)}>
                          {t("nav.myBookings")}
                        </DropdownLink>
                        <DropdownLink href="/account/profile" onClick={() => setUserMenuOpen(false)}>
                          {t("nav.myProfile")}
                        </DropdownLink>
                        {isDonor && (
                          <DropdownLink href="/account/donor" onClick={() => setUserMenuOpen(false)}>
                            {t("nav.donorBenefits")}
                          </DropdownLink>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            signOut();
                            setUserMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-surface"
                        >
                          {t("nav.logout")}
                        </button>
                      </>
                    ) : (
                      <DropdownLink href="/login" onClick={() => setUserMenuOpen(false)}>
                        {t("nav.login")}
                      </DropdownLink>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <NavIconButton
              label={t("common.openMenu")}
              onClick={() => setMobileOpen(true)}
              className="lg:hidden"
            >
              <Menu className="h-6 w-6 stroke-[1.75]" />
            </NavIconButton>
          </div>
        </nav>
      </header>

      {/* Mobile / tablet drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-charcoal/40 lg:hidden"
              onClick={closeMobile}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col bg-white text-charcoal border-l border-charcoal/10 shadow-warm-lg lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-charcoal/10 px-4 py-3">
                <span className="font-display text-lg font-bold lowercase">
                  vasavi<span className="text-champagne">hotels</span>
                </span>
                <NavIconButton label={t("common.closeMenu")} onClick={closeMobile}>
                  <X className="h-6 w-6" />
                </NavIconButton>
              </div>

              <div className="flex-1 overflow-y-auto px-4 py-2">
                <Link
                  href="/account/notifications"
                  onClick={closeMobile}
                  className="flex min-h-12 items-center gap-2 border-b border-charcoal/8 text-base font-bold text-charcoal hover:text-champagne transition-colors"
                >
                  <Bell className="h-5 w-5" aria-hidden />
                  {t("nav.notifications")}
                </Link>

                <nav>
                  {drawerLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={closeMobile}
                      className="flex min-h-12 items-center border-b border-charcoal/8 text-base font-bold text-charcoal hover:text-champagne transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <p className="text-label mt-6 mb-3">{t("nav.hotelsSection")}</p>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
                  {HOTELS.map((h) => (
                    <Link
                      key={h.id}
                      href={`/hotels/${h.slug}`}
                      onClick={closeMobile}
                      className="shrink-0 flex items-center gap-2 rounded-full border border-charcoal/15 bg-surface px-3 py-2 hover:border-champagne/40 transition-colors"
                    >
                      <div className="relative h-8 w-8 rounded-full overflow-hidden">
                        <Image src={h.thumbnail} alt="" fill className="object-cover" sizes="32px" />
                      </div>
                      <span className="text-sm font-semibold whitespace-nowrap">{h.city}</span>
                    </Link>
                  ))}
                </div>

              </div>

              <div className="border-t border-charcoal/10 p-4">
                {session ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      signOut();
                      closeMobile();
                    }}
                    className="w-full"
                  >
                    {t("nav.logout")}
                  </Button>
                ) : (
                  <Link href="/login" onClick={closeMobile}>
                    <Button className="w-full">{t("nav.login")}</Button>
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

function LanguageSelect({
  variant,
  languages,
  onChange,
}: {
  variant: "desktop" | "mobile";
  languages: readonly { code: AppLanguage; label: string }[];
  onChange: (lang: AppLanguage) => void | Promise<void>;
}) {
  const { language } = useAppLanguage();
  const current = languages.find((l) => l.code === language) ?? languages[0];
  const short = current.code.toUpperCase();

  if (variant === "desktop") {
    return (
      <div className="hidden md:flex items-center gap-1 mr-1 text-charcoal">
        <Globe className="h-4 w-4 shrink-0" aria-hidden />
        <select
          value={language}
          onChange={(e) => void onChange(e.target.value as AppLanguage)}
          className="bg-transparent text-sm font-semibold focus:outline-none appearance-none cursor-pointer pr-1"
          aria-label="Select language"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.code.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <label
      className={cn(
        "relative inline-flex md:hidden h-11 min-w-11 items-center justify-center gap-0.5 rounded-lg px-2",
        "text-charcoal hover:bg-charcoal/5 active:scale-95 transition-all cursor-pointer"
      )}
      aria-label="Select language"
    >
      <Globe className="h-5 w-5 shrink-0" aria-hidden />
      <span className="text-[10px] font-bold leading-none">{short}</span>
      <select
        value={language}
        onChange={(e) => void onChange(e.target.value as AppLanguage)}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        aria-label="Select language"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function NavIconButton({
  children,
  label,
  active,
  href,
  className,
  onClick,
  ...props
}: {
  children: ReactNode;
  label: string;
  active?: boolean;
  href?: string;
  className?: string;
  onClick?: () => void;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">) {
  const classes = cn(
    "relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-charcoal transition-all",
    "hover:bg-charcoal/5 active:scale-95",
    active && "bg-champagne-dark/20 ring-2 ring-champagne-dark/35 shadow-[0_0_12px_rgba(201,168,76,0.35)]",
    className
  );

  if (href) {
    return (
      <Link
        href={href}
        data-icon-button
        className={classes}
        aria-label={label}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      data-icon-button
      className={classes}
      aria-label={label}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
}

function DropdownLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="block px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-surface hover:text-champagne transition-colors"
    >
      {children}
    </Link>
  );
}
