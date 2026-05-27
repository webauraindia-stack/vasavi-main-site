"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Crown, Ticket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getTierInfo } from "@/lib/donor-engine";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import { useDonorStore } from "@/stores/donor-store";
import { formatCurrency } from "@/lib/utils";

export default function DonorBenefitsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const isDonor = Boolean((session?.user as { isDonor?: boolean })?.isDonor);
  const { isAuthenticated, withAccessToken } = useAuthenticatedSession();
  const donor = useDonorStore((s) => s.donor);
  const isLoading = useDonorStore((s) => s.isLoading);
  const hydrateFromApi = useDonorStore((s) => s.hydrateFromApi);

  useEffect(() => {
    if (status === "loading") return;
    if (session && !isDonor) {
      router.replace("/account/bookings");
    }
  }, [session, status, isDonor, router]);

  useEffect(() => {
    if (!isDonor || !isAuthenticated) return;
    void withAccessToken((token) => hydrateFromApi(token)).catch(() => {
      /* session refresh / sign-out handled globally */
    });
  }, [isDonor, isAuthenticated, hydrateFromApi, withAccessToken]);

  if (status === "loading" || (isDonor && isLoading)) {
    return <div className="text-muted">Loading donor benefits…</div>;
  }

  if (!isDonor) {
    return null;
  }

  if (!donor) {
    return (
      <div className="space-y-4 text-sm">
        <p className="text-muted">
          We could not load your donor profile. Please try again or open the full donor portal.
        </p>
        <Link href="/donor-portal">
          <Button variant="outline">Open donor portal</Button>
        </Link>
      </div>
    );
  }

  const tierInfo = donor.tier ? getTierInfo(donor.tier) : undefined;
  const displayTier = donor.membershipTierName ?? tierInfo?.name ?? "Member";
  const discountPercent = tierInfo?.discountPercent ?? donor.discountPercent;
  const benefits =
    tierInfo?.benefits ?? [
      `${discountPercent}% discount on eligible bookings`,
      "Access to donor coupon wallet",
      "Priority community benefits",
    ];

  const activeCoupons = donor.coupons.filter((c) => c.status === "available");

  return (
    <div>
      <h2 className="font-display text-xl text-charcoal mb-6 flex items-center gap-2">
        <Crown className="h-5 w-5 text-champagne" />
        Donor benefits
      </h2>

      <div className="card-surface rounded-xl p-6 border border-champagne/20 mb-6">
        <p className="text-sm text-muted mb-1">Membership</p>
        <p className="font-display text-3xl text-champagne capitalize mb-2">{displayTier}</p>
        <p className="text-charcoal/80 mb-2">
          {discountPercent > 0
            ? `${discountPercent}% discount on eligible bookings`
            : "Benefits based on your membership tier and active coupons"}
        </p>
        <p className="text-sm text-muted">
          Donor ID <span className="font-mono text-charcoal">{donor.donorId}</span>
          {donor.clubName ? ` · ${donor.clubName}` : ""}
        </p>
        <p className="mt-2 text-sm font-medium text-charcoal">
          Total contributed {formatCurrency(donor.totalDonation)}
        </p>
      </div>

      <h3 className="font-display text-lg text-charcoal mb-3">Included benefits</h3>
      <ul className="space-y-2 mb-8">
        {benefits.map((b) => (
          <li key={b} className="text-muted flex gap-2 text-sm">
            <span className="text-champagne">✦</span> {b}
          </li>
        ))}
      </ul>

      <h3 className="font-display text-lg text-charcoal mb-3 flex items-center gap-2">
        <Ticket className="h-5 w-5 text-champagne" />
        Active coupons ({activeCoupons.length})
      </h3>
      {activeCoupons.length === 0 ? (
        <p className="text-sm text-muted mb-8">No dispatched coupons in your wallet yet.</p>
      ) : (
        <ul className="space-y-3 mb-8">
          {activeCoupons.map((c) => (
            <li
              key={c.id}
              className="card-surface rounded-lg border border-beige/80 px-4 py-3 text-sm"
            >
              <p className="font-medium text-charcoal">{c.name}</p>
              <p className="text-xs text-muted mt-0.5 capitalize">
                {c.type.replace(/_/g, " ")} · {c.code}
              </p>
            </li>
          ))}
        </ul>
      )}

      <div className="flex flex-wrap gap-3">
        <Link href="/search?donorExclusive=true">
          <Button>Book donor room</Button>
        </Link>
        <Link href="/donor-portal">
          <Button variant="outline">Full donor portal</Button>
        </Link>
      </div>
    </div>
  );
}
