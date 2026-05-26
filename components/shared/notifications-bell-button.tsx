"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useNotificationsStore } from "@/stores/notifications-store";
import { cn } from "@/lib/utils";

export function NotificationsBellButton({ className }: { className?: string }) {
  const { t } = useAppLanguage();
  const pathname = usePathname();
  const unread = useNotificationsStore((s) => s.unreadCount());
  const active = pathname === "/notifications";

  return (
    <Link
      href="/notifications"
      data-icon-button
      className={cn(
        "relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-charcoal transition-all",
        "hover:bg-charcoal/5 active:scale-95",
        active && "bg-champagne-dark/20 ring-2 ring-champagne-dark/35 shadow-[0_0_12px_rgba(201,168,76,0.35)]",
        className
      )}
      aria-label={t("notifications.openPage")}
      aria-current={active ? "page" : undefined}
    >
      <Bell className="h-7 w-7 stroke-[1.75]" aria-hidden />
      {unread > 0 && (
        <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[0.625rem] font-bold text-white">
          {unread > 9 ? "9+" : unread}
        </span>
      )}
    </Link>
  );
}
