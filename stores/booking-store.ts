import { create } from "zustand";
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
  showToast: boolean;
  toastData: {
    hotelName: string;
    roomType: string;
    checkIn: string;
    whatsappSent?: boolean;
  } | null;

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
  dismissToast: () => void;
  reset: () => void;
}

const defaultGuestCount: GuestCount = { adults: 2, children: 0, rooms: 1 };

export const useBookingStore = create<BookingState>((set, get) => ({
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
  showToast: false,
  toastData: null,

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
      selectedCouponIds: [],
      sevaDonation: 0,
    });
  },

  closeBooking: () => set({ isOpen: false }),

  setStep: (step) => set({ step }),
  nextStep: () => set({ step: Math.min(5, get().step + 1) as BookingStep }),
  prevStep: () => set({ step: Math.max(1, get().step - 1) as BookingStep }),

  setDates: (checkIn, checkOut) => set({ checkIn, checkOut }),
  setGuestCount: (count) =>
    set({ guestCount: { ...get().guestCount, ...count } }),
  setRoomCount: (roomCount) => set({ roomCount }),

  setGuestDetails: (details) =>
    set({ guestDetails: { ...get().guestDetails, ...details } }),

  setDonorSession: (tier, discount) =>
    set({ isDonorFlow: true, donorTier: tier, donorDiscount: discount }),

  setSelectedCouponIds: (ids) => set({ selectedCouponIds: ids }),

  toggleCouponId: (id) => {
    const current = get().selectedCouponIds;
    if (current.includes(id)) {
      set({ selectedCouponIds: current.filter((x) => x !== id) });
    } else {
      set({ selectedCouponIds: [...current, id] });
    }
  },

  setUseCompensationWallet: (use) => set({ useCompensationWallet: use }),
  setWalletAmountToUse: (amount) => set({ walletAmountToUse: amount }),

  setPromoCode: (code, discount) => set({ promoCode: code, promoDiscount: discount }),
  setSevaDonation: (amount) => set({ sevaDonation: amount }),
  setWhatsappConfirm: (enabled) => set({ whatsappConfirm: enabled }),
  setPaymentMethod: (method) => set({ paymentMethod: method }),

  completeBooking: (reference) => {
    const { selectedRoom, checkIn, whatsappConfirm } = get();
    set({
      bookingReference: reference,
      step: 5,
      showToast: true,
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
    }),
}));
