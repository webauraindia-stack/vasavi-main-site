import type { Metadata } from "next";
import { TermsPageContent } from "@/components/pages/terms-page-content";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "HotelHub and Vasavi Hotels terms of service.",
};

export default function TermsPage() {
  return <TermsPageContent />;
}
