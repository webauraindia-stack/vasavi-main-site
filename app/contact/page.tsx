import type { Metadata } from "next";
import { ContactPageContent } from "@/components/pages/contact-page-content";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Vasavi Hotels and Vasavi Clubs International.",
};

export default function ContactPage() {
  return <ContactPageContent />;
}
