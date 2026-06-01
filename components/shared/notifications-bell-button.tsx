"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { NotificationsDropdown } from "@/components/shared/notifications-dropdown";
import { useAppLanguage } from "@/hooks/use-app-language";
import {
  useRecentNotifications,
  useUnreadCount,
} from "@/lib/hooks/use-notifications";
import { cn } from "@/lib/utils";

export function NotificationsBellButton({ className }: { className?: string }) {
  const { t } = useAppLanguage();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const active = pathname === "/notifications";

  const { data: unreadCount = 0 } = useUnreadCount();
  const { data: recent = [], isLoading } = useRecentNotifications(5);

  const hasUnread = unreadCount > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          data-icon-button
          className={cn(
            "relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-charcoal transition-all",
            "hover:bg-charcoal/5 active:scale-95",
            active && "bg-champagne-dark/20 ring-2 ring-champagne-dark/35 shadow-[0_0_12px_rgba(201,168,76,0.35)]",
            hasUnread && "notification-bell-pulse",
            className
          )}
          aria-label={
            hasUnread
              ? t("notifications.openMenuWithCount", { count: unreadCount })
              : t("notifications.openMenu")
          }
          aria-expanded={open}
        >
          <Bell className="h-7 w-7 stroke-[1.75]" aria-hidden />
          {hasUnread && (
            <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[0.625rem] font-bold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-auto p-0">
        <NotificationsDropdown
          items={recent}
          isLoading={isLoading}
          onClose={() => setOpen(false)}
        />
      </PopoverContent>
    </Popover>
  );
}
