import { apiFetch } from "@/lib/api/client";

export type NotificationCategory = "coupon" | "donation" | "user" | "system";

export type NotificationType =
  | "coupon_redeemed"
  | "coupon_expired"
  | "coupon_nearing_expiry"
  | "donation_received"
  | "donation_approved"
  | "donation_rejected"
  | "profile_updated"
  | "password_changed"
  | "account_approved"
  | "system_alert";

export type AppNotification = {
  id: string;
  category: NotificationCategory;
  type: NotificationType;
  title: string;
  message: string;
  metadata: Record<string, unknown>;
  related_entity_type: string;
  related_entity_id: string | null;
  read_at: string | null;
  is_read: boolean;
  created_at: string;
};

export type PaginatedNotifications = {
  count: number;
  next: string | null;
  previous: string | null;
  results: AppNotification[];
};

export type NotificationListParams = {
  page?: number;
  page_size?: number;
  status?: "all" | "read" | "unread";
  category?: string;
  search?: string;
};

function buildQuery(params: Record<string, string | number | undefined>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== "") {
      query.set(key, String(value));
    }
  }
  const qs = query.toString();
  return qs ? `?${qs}` : "";
}

export async function fetchNotifications(
  accessToken: string,
  params: NotificationListParams = {}
): Promise<PaginatedNotifications> {
  const qs = buildQuery({
    page: params.page,
    page_size: params.page_size,
    status: params.status,
    category: params.category,
    search: params.search,
  });
  return apiFetch<PaginatedNotifications>(`notifications/${qs}`, {
    method: "GET",
    accessToken,
  });
}

export async function fetchRecentNotifications(
  accessToken: string,
  limit = 5
): Promise<AppNotification[]> {
  return apiFetch<AppNotification[]>(`notifications/recent/?limit=${limit}`, {
    method: "GET",
    accessToken,
  });
}

export async function fetchUnreadCount(accessToken: string): Promise<number> {
  const data = await apiFetch<{ count: number }>("notifications/unread-count/", {
    method: "GET",
    accessToken,
  });
  return data.count;
}

export async function markNotificationRead(
  accessToken: string,
  id: string
): Promise<AppNotification> {
  return apiFetch<AppNotification>(`notifications/${id}/read/`, {
    method: "PATCH",
    accessToken,
  });
}

export async function markAllNotificationsRead(
  accessToken: string
): Promise<{ updated: number }> {
  return apiFetch<{ updated: number }>("notifications/mark-all-read/", {
    method: "POST",
    accessToken,
  });
}

export function notificationHref(notification: AppNotification): string | null {
  if (notification.related_entity_type === "booking" && notification.related_entity_id) {
    return `/account/bookings/${notification.related_entity_id}`;
  }
  if (notification.related_entity_type === "user") {
    return "/account/profile";
  }
  if (notification.related_entity_type === "donation") {
    return "/account/donor";
  }
  return null;
}

export const CATEGORY_FILTER_MAP = {
  all: undefined,
  coupon: "coupon",
  donation: "donation",
  system: "user,system",
} as const;

export type CategoryFilterKey = keyof typeof CATEGORY_FILTER_MAP;
