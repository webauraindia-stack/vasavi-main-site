"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  fetchNotifications,
  fetchRecentNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationListParams,
} from "@/lib/api/notifications";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";

const NOTIFICATIONS_KEY = "notifications";

export function useUnreadCount() {
  const { isAuthenticated, accessToken, withAccessToken } = useAuthenticatedSession();

  return useQuery({
    queryKey: [NOTIFICATIONS_KEY, "unread-count", accessToken],
    queryFn: () => withAccessToken((token) => fetchUnreadCount(token)),
    enabled: isAuthenticated,
    refetchInterval: 60_000,
    refetchOnWindowFocus: true,
  });
}

export function useRecentNotifications(limit = 5) {
  const { isAuthenticated, accessToken, withAccessToken } = useAuthenticatedSession();

  return useQuery({
    queryKey: [NOTIFICATIONS_KEY, "recent", accessToken, limit],
    queryFn: () => withAccessToken((token) => fetchRecentNotifications(token, limit)),
    enabled: isAuthenticated,
    refetchOnWindowFocus: true,
  });
}

export function useNotificationsList(params: NotificationListParams) {
  const { isAuthenticated, accessToken, withAccessToken } = useAuthenticatedSession();

  return useQuery({
    queryKey: [NOTIFICATIONS_KEY, "list", accessToken, params],
    queryFn: () => withAccessToken((token) => fetchNotifications(token, params)),
    enabled: isAuthenticated,
    placeholderData: (previous) => previous,
  });
}

function invalidateNotifications(queryClient: ReturnType<typeof useQueryClient>) {
  return queryClient.invalidateQueries({ queryKey: [NOTIFICATIONS_KEY] });
}

export function useMarkRead() {
  const queryClient = useQueryClient();
  const { withAccessToken } = useAuthenticatedSession();

  return useMutation({
    mutationFn: (id: string) => withAccessToken((token) => markNotificationRead(token, id)),
    onSuccess: () => invalidateNotifications(queryClient),
  });
}

export function useMarkAllRead() {
  const queryClient = useQueryClient();
  const { withAccessToken } = useAuthenticatedSession();

  return useMutation({
    mutationFn: () => withAccessToken((token) => markAllNotificationsRead(token)),
    onSuccess: () => invalidateNotifications(queryClient),
  });
}
