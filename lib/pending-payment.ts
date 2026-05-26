const STORAGE_KEY = "vasavi_pending_payment";

export interface PendingPayment {
  reference: string;
  amount: number;
  hotelName: string;
  hotelSlug: string;
  bookingId?: string;
  createdAt: string;
}

export function savePendingPayment(payment: PendingPayment) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(payment));
}

export function loadPendingPayment(): PendingPayment | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as PendingPayment;
  } catch {
    return null;
  }
}

export function clearPendingPaymentStorage() {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(STORAGE_KEY);
}
