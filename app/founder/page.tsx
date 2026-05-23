import type { Metadata } from "next";
import { FOUNDER } from "@/lib/data/vasavi-community";
import { FounderPageContent } from "@/components/pages/founder-page-content";

export const metadata: Metadata = {
  title: "Our Founder — K.C. Gupta",
  description:
    "Late Vn. Kalvakuntla Chandrasena Gupta (K.C. Gupta), Freedom Fighter and Founder of the Vasavi Movement. First Vasavi Club, Hyderabad, 1 October 1961.",
  openGraph: {
    title: "K.C. Gupta — Founder of the Vasavi Movement",
    description:
      "Freedom fighter, publisher, and founder of Vasavi Club Hyderabad in 1961.",
    images: [{ url: "/images/founder-kcg.jpg", alt: FOUNDER.fullName }],
  },
};

export default function FounderPage() {
  return <FounderPageContent />;
}
