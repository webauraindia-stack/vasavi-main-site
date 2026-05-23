import type { Metadata } from "next";
import { SchemesPageContent } from "@/components/pages/schemes-page-content";

export const metadata: Metadata = {
  title: "Community Schemes",
  description:
    "KCGF, VKSP, Vasavi Saraswathi Padhakam, Self Employment, Sreyobhilashi, and VKSP Senior — Vasavi Clubs International schemes supported through HotelHub.",
};

export default function SchemesPage() {
  return <SchemesPageContent />;
}
