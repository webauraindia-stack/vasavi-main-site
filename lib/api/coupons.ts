import { apiFetch } from "@/lib/api/client";
import type { BackendCoupon } from "@/lib/api/mappers";

export type CouponWallet = {
  available: BackendCoupon[];
  used: BackendCoupon[];
  dispatched: BackendCoupon[];
};

export async function fetchCouponWallet(accessToken: string): Promise<CouponWallet> {
  return apiFetch<CouponWallet>("coupons/wallet/", {
    method: "GET",
    accessToken,
  });
}
