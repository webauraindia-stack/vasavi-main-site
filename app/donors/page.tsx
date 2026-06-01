import type { Metadata } from "next";
import { DonorsPageContent } from "@/components/pages/donors-page-content";
import { DonorsMarqueeSection } from "@/components/customer/donors-marquee";

export const metadata: Metadata = {
  title: "Donor Program — KCGF & Community Schemes",
  description:
    "Support Vasavi community schemes (KCGF, VKSP, Sreyobhilashi) through HotelHub and unlock exclusive hotel stays and tiered discounts.",
};

export default function DonorsPage() {
  return (
    <>
      <DonorsPageContent />
      <DonorsMarqueeSection />
    </>
  );
}
