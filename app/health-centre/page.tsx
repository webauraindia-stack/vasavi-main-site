import type { Metadata } from "next";
import { HealthCentrePageContent } from "@/components/pages/health-centre-page-content";

export const metadata: Metadata = {
  title: "Health Centre",
  description:
    "Vasavi Health Centre — submit wellness queries and find guest houses suited for restful pilgrimage stays.",
};

export default function HealthCentrePage() {
  return <HealthCentrePageContent />;
}
