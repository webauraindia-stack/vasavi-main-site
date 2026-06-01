import { getPublicDonors, type PublicDonor } from "@/lib/api/donors";
import { type Page } from "@/lib/api/paginate";
import { DonorsDirectoryClient } from "../donors-directory-client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Donors Directory | Vasavi",
  description: "Honoring the remarkable individuals and organizations supporting our mission.",
};

export default async function DonorsDirectoryPage() {
  let initialData: Page<PublicDonor> = { count: 0, next: null, previous: null, results: [] };
  
  try {
    initialData = await getPublicDonors({ page: 1 });
  } catch (error) {
    console.error("Failed to fetch initial donors data:", error);
  }

  return <DonorsDirectoryClient initialData={initialData} />;
}
