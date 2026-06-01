"use client";

import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Crown,
  ChevronDown,
  Star,
  Globe,
  CircleUser,
  Bell,
  Home,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useHotelsCatalog } from "@/lib/context/hotels-catalog";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";
import type { AppLanguage } from "@/lib/i18n";
import { NotificationsBellButton } from "@/components/shared/notifications-bell-button";
import { PendingPaymentBanner } from "@/components/shared/pending-payment-banner";
import { usePendingPaymentStore } from "@/stores/pending-payment-store";
export function Navbar() {
  const { hotels } = useHotelsCatalog();
  const { t, languages, changeLanguage } = useAppLanguage();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isDonor = (session?.user as { isDonor?: boolean })?.isDonor;
  const [scrolled, setScrolled] = useState(false);
  const { payment: pendingPayment, hydrate: hydratePendingPayment } = usePendingPaymentStore();
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    hydratePendingPayment();
  }, [hydratePendingPayment]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const syncHeaderOffset = () => {
      const height = Math.ceil(header.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-offset", `${height}px`);
    };

    syncHeaderOffset();
    const observer = new ResizeObserver(syncHeaderOffset);
    observer.observe(header);
    window.addEventListener("resize", syncHeaderOffset);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncHeaderOffset);
    };
  }, [pendingPayment]);

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

  const primaryDesktopLinks = [
    { href: "/donors", label: t("nav.donorProgram") },
    { href: "/about", label: t("nav.about") },
    { href: "/contact", label: t("nav.contact") },
  ];

  const secondaryDesktopLinks = [
    { href: "/schemes", label: t("nav.schemes") },
    { href: "/founder", label: t("nav.founder") },
    { href: "/health-centre", label: t("nav.healthCentre") },
  ];

  const desktopLinks = [...primaryDesktopLinks, ...secondaryDesktopLinks];

  const drawerLinks = [
    ...desktopLinks,
    { href: "/search", label: t("nav.search", "Search") },
  ];

  const navLinkClass =
    "whitespace-nowrap shrink-0 text-[0.8125rem] xl:text-sm font-semibold text-charcoal hover:text-champagne transition-colors relative after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:w-0 after:bg-champagne-dark after:transition-all hover:after:w-full";

  return (
    <>
      <header
        ref={headerRef}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          scrolled ? "navbar-glass-scrolled" : "navbar-glass"
        )}
      >
        <div className="h-[3px] w-full bg-gradient-to-r from-champagne-dark via-champagne to-champagne-dark shadow-[0_1px_4px_rgba(201,168,76,0.25)]" />
        <PendingPaymentBanner />
        <nav
          className="page-container grid min-h-16 grid-cols-[auto_1fr_auto] items-center gap-x-2 py-2.5 sm:gap-x-3 lg:min-h-[4.75rem] lg:gap-x-4 lg:py-3 xl:min-h-[5rem] xl:gap-x-5"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Link
            href="/"
            className="select-none shrink-0 hover:opacity-90 transition-opacity group min-w-0"
            aria-label="Vasavi Hotels home"
          >
            <span className="flex items-center gap-2 sm:gap-2.5">
              <span className="relative h-9 w-9 sm:h-10 sm:w-10 lg:h-10 lg:w-10 xl:h-11 xl:w-11 shrink-0 rounded-full overflow-hidden group-hover:scale-105 group-hover:rotate-6 transition-transform duration-300">
                <Image
                  src="/images/vasavi-logo.png"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain rounded-full"
                />
              </span>
              <span className="flex min-w-0 flex-col leading-none">
                <span className="font-display text-base sm:text-lg lg:text-lg xl:text-xl font-black tracking-[0.04em] text-charcoal uppercase truncate">
                  {t("brand.vasavi")}
                </span>
                <span className="text-[0.625rem] sm:text-[0.7rem] lg:text-[0.625rem] xl:text-xs font-bold uppercase tracking-[0.18em] xl:tracking-[0.2em] text-champagne-dark truncate">
                  {t("brand.spiritualStays")}
                </span>
              </span>
            </span>
          </Link>

          {/* Desktop inline nav — centered, never overlaps utilities */}
          <div className="hidden lg:flex min-w-0 items-center justify-center gap-2 xl:gap-4 2xl:gap-5 px-1 xl:px-2">
            <div
              className="relative shrink-0"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 whitespace-nowrap text-[0.8125rem] xl:text-sm font-semibold text-charcoal hover:text-champagne transition-colors"
                aria-expanded={megaOpen}
                aria-haspopup="true"
              >
                {t("nav.hotels")}
                <ChevronDown
                  className={cn("h-4 w-4 shrink-0 transition-transform duration-200", megaOpen && "rotate-180")}
                />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.18, ease: "easeOut" }}
                    className="fixed left-1/2 -translate-x-1/2 z-[200] pt-2"
                    style={{ top: "var(--site-header-offset, 5.25rem)" }}
                  >
                    {/* Invisible bridge so mouse moving down doesn't close the menu */}
                    <div className="absolute -top-2 left-0 right-0 h-2" />
                    <div className="w-[min(90vw,56rem)] bg-white rounded-2xl border border-beige/70 shadow-warm-lg overflow-hidden">
                      <div className="p-5 grid grid-cols-3 gap-2 max-h-[70vh] overflow-y-auto">
                        {hotels.map((hotel) => (
                          <Link
                            key={hotel.id}
                            href={`/hotels/${hotel.slug}`}
                            className="flex gap-3 rounded-xl p-2.5 hover:bg-surface transition-colors group"
                            onClick={() => setMegaOpen(false)}
                          >
                            <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg">
                              <Image
                                src={hotel.thumbnail}
                                alt={hotel.name}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                sizes="64px"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="font-display text-sm lg:text-base font-bold text-charcoal leading-snug line-clamp-2 group-hover:text-champagne transition-colors">
                                {hotel.name}
                              </p>
                              <p className="text-xs lg:text-sm font-semibold text-muted mt-0.5">{hotel.city}</p>
                              <div className="flex items-center gap-0.5 mt-0.5">
                                {Array.from({ length: hotel.starRating }).map((_, i) => (
                                  <Star key={i} className="h-2.5 w-2.5 fill-champagne-dark text-champagne-dark" />
                                ))}
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <div className="border-t border-beige/60 px-5 py-3 flex items-center justify-between bg-surface/60">
                        <p className="text-xs lg:text-sm text-muted font-semibold">
                          {hotels.length} {t("nav.hotels").toLowerCase()}
                        </p>
                        <Link
                          href="/search"
                          onClick={() => setMegaOpen(false)}
                          className="text-xs lg:text-sm font-bold text-champagne hover:underline"
                        >
                          {t("hotels.openFullSearch")} →
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {primaryDesktopLinks.map((link) => (
              <Link key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </Link>
            ))}

            {secondaryDesktopLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(navLinkClass, "hidden xl:inline-flex")}
              >
                {link.label}
              </Link>
            ))}

            <NavMoreMenu
              links={secondaryDesktopLinks}
              label={t("nav.more", "More")}
              className="xl:hidden"
            />
          </div>

          {/* Utilities — fixed width, separated from nav links */}
          <div className="flex shrink-0 items-center justify-end gap-0.5 sm:gap-1 lg:gap-1.5 lg:border-l lg:border-charcoal/10 lg:pl-3 xl:gap-2 xl:pl-4">
            <LanguageSelect variant="desktop" languages={languages} onChange={changeLanguage} />
            <LanguageSelect variant="mobile" languages={languages} onChange={changeLanguage} />

            <NavIconButton
              href="/search"
              label={t("common.searchStays")}
              className="hidden md:inline-flex"
            >
              <Search className="h-6 w-6 stroke-[1.75] xl:h-7 xl:w-7" />
            </NavIconButton>

            {session && (
              <NotificationsBellButton className="h-10 w-10 sm:h-11 sm:w-11 xl:h-12 xl:w-12" />
            )}

            <div className="relative" ref={userMenuRef}>
              <NavIconButton
                label={session ? t("common.accountMenu") : t("common.signIn")}
                active={userMenuOpen || !!session}
                onClick={() => setUserMenuOpen((o) => !o)}
                aria-expanded={userMenuOpen}
              >
                {session?.user?.name?.[0] ? (
                  <span className="text-sm xl:text-base font-bold">{session.user.name[0]}</span>
                ) : (
                  <CircleUser className="h-6 w-6 stroke-[1.75] xl:h-7 xl:w-7" />
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
                    className="absolute right-0 top-full mt-2 w-52 max-w-[calc(100vw-2.5rem)] rounded-xl border border-charcoal/10 bg-white py-2 shadow-warm-lg z-[60]"
                  >
                    {session ? (
                      <>
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
                {session && (
                  <Link
                    href="/notifications"
                    onClick={closeMobile}
                    className="flex min-h-12 items-center gap-2 border-b border-charcoal/8 text-base font-bold text-charcoal hover:text-champagne transition-colors"
                  >
                    <Bell className="h-5 w-5" aria-hidden />
                    {t("nav.notifications")}
                  </Link>
                )}

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
                  {hotels.map((h) => (
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

      {/* Premium Mobile Bottom Navigation Bar */}
      <div className="mobile-bottom-nav-container lg:hidden">
        <div className="flex w-full items-center justify-around px-2">
          <Link
            href="/"
            className={cn(
              "mobile-bottom-nav-item",
              pathname === "/" && "mobile-bottom-nav-item--active"
            )}
          >
            <Home className="h-5.5 w-5.5 stroke-[1.8]" />
            <span className="text-[10px] tracking-wide">{t("nav.home", "Home")}</span>
          </Link>

          <Link
            href="/search"
            className={cn(
              "mobile-bottom-nav-item",
              pathname?.startsWith("/search") && "mobile-bottom-nav-item--active"
            )}
          >
            <Search className="h-5.5 w-5.5 stroke-[1.8]" />
            <span className="text-[10px] tracking-wide">{t("nav.search", "Search")}</span>
          </Link>

          <Link
            href="/donors"
            className={cn(
              "mobile-bottom-nav-item",
              pathname === "/donors" && "mobile-bottom-nav-item--active"
            )}
          >
            <Crown className="h-5.5 w-5.5 stroke-[1.8]" />
            <span className="text-[10px] tracking-wide">{t("nav.donorProgram", "Donors")}</span>
          </Link>

          <Link
            href={session ? "/account/profile" : "/login"}
            className={cn(
              "mobile-bottom-nav-item",
              (pathname?.startsWith("/account") || pathname === "/login") && "mobile-bottom-nav-item--active"
            )}
          >
            <CircleUser className="h-5.5 w-5.5 stroke-[1.8]" />
            <span className="text-[10px] tracking-wide">{session ? t("nav.myProfile", "Profile") : t("nav.login", "Sign In")}</span>
          </Link>
        </div>
      </div>
    </>
  );
}

function NavMoreMenu({
  links,
  label,
  className,
}: {
  links: { href: string; label: string }[];
  label: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div ref={ref} className={cn("relative shrink-0", className)}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 whitespace-nowrap text-[0.8125rem] xl:text-sm font-semibold text-charcoal hover:text-champagne transition-colors"
        aria-expanded={open}
        aria-haspopup="true"
      >
        {label}
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="absolute left-1/2 top-full z-[60] mt-2 min-w-[12rem] -translate-x-1/2 rounded-xl border border-charcoal/10 bg-white py-2 shadow-warm-lg"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 text-sm font-semibold text-charcoal hover:bg-surface hover:text-champagne transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
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
      <div className="hidden md:flex shrink-0 items-center gap-1 text-charcoal">
        <Globe className="h-4 w-4 shrink-0" aria-hidden />
        <select
          value={language}
          onChange={(e) => void onChange(e.target.value as AppLanguage)}
          className="bg-transparent text-xs xl:text-sm font-semibold focus:outline-none appearance-none cursor-pointer pr-1 max-w-[3.25rem]"
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
    "relative inline-flex h-10 w-10 sm:h-11 sm:w-11 xl:h-12 xl:w-12 items-center justify-center rounded-lg text-charcoal transition-all",
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
