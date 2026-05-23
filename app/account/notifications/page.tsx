"use client";

import Link from "next/link";
import { Bell, CalendarCheck, Gift, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
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

export default function NotificationsPage() {
  const { t } = useAppLanguage();
  const { sorted, isRead, markRead, markAllRead, unreadCount } = useNotificationsStore();
  const items = sorted();
  const unread = unreadCount();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-charcoal">{t("notifications.title")}</h2>
          <p className="text-sm text-muted mt-1 font-semibold">{t("notifications.pageSubtitle")}</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => markAllRead()}>
            {t("notifications.markAllRead")}
          </Button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-beige bg-surface/50 px-4 py-12 text-center text-sm font-semibold text-muted">
          {t("notifications.empty")}
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => (
            <NotificationCard
              key={item.id}
              item={item}
              read={isRead(item.id)}
              onMarkRead={() => markRead(item.id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

function NotificationCard({
  item,
  read,
  onMarkRead,
}: {
  item: AppNotification;
  read: boolean;
  onMarkRead: () => void;
}) {
  const { t } = useAppLanguage();
  const Icon = TYPE_ICON[item.type];
  const title = t(item.titleKey, item.bodyParams ?? {});
  const body = t(item.bodyKey, item.bodyParams ?? {});
  const date = new Date(item.createdAt).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const content = (
    <div
      className={cn(
        "flex gap-4 rounded-xl border p-4 sm:p-5 transition-colors",
        read
          ? "border-beige bg-white"
          : "border-champagne/30 bg-champagne/[0.04] shadow-warm"
      )}
    >
      <span
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
          read ? "bg-surface text-muted" : "bg-champagne/15 text-champagne"
        )}
      >
        <Icon className="h-5 w-5" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h3
            className={cn(
              "font-display text-base",
              read ? "font-semibold text-charcoal/85" : "font-bold text-charcoal"
            )}
          >
            {title}
          </h3>
          {!read && (
            <span className="rounded-full bg-champagne/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-champagne">
              {t("notifications.new")}
            </span>
          )}
        </div>
        <p className="mt-1 text-sm text-muted font-medium leading-relaxed">{body}</p>
        <p className="mt-2 text-xs font-semibold text-muted/80">{date}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {item.href && (
            <Link
              href={item.href}
              onClick={onMarkRead}
              className="text-sm font-bold text-champagne hover:underline"
            >
              {t("notifications.viewDetails")}
            </Link>
          )}
          {!read && (
            <button
              type="button"
              onClick={onMarkRead}
              className="text-sm font-semibold text-muted hover:text-charcoal"
            >
              {t("notifications.markRead")}
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return <li>{content}</li>;
}
