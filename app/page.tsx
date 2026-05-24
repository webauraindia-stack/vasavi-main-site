import { HeroSection } from "@/components/customer/hero-section";
import { FeaturesSection } from "@/components/customer/features-section";
import { TrustStats } from "@/components/customer/trust-stats";
import { HotelGrid } from "@/components/customer/hotel-grid";
import { PendingBookingsResume } from "@/components/customer/pending-bookings-resume";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PendingBookingsResume />
      <TrustStats />
      <HotelGrid />
      <FeaturesSection />
    </>
  );
}
