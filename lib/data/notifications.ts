export type NotificationType = "booking" | "reminder" | "offer" | "system";

export interface AppNotification {
  id: string;
  type: NotificationType;
  titleKey: string;
  bodyKey: string;
  bodyParams?: Record<string, string>;
  href?: string;
  createdAt: string;
}

export const APP_NOTIFICATIONS: AppNotification[] = [
  {
    id: "n1",
    type: "booking",
    titleKey: "notifications.bookingConfirmedTitle",
    bodyKey: "notifications.bookingConfirmedBody",
    bodyParams: { ref: "VH-7K2M9P", hotel: "Sri Vasavi Nityannadana Residency" },
    href: "/account/bookings/bk-001",
    createdAt: "2026-05-19T09:15:00.000Z",
  },
  {
    id: "n2",
    type: "reminder",
    titleKey: "notifications.checkInReminderTitle",
    bodyKey: "notifications.checkInReminderBody",
    bodyParams: { date: "May 22, 2026", hotel: "Sri Vasavi Nityannadana Residency" },
    href: "/account/bookings/bk-001",
    createdAt: "2026-05-18T08:00:00.000Z",
  },
  {
    id: "n3",
    type: "booking",
    titleKey: "notifications.upcomingStayTitle",
    bodyKey: "notifications.upcomingStayBody",
    bodyParams: { ref: "VH-2F8K1Q", hotel: "Sri Venkateswara Pilgrim Stay" },
    href: "/account/bookings/b-upcoming",
    createdAt: "2026-05-17T14:30:00.000Z",
  },
  {
    id: "n4",
    type: "offer",
    titleKey: "notifications.donorOfferTitle",
    bodyKey: "notifications.donorOfferBody",
    href: "/account/donor",
    createdAt: "2026-05-15T11:00:00.000Z",
  },
  {
    id: "n5",
    type: "system",
    titleKey: "notifications.welcomeTitle",
    bodyKey: "notifications.welcomeBody",
    href: "/#hotels",
    createdAt: "2026-05-10T10:00:00.000Z",
  },
];
