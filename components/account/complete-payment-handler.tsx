"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { usePendingPaymentStore } from "@/stores/pending-payment-store";

/** Clears the global pending-payment banner when user lands from "Complete payment". */
export function CompletePaymentHandler() {
  const searchParams = useSearchParams();
  const clearPending = usePendingPaymentStore((s) => s.clearPending);

  useEffect(() => {
    if (searchParams.get("completePayment") === "1") {
      clearPending();
    }
  }, [searchParams, clearPending]);

  return null;
}
