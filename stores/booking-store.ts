import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GuestCount, GuestDetails, Room } from "@/types";
import type { DonorTier } from "@/types";

/** Stay → Blessings (optional) → Seva → Pay → Done */
export type BookingStep = 1 | 2 | 3 | 4 | 5;

interface BookingState {
  isOpen: boolean;
  step: BookingStep;
  selectedRoom: Room | null;
  checkIn: Date | null;
  checkOut: Date | null;
  guestCount: GuestCount;
  roomCount: number;
  guestDetails: Partial<GuestDetails>;
  isDonorFlow: boolean;
  donorTier: DonorTier;
  donorDiscount: number;
  selectedCouponIds: string[];
  useCompensationWallet: boolean;
  walletAmountToUse: number;
  promoCode: string;
  promoDiscount: number;
  sevaDonation: number;
  whatsappConfirm: boolean;
  paymentMethod: string;
  bookingReference: string | null;
  pendingBookingId: string | null;
  pendingBookingReference: string | null;
  showToast: boolean;
  toastData: {
    hotelName: string;
    roomType: string;
    checkIn: string;
    whatsappSent?: boolean;
  } | null;
  isDraft: boolean;

  openBooking: (
    room: Room,
    checkIn?: Date,
    checkOut?: Date,
    guests?: Partial<GuestCount>
  ) => void;
  closeBooking: () => void;
  setStep: (step: BookingStep) => void;
  nextStep: () => void;
  prevStep: () => void;
  setDates: (checkIn: Date | null, checkOut: Date | null) => void;
  setGuestCount: (count: Partial<GuestCount>) => void;
  setRoomCount: (count: number) => void;
  setGuestDetails: (details: Partial<GuestDetails>) => void;
  setDonorSession: (tier: DonorTier, discount: number) => void;
  setSelectedCouponIds: (ids: string[]) => void;
  toggleCouponId: (id: string) => void;
  setUseCompensationWallet: (use: boolean) => void;
  setWalletAmountToUse: (amount: number) => void;
  setPromoCode: (code: string, discount: number) => void;
  setSevaDonation: (amount: number) => void;
  setWhatsappConfirm: (enabled: boolean) => void;
  setPaymentMethod: (method: string) => void;
  completeBooking: (reference: string) => void;
  setPendingBooking: (id: string, reference: string) => void;
  clearPendingBooking: () => void;
  resumePendingBooking: (
    bookingId: string,
    reference: string,
    room: Room,
    checkIn: Date,
    checkOut: Date,
    step?: BookingStep,
    couponIds?: string[]
  ) => void;
  dismissToast: () => void;
  reset: () => void;
}

const defaultGuestCount: GuestCount = { adults: 2, children: 0, rooms: 1 };

