"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { useAppLanguage } from "@/hooks/use-app-language";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { t } = useAppLanguage();
  const pathname = usePathname();
  const { data: session } = useSession();
  const isDonor = (session?.user as { isDonor?: boolean })?.isDonor;

  const links = [
    { href: "/account/notifications", label: t("nav.notifications") },
    { href: "/account/bookings", label: t("account.myBookings") },
    { href: "/account/profile", label: t("account.myProfile") },
    { href: "/account/donor", label: t("account.donorBenefits"), donorOnly: true },
  ];

  return (
    <div className="pt-20 pb-16">
      <div className="page-container max-w-4xl">
        <h1 className="font-display text-3xl text-charcoal mb-8">{t("account.title")}</h1>
        <div className="flex flex-col md:flex-row gap-8">
          <nav className="md:w-48 shrink-0 flex md:flex-col gap-1">
            {links
              .filter((l) => !l.donorOnly || isDonor)
              .map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm transition-colors",
                    pathname === link.href ||
                    (link.href === "/account/bookings" &&
                      pathname.startsWith("/account/bookings/")) ||
                    (link.href === "/account/notifications" &&
                      pathname.startsWith("/account/notifications"))
                      ? "bg-champagne/20 text-champagne"
                      : "text-muted hover:text-charcoal hover:bg-surface"
                  )}
                >
                  {link.label}
                </Link>
              ))}
          </nav>
          <div className="flex-1 min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}
