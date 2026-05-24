import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Donor, DonorTier, Coupon } from "@/types";
import {
  getDiscountPercent,
  getMonthlyQuota,
} from "@/lib/donor-engine";
import { fetchCouponWallet } from "@/lib/api/coupons";
import { mapCouponFromBackend, mapDonorFromBackend } from "@/lib/api/mappers";
import type { BackendDonorProfile } from "@/lib/api/mappers";

let hydrateInFlight: Promise<void> | null = null;

interface DonorState {
  isAuthenticated: boolean;
  donor: Donor | null;
  isLoading: boolean;
  celebration: {
    title: string;
    desc: string;
    type?: "donation" | "tier_up" | "coupon_earned" | "manual";
  } | null;

  logout: () => void;
  refreshDonor: () => void;
  redeemCoupons: (couponIds: string[]) => void;
  refundCoupons: (couponIds: string[]) => void;
  clearCelebration: () => void;
  hydrateFromApi: (accessToken: string) => Promise<void>;
}

export const useDonorStore = create<DonorState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      donor: null,
      isLoading: false,
      celebration: null,

      logout: () => set({ isAuthenticated: false, donor: null, celebration: null }),

      refreshDonor: () => {
        set((state) => {
          if (!state.donor) return state;
          const tier = state.donor.tier;
          return {
            donor: {
              ...state.donor,
              discountPercent: getDiscountPercent(tier),
              monthlyBookingQuota: getMonthlyQuota(tier),
            },
          };
        });
      },

      redeemCoupons: (couponIds) => {
        set((state) => {
          if (!state.donor) return state;
          const updatedCoupons = state.donor.coupons.map((c) => {
            if (couponIds.includes(c.id)) {
              return { ...c, status: "redeemed" as const, usedCount: c.usedCount + 1 };
            }
            return c;
          });

          let reducedCredits = state.donor.compensationCredits;
          couponIds.forEach((id) => {
            const coup = state.donor!.coupons.find((c) => c.id === id);
            if (coup && coup.type === "fixed_compensation") {
              reducedCredits = Math.max(0, reducedCredits - coup.value);
            }
          });

          return {
            donor: {
              ...state.donor,
              coupons: updatedCoupons,
              compensationCredits: reducedCredits,
            },
          };
        });
      },

      refundCoupons: (couponIds) => {
        set((state) => {
          if (!state.donor) return state;
          const updatedCoupons = state.donor.coupons.map((c) => {
            if (couponIds.includes(c.id)) {
              return {
                ...c,
                status: "available" as const,
                usedCount: Math.max(0, c.usedCount - 1),
              };
            }
            return c;
          });

          let restoredCredits = state.donor.compensationCredits;
          couponIds.forEach((id) => {
            const coup = state.donor!.coupons.find((c) => c.id === id);
            if (coup && coup.type === "fixed_compensation") {
              restoredCredits += coup.value;
            }
          });

          return {
            donor: {
              ...state.donor,
              coupons: updatedCoupons,
              compensationCredits: restoredCredits,
            },
          };
        });
      },

      clearCelebration: () => set({ celebration: null }),

      hydrateFromApi: async (accessToken: string) => {
        if (hydrateInFlight) {
          await hydrateInFlight;
          return;
        }

        hydrateInFlight = (async () => {
          set({ isLoading: true });
          try {
            const wallet = await fetchCouponWallet(accessToken);
            const coupons = wallet.available.map(mapCouponFromBackend);
            const meRes = await fetch("/api/backend/donors/me/", {
              headers: { Authorization: `Bearer ${accessToken}` },
              credentials: "include",
            });
            if (!meRes.ok) {
              set({ isAuthenticated: false, donor: null, isLoading: false });
              return;
            }
            const body = (await meRes.json()) as {
              success: boolean;
              data?: BackendDonorProfile;
            };
            if (body.success && body.data) {
              const donor = mapDonorFromBackend(body.data, coupons);
              const tier = donor.tier;
              set({
                isAuthenticated: true,
                donor: {
                  ...donor,
                  discountPercent: getDiscountPercent(tier),
                  monthlyBookingQuota: getMonthlyQuota(tier),
                },
                isLoading: false,
              });
            } else {
              set({ isAuthenticated: false, donor: null, isLoading: false });
            }
          } catch {
            set({ isAuthenticated: false, donor: null, isLoading: false });
          }
        })();

        try {
          await hydrateInFlight;
        } finally {
          hydrateInFlight = null;
        }
      },
    }),
    {
      name: "vasavi-donor-storage",
      /** Do not persist profile/coupons — always refetch from API on load. */
      partialize: (state) => ({
        celebration: state.celebration,
      }),
    }
  )
);
