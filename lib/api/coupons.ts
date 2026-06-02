import { apiFetch } from "@/lib/api/client";
import type { BackendCoupon } from "@/lib/api/mappers";

export type CouponStats = {
  total: number;
  issued: number;
  dispatched: number;
  available: number;
  used: number;
};

export type CouponWallet = {
  stats: CouponStats;
  available: BackendCoupon[];
  used: BackendCoupon[];
  issued: BackendCoupon[];
};

export async function fetchCouponWallet(accessToken: string): Promise<CouponWallet> {
  return apiFetch<CouponWallet>("coupons/wallet/", {
    method: "GET",
    accessToken,
  });
}
