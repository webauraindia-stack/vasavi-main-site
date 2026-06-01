import { getPublicDonors } from "@/lib/api/donors";
import { DonorsMarqueeClient } from "./donors-marquee-client";

export async function DonorsMarqueeSection() {
  const res = await getPublicDonors({ page: 1 });
  const donors = res.results ?? [];
  if (donors.length === 0) return null;
  return <DonorsMarqueeClient donors={donors} />;
}
