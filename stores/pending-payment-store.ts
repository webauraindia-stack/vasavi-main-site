import { create } from "zustand";
import {
  clearPendingPaymentStorage,
  loadPendingPayment,
  savePendingPayment,
  type PendingPayment,
} from "@/lib/pending-payment";

interface PendingPaymentState {
  payment: PendingPayment | null;
  hydrated: boolean;
  hydrate: () => void;
  setPending: (payment: Omit<PendingPayment, "createdAt">) => void;
  clearPending: () => void;
}

export const usePendingPaymentStore = create<PendingPaymentState>((set) => ({
  payment: null,
  hydrated: false,

  hydrate: () => {
    const payment = loadPendingPayment();
    set({ payment, hydrated: true });
  },

  setPending: (payment) => {
    const full: PendingPayment = {
      ...payment,
      createdAt: new Date().toISOString(),
    };
    savePendingPayment(full);
    set({ payment: full, hydrated: true });
  },

  clearPending: () => {
    clearPendingPaymentStorage();
    set({ payment: null, hydrated: true });
  },
}));
