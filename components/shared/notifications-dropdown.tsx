"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppLanguage } from "@/hooks/use-app-language";
import {
  notificationHref,
  type AppNotification,
} from "@/lib/api/notifications";
import { useMarkRead } from "@/lib/hooks/use-notifications";
import { cn } from "@/lib/utils";

function formatRelativeTime(iso: string, t: (key: string, params?: Record<string, string | number>) => string): string {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);
  if (diffMin < 1) return t("notifications.justNow");
  if (diffMin < 60) return t("notifications.minutesAgo", { count: diffMin });
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return t("notifications.hoursAgo", { count: diffHr });
  const diffDays = Math.floor(diffHr / 24);
  if (diffDays < 7) return t("notifications.daysAgo", { count: diffDays });
  return date.toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });
}

export function NotificationsDropdown({
  items,
  isLoading,
  onClose,
}: {
  items: AppNotification[];
  isLoading: boolean;
  onClose: () => void;
}) {
  const { t } = useAppLanguage();
  const router = useRouter();
  const markRead = useMarkRead();

  const handleItemClick = async (item: AppNotification) => {
    if (!item.is_read) {
      try {
        await markRead.mutateAsync(item.id);
      } catch {
        /* ignore — navigation still useful */
      }
    }
    onClose();
    const href = notificationHref(item);
    if (href) router.push(href);
  };

  return (
    <div className="flex w-[min(22rem,calc(100vw-2rem))] flex-col">
      <div className="border-b border-charcoal/10 px-4 py-3">
        <h2 className="font-display text-base font-bold text-charcoal">
          {t("notifications.title")}
        </h2>
      </div>

      <div className="max-h-[min(24rem,60vh)] overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-muted">
            <Loader2 className="h-4 w-4 animate-spin" />
            {t("common.loading", "Loading…")}
          </div>
        ) : items.length === 0 ? (
          <p className="px-4 py-10 text-center text-sm font-semibold text-muted">
            {t("notifications.empty")}
          </p>
        ) : (
          <ul className="divide-y divide-charcoal/8">
            {items.map((item) => (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    "w-full px-4 py-3 text-left transition-colors hover:bg-surface/80",
                    !item.is_read && "bg-champagne/[0.04]"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p
                      className={cn(
                        "text-sm leading-snug",
                        item.is_read ? "font-semibold text-charcoal/85" : "font-bold text-charcoal"
                      )}
                    >
                      {item.title}
                    </p>
                    {!item.is_read && (
                      <span className="shrink-0 rounded-full bg-champagne/15 px-1.5 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-champagne">
                        {t("notifications.new")}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs font-medium leading-relaxed text-muted">
                    {item.message}
                  </p>
                  <p className="mt-1.5 text-[0.6875rem] font-semibold text-muted/80">
                    {formatRelativeTime(item.created_at, t)}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="border-t border-charcoal/10 p-2">
        <Button variant="ghost" size="sm" className="w-full justify-center font-bold" asChild>
          <Link href="/notifications" onClick={onClose}>
            {t("notifications.viewAll")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