export const useBookingStore = create<BookingState>()(
  persist(
    (set, get) => ({
      isOpen: false,
      step: 1,
      selectedRoom: null,
      checkIn: null,
      checkOut: null,
      guestCount: defaultGuestCount,
      roomCount: 1,
      guestDetails: {},
      isDonorFlow: false,
      donorTier: null,
      donorDiscount: 0,
      selectedCouponIds: [],
      useCompensationWallet: false,
      walletAmountToUse: 0,
      promoCode: "",
      promoDiscount: 0,
      sevaDonation: 0,
      whatsappConfirm: true,
      paymentMethod: "cash",
      bookingReference: null,
      pendingBookingId: null,
      pendingBookingReference: null,
      showToast: false,
      toastData: null,
      isDraft: false,

      openBooking: (room, checkIn, checkOut, guests) => {
        const nextGuests = guests
          ? { ...get().guestCount, ...guests }
          : get().guestCount;
        set({
          isOpen: true,
          step: 1,
          selectedRoom: room,
          checkIn: checkIn ?? null,
          checkOut: checkOut ?? null,
          guestCount: nextGuests,
          roomCount: guests?.rooms ?? get().roomCount,
          bookingReference: null,
          pendingBookingId: null,
          pendingBookingReference: null,
          selectedCouponIds: [],
          sevaDonation: 0,
          isDraft: true,
        });
      },

      closeBooking: () => set({ isOpen: false }),

      setStep: (step) => set({ step, isDraft: step < 5 }),
      nextStep: () => set({ step: Math.min(5, get().step + 1) as BookingStep, isDraft: true }),
      prevStep: () => set({ step: Math.max(1, get().step - 1) as BookingStep, isDraft: true }),

      setDates: (checkIn, checkOut) => set({ checkIn, checkOut, isDraft: true }),
      setGuestCount: (count) =>
        set({ guestCount: { ...get().guestCount, ...count }, isDraft: true }),
      setRoomCount: (roomCount) => set({ roomCount, isDraft: true }),

      setGuestDetails: (details) =>
        set({ guestDetails: { ...get().guestDetails, ...details }, isDraft: true }),

      setDonorSession: (tier, discount) =>
        set({ isDonorFlow: true, donorTier: tier, donorDiscount: discount }),

      setSelectedCouponIds: (ids) => set({ selectedCouponIds: ids, isDraft: true }),

      toggleCouponId: (id) => {
        const current = get().selectedCouponIds;
        if (current.includes(id)) {
          set({ selectedCouponIds: current.filter((x) => x !== id), isDraft: true });
        } else {
          set({ selectedCouponIds: [...current, id], isDraft: true });
        }
      },

      setUseCompensationWallet: (use) => set({ useCompensationWallet: use, isDraft: true }),
      setWalletAmountToUse: (amount) => set({ walletAmountToUse: amount, isDraft: true }),

      setPromoCode: (code, discount) => set({ promoCode: code, promoDiscount: discount, isDraft: true }),
      setSevaDonation: (amount) => set({ sevaDonation: amount, isDraft: true }),
      setWhatsappConfirm: (enabled) => set({ whatsappConfirm: enabled, isDraft: true }),
      setPaymentMethod: (method) => set({ paymentMethod: method, isDraft: true }),

      setPendingBooking: (id, reference) =>
        set({
          pendingBookingId: id,
          pendingBookingReference: reference,
          isDraft: true,
        }),

      clearPendingBooking: () =>
        set({ pendingBookingId: null, pendingBookingReference: null }),

      resumePendingBooking: (bookingId, reference, room, checkIn, checkOut, step = 2, couponIds = []) =>
        set({
          isOpen: true,
          step,
          selectedRoom: room,
          checkIn,
          checkOut,
          pendingBookingId: bookingId,
          pendingBookingReference: reference,
          selectedCouponIds: couponIds,
          bookingReference: null,
          isDraft: true,
        }),

      completeBooking: (reference) => {
        const { selectedRoom, checkIn, whatsappConfirm } = get();
        set({
          bookingReference: reference,
          pendingBookingId: null,
          pendingBookingReference: null,
          step: 5,
          showToast: true,
          isDraft: false,
          toastData: selectedRoom
            ? {
                hotelName: selectedRoom.hotelName,
                roomType: selectedRoom.name,
                checkIn: checkIn?.toISOString() ?? new Date().toISOString(),
                whatsappSent: whatsappConfirm,
              }
            : null,
        });
      },

      dismissToast: () => set({ showToast: false, toastData: null }),

      reset: () =>
        set({
          isOpen: false,
          step: 1,
          selectedRoom: null,
          checkIn: null,
          checkOut: null,
          guestCount: defaultGuestCount,
          roomCount: 1,
          guestDetails: {},
          isDonorFlow: false,
          donorTier: null,
          donorDiscount: 0,
          selectedCouponIds: [],
          useCompensationWallet: false,
          walletAmountToUse: 0,
          promoCode: "",
          promoDiscount: 0,
          sevaDonation: 0,
          whatsappConfirm: true,
          bookingReference: null,
          pendingBookingId: null,
          pendingBookingReference: null,
          isDraft: false,
        }),
    }),
    {
      name: "vasavi-booking-draft",
      partialize: (state) => ({
        step: state.step === 5 ? 1 : state.step,
        selectedRoom: state.selectedRoom,
        checkIn: state.checkIn,
        checkOut: state.checkOut,
        guestCount: state.guestCount,
        roomCount: state.roomCount,
        guestDetails: state.guestDetails,
        selectedCouponIds: state.selectedCouponIds,
        useCompensationWallet: state.useCompensationWallet,
        walletAmountToUse: state.walletAmountToUse,
        sevaDonation: state.sevaDonation,
        whatsappConfirm: state.whatsappConfirm,
        paymentMethod: state.paymentMethod,
        pendingBookingId: state.pendingBookingId,
        pendingBookingReference: state.pendingBookingReference,
        isDraft: state.isDraft,
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          if (typeof state.checkIn === "string") {
            state.checkIn = new Date(state.checkIn);
          }
          if (typeof state.checkOut === "string") {
            state.checkOut = new Date(state.checkOut);
          }
        }
      },
    }
  )
);
