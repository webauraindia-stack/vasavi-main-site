import type { Metadata } from "next";
import { PrivacyPageContent } from "@/components/pages/privacy-page-content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "HotelHub and Vasavi Hotels privacy policy.",
};

export default function PrivacyPage() {
  return <PrivacyPageContent />;
}
