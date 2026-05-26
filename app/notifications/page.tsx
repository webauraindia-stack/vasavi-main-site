import type { Metadata } from "next";
import { NotificationsPageContent } from "@/components/pages/notifications-page-content";

export const metadata: Metadata = {
  title: "Notifications",
  description: "Booking updates, reminders, and offers from Vasavi Hotels.",
};

export default function NotificationsPage() {
  return <NotificationsPageContent />;
}
