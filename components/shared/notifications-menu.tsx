"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CalendarCheck, Gift, Info, Sparkles } from "lucide-react";
import { useAppLanguage } from "@/hooks/use-app-language";
import { useNotificationsStore } from "@/stores/notifications-store";
import type { AppNotification, NotificationType } from "@/lib/data/notifications";
import { cn } from "@/lib/utils";

const TYPE_ICON: Record<NotificationType, typeof Bell> = {
  booking: CalendarCheck,
  reminder: Bell,
  offer: Gift,
  system: Info,
};

function formatRelativeTime(
  iso: string,
  t: ReturnType<typeof useAppLanguage>["t"]
) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return t("notifications.justNow");
  if (mins < 60) return t("notifications.minutesAgo", { count: mins });
  const hours = Math.floor(mins / 60);
  if (hours < 24) return t("notifications.hoursAgo", { count: hours });
  const days = Math.floor(hours / 24);
  return t("notifications.daysAgo", { count: days });
}

export function NotificationsMenu({ className }: { className?: string }) {
  const { t } = useAppLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { sorted, isRead, markRead, markAllRead, unreadCount } = useNotificationsStore();
  const items = sorted();
  const unread = unreadCount();

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    return () => document.removeEventListener("mousedown", onPointerDown);
  }, [open]);

  return (
    <div className={cn("relative", className)} ref={ref}>
      <button
        type="button"
        data-icon-button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "relative inline-flex h-11 w-11 items-center justify-center rounded-lg text-charcoal transition-all",
          "hover:bg-charcoal/5 active:scale-95",
          open && "bg-champagne-dark/15 ring-2 ring-champagne-dark/25"
        )}
        aria-label={t("notifications.openMenu")}
        aria-expanded={open}
        aria-haspopup="true"
      >
        <Bell className="h-6 w-6 stroke-[1.75]" aria-hidden />
        {unread > 0 && (
          <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 text-[0.625rem] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,22rem)] rounded-xl border border-charcoal/10 bg-white shadow-warm-lg z-[60] overflow-hidden"
          >
            <div className="flex items-center justify-between gap-2 border-b border-beige/80 px-4 py-3 bg-surface/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-champagne" aria-hidden />
                <h2 className="text-sm font-bold text-charcoal">{t("notifications.title")}</h2>
              </div>
              {unread > 0 && (
                <button
                  type="button"
                  onClick={() => markAllRead()}
                  className="text-xs font-bold text-champagne hover:underline"
                >
                  {t("notifications.markAllRead")}
                </button>
              )}
            </div>

            <ul className="max-h-[min(20rem,60dvh)] overflow-y-auto">
              {items.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm font-semibold text-muted">
                  {t("notifications.empty")}
                </li>
              ) : (
                items.map((item) => (
                  <NotificationRow
                    key={item.id}
                    item={item}
                    read={isRead(item.id)}
                    onOpen={() => {
                      markRead(item.id);
                      setOpen(false);
                    }}
                  />
                ))
              )}
            </ul>

            <div className="border-t border-beige/80 p-2">
              <Link
                href="/account/notifications"
                onClick={() => setOpen(false)}
                className="block rounded-lg py-2.5 text-center text-sm font-bold text-champagne hover:bg-surface transition-colors"
              >
                {t("notifications.viewAll")}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationRow({
  item,
  read,
  onOpen,
}: {
  item: AppNotification;
  read: boolean;
  onOpen: () => void;
}) {
  const { t } = useAppLanguage();
  const Icon = TYPE_ICON[item.type];
  const title = t(item.titleKey, item.bodyParams ?? {});
  const body = t(item.bodyKey, item.bodyParams ?? {});
  const time = formatRelativeTime(item.createdAt, t);

  const inner = (
    <>
      <span
        className={cn(
          "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
          read ? "bg-surface text-muted" : "bg-champagne/15 text-champagne"
        )}
      >
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-start justify-between gap-2">
          <span
            className={cn(
              "text-sm leading-snug",
              read ? "font-semibold text-charcoal/80" : "font-bold text-charcoal"
            )}
          >
            {title}
          </span>
          {!read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-champagne" aria-hidden />
          )}
        </span>
        <span className="mt-0.5 block text-xs text-muted font-medium line-clamp-2">{body}</span>
        <span className="mt-1 block text-[0.65rem] font-semibold text-muted/80">{time}</span>
      </span>
    </>
  );

  const rowClass =
    "flex gap-3 px-4 py-3 border-b border-beige/60 last:border-0 hover:bg-surface/80 transition-colors text-left w-full";

  if (item.href) {
    return (
      <li>
        <Link href={item.href} onClick={onOpen} className={rowClass}>
          {inner}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button type="button" onClick={onOpen} className={rowClass}>
        {inner}
      </button>
    </li>
  );
}
