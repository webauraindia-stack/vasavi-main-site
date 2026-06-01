"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  CalendarCheck,
  Gift,
  Info,
  Loader2,
  Search,
  Tag,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppLanguage } from "@/hooks/use-app-language";
import {
  CATEGORY_FILTER_MAP,
  notificationHref,
  type AppNotification,
  type CategoryFilterKey,
  type NotificationCategory,
} from "@/lib/api/notifications";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import {
  useMarkAllRead,
  useMarkRead,
  useNotificationsList,
  useUnreadCount,
} from "@/lib/hooks/use-notifications";
import { cn } from "@/lib/utils";

type StatusFilter = "all" | "read" | "unread";

const CATEGORY_ICON: Record<NotificationCategory, typeof Bell> = {
  coupon: Tag,
  donation: Gift,
  user: User,
  system: Info,
};

const STATUS_FILTERS: StatusFilter[] = ["all", "unread", "read"];
const CATEGORY_FILTERS: CategoryFilterKey[] = ["all", "coupon", "donation", "system"];

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delayMs);
    return () => window.clearTimeout(timer);
  }, [value, delayMs]);
  return debounced;
}

export function NotificationsPageContent() {
  const { t } = useAppLanguage();
  const router = useRouter();
  const { status, isAuthenticated } = useAuthenticatedSession();

  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilterKey>("all");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(searchInput, 300);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, categoryFilter, debouncedSearch]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/login?callbackUrl=${encodeURIComponent("/notifications")}`);
    }
  }, [status, router]);

  const { data: unreadData } = useUnreadCount();
  const unread = unreadData ?? 0;

  const { data, isLoading, isFetching } = useNotificationsList({
    page,
    page_size: 20,
    status: statusFilter,
    category: CATEGORY_FILTER_MAP[categoryFilter],
    search: debouncedSearch || undefined,
  });

  const markAllRead = useMarkAllRead();

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-2 pt-20 text-muted">
        <Loader2 className="h-5 w-5 animate-spin" />
        {t("common.loading", "Loading…")}
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const items = data?.results ?? [];
  const totalCount = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / 20));
  const hasPrevious = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="pt-20 pb-20 bg-white min-h-screen">
      <div className="bg-surface border-b border-beige py-14 md:py-16">
        <div className="page-container max-w-3xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-4xl md:text-5xl text-charcoal mb-2">
                {t("notifications.title")}
              </h1>
              <p className="text-base text-muted font-semibold max-w-xl">
                {t("notifications.pageSubtitle")}
              </p>
            </div>
            {unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                disabled={markAllRead.isPending}
                onClick={() => markAllRead.mutate()}
              >
                {t("notifications.markAllRead")}
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="page-container max-w-3xl mt-10 space-y-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={t("notifications.searchPlaceholder")}
            className="pl-10"
            aria-label={t("notifications.searchPlaceholder")}
          />
        </div>

        <div className="space-y-3">
          <div className="flex flex-wrap gap-2">
            {STATUS_FILTERS.map((filter) => (
              <FilterPill
                key={filter}
                active={statusFilter === filter}
                onClick={() => setStatusFilter(filter)}
                label={t(`notifications.filterStatus.${filter}`)}
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((filter) => (
              <FilterPill
                key={filter}
                active={categoryFilter === filter}
                onClick={() => setCategoryFilter(filter)}
                label={t(`notifications.filterCategory.${filter}`)}
              />
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center gap-2 py-16 text-muted">
            <Loader2 className="h-5 w-5 animate-spin" />
            {t("common.loading", "Loading…")}
          </div>
        ) : items.length === 0 ? (
          <p className="rounded-xl border border-dashed border-beige bg-surface/50 px-4 py-16 text-center text-sm font-semibold text-muted">
            {t("notifications.emptyFiltered")}
          </p>
        ) : (
          <>
            <ul className="space-y-3">
              {items.map((item) => (
                <NotificationCard key={item.id} item={item} />
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-between gap-4 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasPrevious || isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  {t("notifications.previous")}
                </Button>
                <span className="text-sm font-semibold text-muted">
                  {t("notifications.pageOf", { page, total: totalPages })}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!hasNext || isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  {t("notifications.next")}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

function FilterPill({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-bold transition-colors",
        active
          ? "border-champagne bg-champagne/10 text-champagne"
          : "border-beige bg-white text-muted hover:border-champagne/40 hover:text-charcoal"
      )}
    >
      {label}
    </button>
  );
}

function NotificationCard({ item }: { item: AppNotification }) {
  const { t } = useAppLanguage();
  const router = useRouter();
  const markRead = useMarkRead();
  const read = item.is_read;
  const Icon = CATEGORY_ICON[item.category] ?? CalendarCheck;
  const href = notificationHref(item);

  const date = new Date(item.created_at).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const handleMarkRead = () => {
    if (!read) markRead.mutate(item.id);
  };

  const handleView = () => {
    handleMarkRead();
    if (href) router.push(href);
  };

  return (
    <li>
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
            <h2
              className={cn(
                "font-display text-base",
                read ? "font-semibold text-charcoal/85" : "font-bold text-charcoal"
              )}
            >
              {item.title}
            </h2>
            {!read && (
              <span className="rounded-full bg-champagne/15 px-2 py-0.5 text-[0.625rem] font-bold uppercase tracking-wide text-champagne">
                {t("notifications.new")}
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted font-medium leading-relaxed">{item.message}</p>
          <p className="mt-2 text-xs font-semibold text-muted/80">{date}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {href && (
              <button
                type="button"
                onClick={handleView}
                className="text-sm font-bold text-champagne hover:underline"
              >
                {t("notifications.viewDetails")}
              </button>
            )}
            {!read && (
              <button
                type="button"
                onClick={handleMarkRead}
                disabled={markRead.isPending}
                className="text-sm font-semibold text-muted hover:text-charcoal"
              >
                {t("notifications.markRead")}
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}
