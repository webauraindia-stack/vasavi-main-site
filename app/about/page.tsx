import type { Metadata } from "next";
import { AboutPageContent } from "@/components/pages/about-page-content";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Vasavi Hotels — spiritual hospitality united under Vasavi Clubs International since 1961.",
};

export default function AboutPage() {
  return <AboutPageContent />;
}
