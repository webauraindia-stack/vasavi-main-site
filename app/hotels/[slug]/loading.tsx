import { HotelDetailSkeleton } from "@/components/customer/skeletons";

export default function HotelLoading() {
  return (
    <div className="page-container pt-20 pb-16">
      <HotelDetailSkeleton />
    </div>
  );
}
