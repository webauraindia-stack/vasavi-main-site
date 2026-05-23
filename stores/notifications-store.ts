"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { APP_NOTIFICATIONS, type AppNotification } from "@/lib/data/notifications";

interface NotificationsState {
  readIds: string[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  isRead: (id: string) => boolean;
  unreadCount: () => number;
  sorted: () => AppNotification[];
}

export const useNotificationsStore = create<NotificationsState>()(
  persist(
    (set, get) => ({
      readIds: [],
      markRead: (id) =>
        set((s) => ({
          readIds: s.readIds.includes(id) ? s.readIds : [...s.readIds, id],
        })),
      markAllRead: () =>
        set({ readIds: APP_NOTIFICATIONS.map((n) => n.id) }),
      isRead: (id) => get().readIds.includes(id),
      unreadCount: () =>
        APP_NOTIFICATIONS.filter((n) => !get().readIds.includes(n.id)).length,
      sorted: () =>
        [...APP_NOTIFICATIONS].sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        ),
    }),
    { name: "vasavi-notifications-read" }
  )
);
