import { getPublicDonors } from "@/lib/api/donors";
import { DonorsMarqueeClient } from "./donors-marquee-client";

export async function DonorsMarqueeSection() {
  try {
    // Fetch a subset of donors for the marquee (e.g., page 1)
    const res = await getPublicDonors({ page: 1 });
    const donors = res.results || [];

    if (donors.length === 0) return null;

    return <DonorsMarqueeClient donors={donors} />;
  } catch (error) {
    console.error("Failed to fetch donors for marquee:", error);
    return null;
  }
}
