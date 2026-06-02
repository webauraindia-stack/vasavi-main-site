"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";
import { useSession } from "next-auth/react";
import { useAuthenticatedSession } from "@/lib/hooks/use-authenticated-session";
import { isSessionExpiredError } from "@/lib/auth/session-expired";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Banknote,
  User,
  Calendar,
  Check,
  X,
  Sparkles,
  MessageCircle,
  Loader2,
  HeartHandshake,
  Wand2,
} from "lucide-react";
import { DayPicker, type DateRange } from "react-day-picker";
import { normalizeRangeSelection, todayStart } from "@/lib/date-range-selection";
import { Button } from "@/components/ui/button";
import { LoadingOverlay } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useBookingStore } from "@/stores/booking-store";
import { useDonorStore } from "@/stores/donor-store";
import { useBodyScrollLock } from "@/lib/use-body-scroll-lock";
import { formatCurrency, formatDate, calculateNights, cn } from "@/lib/utils";
import {
  calculateBookingPricing,
  getBenefitWalletSummary,
  canStackCoupon,
} from "@/lib/booking-benefits";
import { validateCoupon, suggestBestCoupons } from "@/lib/donor-engine";
import { formatPhoneDisplay } from "@/lib/auth/phone";
import { formatLocalDateString } from "@/lib/date-format";
import { useQueryClient } from "@tanstack/react-query";
import { getRoomImageUrl } from "@/lib/images/room-image";
import { isUuid } from "@/lib/hotels/catalog";
import { GuestCountFields } from "@/components/booking/guest-count-fields";
import { BookingStepper } from "@/components/booking/booking-stepper";
import { BenefitWalletSummaryPanel } from "@/components/booking/benefit-wallet-summary";
import { BenefitCouponCard } from "@/components/booking/benefit-coupon-card";
import { PaymentBreakdownPanel } from "@/components/booking/payment-breakdown-panel";
import "react-day-picker/style.css";

const SEVA_AMOUNTS = [0, 101, 501, 1001, 2501];

export function BookingModal() {
  const { data: session } = useSession();
  const { isAuthenticated: hasValidSession, withAccessToken } = useAuthenticatedSession();
  const {
    isOpen,
    step,
    bookingTarget,
    selectedRoom,
    checkIn,
    checkOut,
    guestCount,
    roomCount,
    selectedCouponIds,
    useCompensationWallet,
    walletAmountToUse,
    promoDiscount,
    sevaDonation,
    whatsappConfirm,
    paymentMethod,
    bookingReference,
    pendingBookingId,
    closeBooking,
    nextStep,
    prevStep,
    setDates,
    setGuestCount,
    setDonorSession,
    setSelectedCouponIds,
    setUseCompensationWallet,
    setWalletAmountToUse,
    setSevaDonation,
    setWhatsappConfirm,
    setPaymentMethod,
    completeBooking,
    setPendingBooking,
    clearPendingBooking,
    reset,
  } = useBookingStore();

  const queryClient = useQueryClient();

  const { donor, isAuthenticated } = useDonorStore();

  const [pickerRange, setPickerRange] = useState<DateRange | undefined>();
  const [suggestionMessage, setSuggestionMessage] = useState("");
  const [autoSuggested, setAutoSuggested] = useState(false);
  const [payError, setPayError] = useState("");
  const [payLoading, setPayLoading] = useState(false);
  const [continueLoading, setContinueLoading] = useState(false);
  const [continueError, setContinueError] = useState("");

  useBodyScrollLock(isOpen);

  const isDonorUser = Boolean((session?.user as { isDonor?: boolean })?.isDonor);
  const activeDonor = isDonorUser ? donor : null;
  const isDonorFlow = isDonorUser && !!activeDonor;
  const guestDisplayName = session?.user?.name ?? "Guest";
  const guestDisplayPhone = (session?.user as { phone?: string })?.phone;

  const nights =
    checkIn && checkOut && selectedRoom ? calculateNights(checkIn, checkOut) : 1;

  const pricing = useMemo(() => {
    if (!selectedRoom) return null;
    const walletMax = activeDonor?.compensationCredits ?? 0;
    const walletUse = useCompensationWallet
      ? Math.min(walletAmountToUse || walletMax, walletMax)
      : 0;

    return calculateBookingPricing({
      nightlyRate: selectedRoom.pricePerNight,
      nights,
      roomCount,
      tier: activeDonor?.tier ?? null,
      coupons: activeDonor?.coupons ?? [],
      selectedCouponIds,
      compensationWallet: walletMax,
      useWalletAmount: walletUse,
      promoDiscount,
      sevaDonation,
    });
  }, [
    selectedRoom,
    nights,
    roomCount,
    activeDonor,
    selectedCouponIds,
    useCompensationWallet,
    walletAmountToUse,
    promoDiscount,
    sevaDonation,
  ]);

  const walletSummary = useMemo(
    () => getBenefitWalletSummary(activeDonor ?? null),
    [activeDonor]
  );

  const afterTierSubtotal = pricing
    ? pricing.subtotal - pricing.tierDiscount
    : 0;

  const handleBookingDateSelect = useCallback(
    (selected: DateRange | undefined) => {
      const { range, complete } = normalizeRangeSelection(selected);
      setPickerRange(range);
      if (complete && range?.from && range?.to) {
        setDates(range.from, range.to);
      }
    },
    [setDates]
  );

  useEffect(() => {
    if (!isOpen) {
      setPickerRange(undefined);
      setSuggestionMessage("");
      setAutoSuggested(false);
      setPayError("");
      setPayLoading(false);
      setContinueError("");
      setContinueLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    const tier = (session?.user as { tier?: string })?.tier;
    if (isDonorUser && tier) {
      const discountMap: Record<string, number> = {
        bronze: 10,
        silver: 20,
        gold: 30,
        platinum: 50,
        elite: 75,
      };
      setDonorSession(tier as never, discountMap[tier] ?? 0);
    }
  }, [session, isDonorUser, setDonorSession]);

  useEffect(() => {
    if (step === 2 && isDonorFlow && activeDonor && !autoSuggested) {
      const suggestion = suggestBestCoupons(
        activeDonor.coupons.filter((c) => c.status === "available"),
        afterTierSubtotal
      );
      setSelectedCouponIds(suggestion.selectedIds);
      setSuggestionMessage(suggestion.message);
      setAutoSuggested(true);
    }
  }, [step, isDonorFlow, activeDonor, afterTierSubtotal, autoSuggested, setSelectedCouponIds]);

  if (!selectedRoom || !pricing) return null;

  const toggleCoupon = (id: string) => {
    if (!activeDonor) return;
    const coupon = activeDonor.coupons.find((c) => c.id === id);
    if (!coupon) return;
    const validation = validateCoupon(coupon, afterTierSubtotal);
    if (!validation.valid && !selectedCouponIds.includes(id)) return;

    if (coupon.type === "free_booking") {
      setSelectedCouponIds(selectedCouponIds.includes(id) ? [] : [id]);
    } else {
      if (selectedCouponIds.includes(id)) {
        setSelectedCouponIds(selectedCouponIds.filter((cid) => cid !== id));
      } else if (canStackCoupon(selectedCouponIds, coupon, activeDonor.coupons)) {
        const withoutFree = selectedCouponIds.filter(
          (cid) => activeDonor.coupons.find((c) => c.id === cid)?.type !== "free_booking"
        );
        setSelectedCouponIds([...withoutFree, id]);
      }
    }
    setSuggestionMessage("");
  };

  const handleContinueFromStay = async () => {
    setContinueError("");
    if (!checkIn || !checkOut) {
      setContinueError("Select check-in and check-out dates.");
      return;
    }
    if (!hasValidSession) {
      setContinueError("Please sign in to continue your booking.");
      return;
    }
    if (!isUuid(selectedRoom.id)) {
      setContinueError(
        bookingTarget === "function_hall"
          ? "Invalid hall. Please search again and select an available function hall."
          : "Invalid room. Please search again and select an available room."
      );
      return;
    }

    const checkInStr = formatLocalDateString(checkIn);
    const checkOutStr = formatLocalDateString(checkOut);

    setContinueLoading(true);
    try {
      await withAccessToken(async (accessToken) => {
        const { createBooking, getBooking, cancelBooking } = await import("@/lib/api/bookings");

        if (pendingBookingId) {
          const existing = await getBooking(accessToken, pendingBookingId);
          const sameResource =
            bookingTarget === "function_hall"
              ? existing.function_hall?.id === selectedRoom.id
              : existing.room?.id === selectedRoom.id;
          const sameDates =
            existing.check_in_date === checkInStr &&
            existing.check_out_date === checkOutStr;
          if (existing.status === "pending" && sameResource && sameDates) {
            nextStep();
            return;
          }
          await cancelBooking(
            accessToken,
            pendingBookingId,
            "Replaced by a new reservation"
          );
          clearPendingBooking();
        }

        const totalGuests = guestCount.adults + guestCount.children;
        const cappedTotal =
          bookingTarget === "function_hall"
            ? Math.max(1, Math.min(selectedRoom.maxOccupancy, totalGuests))
            : totalGuests;

        const booking = await createBooking(accessToken, {
          ...(bookingTarget === "function_hall"
            ? { function_hall_id: selectedRoom.id }
            : { room_id: selectedRoom.id }),
          check_in_date: checkInStr,
          check_out_date: checkOutStr,
          adults: guestCount.adults,
          children: guestCount.children,
          guest_count: cappedTotal,
        });

        setPendingBooking(booking.id, booking.booking_reference);
        await queryClient.invalidateQueries({ queryKey: ["pending-bookings"] });
        nextStep();
      });
    } catch (err) {
      if (isSessionExpiredError(err)) {
        setContinueError(err.message);
        return;
      }
      const message =
        err instanceof Error ? err.message : "Could not save your reservation. Try again.";
      setContinueError(message);
    } finally {
      setContinueLoading(false);
    }
  };

  const handlePayment = async () => {
    setPayError("");
    if (!hasValidSession) {
      setPayError("Please sign in to complete your booking.");
      return;
    }
    if (!pendingBookingId) {
      setPayError("Your reservation hold was lost. Go back to Stay and tap Continue again.");
      return;
    }
    if (!isUuid(pendingBookingId)) {
      setPayError("Invalid booking session. Please start again from step 1.");
      return;
    }

    const couponIds = selectedCouponIds.filter(isUuid);

    setPayLoading(true);
    try {
      await withAccessToken(async (accessToken) => {
        const { confirmGuestBooking } = await import("@/lib/api/bookings");
        const confirmed = await confirmGuestBooking(accessToken, pendingBookingId, {
          coupon_ids: couponIds.length ? couponIds : undefined,
        });
        clearPendingBooking();
        await queryClient.invalidateQueries({ queryKey: ["pending-bookings"] });
        await queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
        completeBooking(confirmed.booking_reference);
      });
    } catch (err) {
      if (isSessionExpiredError(err)) {
        setPayError(err.message);
        return;
      }
      const message =
        err instanceof Error ? err.message : "Could not create booking. Try again.";
      setPayError(message);
    } finally {
      setPayLoading(false);
    }
  };

  const handleClose = () => {
    closeBooking();
    if (step === 5) setTimeout(reset, 300);
  };

  const availableCoupons =
    activeDonor?.coupons.filter((c) => c.status === "available") ?? [];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-55 bg-charcoal/45 backdrop-blur-xs"
            onClick={handleClose}
          />

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={cn(
              "fixed z-55 bg-white text-charcoal flex flex-col shadow-warm-lg",
              "inset-x-0 bottom-0 top-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2",
              "md:w-full md:max-w-[680px] md:max-h-[94vh] md:rounded-3xl border border-beige/40"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="booking-title"
          >
            <div className="flex justify-center pt-3 pb-1 md:hidden shrink-0">
              <motion.div className="w-10 h-1 rounded-full bg-beige" />
            </div>

            <div className="relative shrink-0 px-5 pt-4 pb-2 border-b border-beige/30 bg-gradient-to-b from-surface/80 to-white">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2
                    id="booking-title"
                    className="font-display text-lg md:text-xl font-bold text-charcoal tracking-tight truncate"
                  >
                    {step === 5 ? "Blessed journey confirmed" : `Reserve ${selectedRoom.name}`}
                  </h2>
                  <p className="text-xs text-muted font-semibold truncate">
                    {selectedRoom.hotelName}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 rounded-full hover:bg-surface transition-colors shrink-0"
                  aria-label="Close booking"
                >
                  <X className="h-5 w-5 text-muted" />
                </button>
              </div>
              {step < 5 && <BookingStepper step={step} />}
            </div>

            <div className="relative flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
              <LoadingOverlay
                show={continueLoading || payLoading}
                label={
                  payLoading
                    ? "Confirming your booking…"
                    : "Saving your reservation…"
                }
              />
              {/* STEP 1 — Stay review */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="relative h-28 rounded-xl overflow-hidden">
                    <Image
                      src={getRoomImageUrl(selectedRoom)}
                      alt={selectedRoom.name}
                      fill
                      className="object-cover"
                      sizes="680px"
                    />
                    <motion.div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                    <motion.p className="absolute bottom-3 left-3 text-white font-display font-bold text-sm">
                      {selectedRoom.category} · {selectedRoom.bedType}
                    </motion.p>
                  </div>

                  <div className="card-surface p-4 space-y-3 text-sm">
                    <Row label="Retreat" value={selectedRoom.name} />
                    <Row
                      label="Stay dates"
                      value={
                        checkIn && checkOut
                          ? `${formatDate(checkIn)} – ${formatDate(checkOut)}`
                          : "Select below"
                      }
                      mono
                    />
                    {(!checkIn || !checkOut) && (
                      <DayPicker
                        mode="range"
                        selected={
                          pickerRange ?? {
                            from: checkIn ?? undefined,
                            to: checkOut ?? undefined,
                          }
                        }
                        onSelect={handleBookingDateSelect}
                        disabled={{ before: todayStart() }}
                        className="mx-auto rdp-root border border-beige/50 rounded-xl bg-white p-3"
                      />
                    )}
                    {checkIn && checkOut && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="rounded-xl bg-champagne/5 border border-champagne/20 px-3 py-2 text-center space-y-3"
                      >
                        <div>
                          <p className="text-xs text-muted font-semibold uppercase tracking-wider">
                            Stay duration
                          </p>
                          <p className="font-display font-bold text-champagne text-lg">
                            {nights} {nights === 1 ? "night" : "nights"} · {roomCount}{" "}
                            {roomCount === 1 ? "room" : "rooms"}
                          </p>
                        </div>
                        <GuestCountFields
                          value={guestCount}
                          onChange={(partial) => setGuestCount(partial)}
                          maxTotal={
                            selectedRoom
                              ? Math.max(1, selectedRoom.maxOccupancy)
                              : 20
                          }
                        />
                      </motion.div>
                    )}
                    <div className="border-t border-beige/40 pt-2 flex justify-between font-bold">
                      <span>Estimated subtotal</span>
                      <span className="font-mono text-champagne-dark">
                        {formatCurrency(pricing.subtotal)}
                      </span>
                    </div>
                  </div>

                  {session?.user ? (
                    <div className="rounded-xl border border-champagne/20 bg-champagne/5 px-4 py-3 text-sm">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted mb-1">
                        Booking as
                      </p>
                      <p className="font-semibold text-charcoal">{guestDisplayName}</p>
                      {guestDisplayPhone && (
                        <p className="text-muted text-xs mt-0.5">
                          {formatPhoneDisplay(guestDisplayPhone)} · WhatsApp confirmation
                        </p>
                      )}
                      <p className="text-[11px] text-muted mt-2">
                        Guest details are taken from your signed-in account — no extra form needed.
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <Link href="/login" className="font-bold underline">
                        Sign in
                      </Link>{" "}
                      to hold your dates and continue checkout.
                    </p>
                  )}

                  {continueError && (
                    <p className="text-sm text-red-600">{continueError}</p>
                  )}
                  <NavButtons
                    onBack={handleClose}
                    backLabel="Cancel"
                    onNext={() => void handleContinueFromStay()}
                    nextDisabled={
                      !checkIn || !checkOut || continueLoading || !hasValidSession
                    }
                    nextLoading={continueLoading}
                    nextLabel="Continue"
                    nextLoadingText="Saving…"
                  />
                </div>
              )}

              {/* STEP 2 — Blessings & coupons (donor wallet from API) */}
              {step === 2 && (
                <div className="space-y-4">
                  {isDonorFlow && activeDonor ? (
                    <>
                      <BenefitWalletSummaryPanel
                        summary={walletSummary}
                        memberName={activeDonor.name}
                        tierLabel={
                          (session?.user as { categoryLabel?: string })?.categoryLabel ??
                          activeDonor.tier ??
                          "Donor"
                        }
                      />

                      {suggestionMessage && (
                        <motion.div
                          initial={{ opacity: 0, y: -4 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-bold"
                        >
                          <Wand2 className="h-4 w-4 shrink-0 text-emerald-600" />
                          {suggestionMessage}
                        </motion.div>
                      )}

                      <div className="flex justify-between items-center">
                        <Label className="text-xs font-bold uppercase tracking-wider text-muted">
                          Apply community blessings
                        </Label>
                        {selectedCouponIds.length > 0 && (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCouponIds([]);
                              setSuggestionMessage("");
                            }}
                            className="text-[10px] font-bold text-rose-700"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="space-y-2 max-h-[240px] overflow-y-auto pr-1">
                        {availableCoupons.length === 0 ? (
                          <p className="text-center py-8 text-muted text-sm border border-dashed border-beige rounded-xl">
                            No coupons in wallet. Visit{" "}
                            <a href="/donors" className="text-champagne font-bold">
                              Community Givers
                            </a>{" "}
                            to earn blessings.
                          </p>
                        ) : (
                          availableCoupons.map((coupon) => {
                            const validation = validateCoupon(coupon, afterTierSubtotal);
                            const canSelect =
                              validation.valid ||
                              selectedCouponIds.includes(coupon.id);
                            return (
                              <BenefitCouponCard
                                key={coupon.id}
                                coupon={coupon}
                                isSelected={selectedCouponIds.includes(coupon.id)}
                                isDisabled={!canSelect}
                                disabledReason={validation.reason}
                                onToggle={() => toggleCoupon(coupon.id)}
                              />
                            );
                          })
                        )}
                      </div>

                      {(activeDonor.compensationCredits ?? 0) > 0 && (
                        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/40 p-3 space-y-2">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id="use-wallet"
                              checked={useCompensationWallet}
                              onCheckedChange={(c) => {
                                const on = c === true;
                                setUseCompensationWallet(on);
                                if (on) {
                                  setWalletAmountToUse(
                                    Math.min(
                                      activeDonor.compensationCredits,
                                      pricing.taxableBase + pricing.couponDiscount
                                    )
                                  );
                                }
                              }}
                            />
                            <label htmlFor="use-wallet" className="text-sm font-bold text-charcoal cursor-pointer">
                              Apply compensation wallet (
                              {formatCurrency(activeDonor.compensationCredits)} available)
                            </label>
                          </div>
                        </div>
                      )}

                      <PaymentBreakdownPanel pricing={pricing} />

                      <NavButtons
                        onBack={prevStep}
                        onNext={pricing.isFullyCovered && pricing.sevaDonation === 0 ? undefined : nextStep}
                        onNextClick={
                          pricing.isFullyCovered && pricing.sevaDonation === 0
                            ? () => void handlePayment()
                            : undefined
                        }
                        nextLoading={
                          pricing.isFullyCovered && pricing.sevaDonation === 0
                            ? payLoading
                            : false
                        }
                        nextDisabled={
                          pricing.isFullyCovered && pricing.sevaDonation === 0
                            ? payLoading || !hasValidSession
                            : false
                        }
                        nextLabel={
                          pricing.isFullyCovered && pricing.sevaDonation === 0
                            ? "Confirm blessed stay"
                            : "Continue"
                        }
                        nextLoadingText="Confirming…"
                      />
                    </>
                  ) : (
                    <>
                      <div className="text-center py-10 card-surface">
                        <Sparkles className="h-10 w-10 mx-auto text-champagne/40 mb-3" />
                        <p className="font-display font-bold text-charcoal">
                          Community rewards await
                        </p>
                        <p className="text-sm text-muted max-w-sm mx-auto mt-2">
                          Sign in with a donor account to apply free stays and wallet coupons from
                          your profile.
                        </p>
                      </div>
                      <PaymentBreakdownPanel pricing={pricing} />
                      <NavButtons onBack={prevStep} onNext={nextStep} />
                    </>
                  )}
                </div>
              )}

              {/* STEP 3 — Seva donation */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-beige/50 bg-gradient-to-br from-amber-50/50 to-surface p-4">
                    <HeartHandshake className="h-8 w-8 text-champagne mb-2" />
                    <p className="font-display font-bold text-charcoal">
                      Optional seva — strengthen KCGF
                    </p>
                    <p className="text-sm text-muted mt-1 leading-relaxed">
                      Add a devotional contribution to the K.C. Gupta Fellow corpus. Your seva
                      compounds community education while earning reward points.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                    {SEVA_AMOUNTS.map((amt) => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setSevaDonation(amt)}
                        className={cn(
                          "py-2.5 rounded-xl border font-bold text-sm transition-all",
                          sevaDonation === amt
                            ? "border-champagne-dark bg-champagne/10 text-champagne"
                            : "border-beige hover:border-champagne/30"
                        )}
                      >
                        {amt === 0 ? "None" : `₹${amt}`}
                      </button>
                    ))}
                  </div>

                  <PaymentBreakdownPanel pricing={pricing} />
                  <NavButtons onBack={prevStep} onNext={nextStep} />
                </div>
              )}

              {/* STEP 4 — Payment */}
              {step === 4 && (
                <div className="space-y-4">
                  {!hasValidSession && (
                    <p className="text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2">
                      <Link href="/login" className="font-bold underline">
                        Sign in
                      </Link>{" "}
                      to complete payment. Guest name and phone are taken from your account
                      automatically.
                    </p>
                  )}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-muted">
                        Payment
                      </p>
                      <button
                        type="button"
                        onClick={() => setPaymentMethod("cash")}
                        className={cn(
                          "w-full flex items-center gap-3 p-3.5 rounded-xl border font-bold text-sm",
                          paymentMethod === "cash"
                            ? "border-champagne-dark bg-champagne/5 text-charcoal"
                            : "border-beige hover:border-champagne/30"
                        )}
                      >
                        <Banknote className="h-4 w-4 text-champagne" />
                        Pay at property (Cash)
                      </button>
                      <p className="text-[11px] text-muted leading-relaxed px-1">
                        Your reservation is confirmed immediately. Settle the amount in cash at
                        temple-town reception on arrival.
                      </p>

                      <div className="flex items-center gap-2 pt-2">
                        <Checkbox
                          id="whatsapp"
                          checked={whatsappConfirm}
                          onCheckedChange={(c) => setWhatsappConfirm(c === true)}
                        />
                        <label
                          htmlFor="whatsapp"
                          className="text-sm font-semibold flex items-center gap-1.5 cursor-pointer"
                        >
                          <MessageCircle className="h-4 w-4 text-emerald-600" />
                          Send WhatsApp confirmation
                        </label>
                      </div>
                    </div>

                    <PaymentBreakdownPanel pricing={pricing} />
                  </div>

                  {payError && (
                    <p className="text-sm text-red-600 mb-3">{payError}</p>
                  )}
                  <NavButtons
                    onBack={prevStep}
                    onNext={() => void handlePayment()}
                    nextDisabled={payLoading || !hasValidSession}
                    nextLoading={payLoading}
                    nextLabel={
                      pricing.total > 0
                        ? `Confirm · ${formatCurrency(pricing.total)} cash`
                        : "Confirm booking"
                    }
                    nextLoadingText="Confirming…"
                    nextIcon={<Banknote className="h-4 w-4" />}
                  />
                </div>
              )}

              {/* STEP 5 — Confirmation & gratitude */}
              {step === 5 && bookingReference && (
                <div className="text-center space-y-5 py-2">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="inline-flex w-18 h-18 items-center justify-center rounded-full bg-emerald-50 border-2 border-emerald-200 text-emerald-700"
                  >
                    <Check className="h-8 w-8" />
                  </motion.div>

                  <div>
                    <h3 className="font-display text-2xl font-bold text-charcoal">
                      {pricing.isFullyCovered ? "Blessed stay confirmed" : "Reservation confirmed"}
                    </h3>
                    <p className="text-sm text-muted mt-2 max-w-md mx-auto leading-relaxed">
                      Your pilgrimage shelter at {selectedRoom.hotelName} is reserved with
                      Vasavi community blessings. May your journey be peaceful and fulfilling.
                    </p>
                  </div>

                  {isDonorFlow && activeDonor && (
                    <div className="card-surface p-4 max-w-sm mx-auto text-left text-sm">
                      <p className="font-display font-bold text-charcoal">{activeDonor.name}</p>
                      <p className="text-muted text-xs mt-1">
                        Donor {activeDonor.donorId} · {activeDonor.tier} tier
                        {activeDonor.clubName ? ` · ${activeDonor.clubName}` : ""}
                      </p>
                    </div>
                  )}

                  <div className="card-surface p-4 max-w-sm mx-auto text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted">Reference</span>
                      <span className="font-mono font-bold">{bookingReference}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Check-in</span>
                      <span className="font-semibold">
                        {checkIn ? formatDate(checkIn) : "—"}
                      </span>
                    </div>
                    {pricing.couponDiscount + pricing.tierDiscount + pricing.walletApplied > 0 && (
                      <motion.div className="flex justify-between text-emerald-700 font-bold">
                        <span>Community savings</span>
                        <span className="font-mono">
                          {formatCurrency(
                            pricing.couponDiscount + pricing.tierDiscount + pricing.walletApplied
                          )}
                        </span>
                      </motion.div>
                    )}
                  </div>

                  <div className="bg-white rounded-2xl border border-beige/50 p-4 inline-block">
                    <QRCodeSVG
                      value={`https://vasavihotels.com/checkin/${bookingReference}`}
                      size={168}
                      level="M"
                      className="mx-auto"
                    />
                    <p className="text-[11px] text-muted mt-2 max-w-[200px] mx-auto">
                      Express QR check-in at temple reception — contactless & warm welcome
                    </p>
                  </div>

                  {whatsappConfirm && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex items-center justify-center gap-2 text-sm text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200/60 rounded-xl py-2.5 px-4 max-w-sm mx-auto"
                    >
                      <MessageCircle className="h-4 w-4" />
                      WhatsApp confirmation sent to{" "}
                      {guestDisplayPhone
                        ? formatPhoneDisplay(guestDisplayPhone)
                        : "your number"}
                    </motion.div>
                  )}

                  <div className="rounded-2xl bg-gradient-to-r from-champagne/10 via-amber-50/50 to-surface border border-champagne/20 p-4 max-w-md mx-auto">
                    <p className="font-display text-sm font-bold text-champagne italic">
                      &ldquo;In service to community, we find the divine.&rdquo;
                    </p>
                    <p className="text-[11px] text-muted mt-1">
                      — Vasavi Clubs International · Est. 1961, Hyderabad
                    </p>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleClose}
                      className="flex-1 h-12 bg-champagne hover:bg-champagne/90 text-white font-bold rounded-xl"
                    >
                      Done
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1 h-12 rounded-xl font-bold border-beige"
                      asChild
                    >
                      <Link href="/account/bookings">My bookings</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function Row({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex justify-between items-center gap-2">
      <span className="text-muted font-medium">{label}</span>
      <span className={cn("font-bold text-charcoal", mono && "font-mono text-sm")}>
        {value}
      </span>
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label className="text-xs font-bold text-muted">{label}</Label>
      <div className="mt-1">{children}</div>
      {error && <p className="text-[10px] text-rose-700 mt-1 font-semibold">{error}</p>}
    </div>
  );
}

function NavButtons({
  onBack,
  backLabel = "Back",
  onNext,
  onNextClick,
  nextLabel = "Continue",
  nextLoadingText = "Please wait…",
  nextDisabled,
  nextLoading,
  submit,
  nextIcon,
}: {
  onBack: () => void;
  backLabel?: string;
  onNext?: () => void;
  onNextClick?: () => void;
  nextLabel?: string;
  nextLoadingText?: string;
  nextDisabled?: boolean;
  nextLoading?: boolean;
  submit?: boolean;
  nextIcon?: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-2 pt-4 border-t border-beige/40">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={nextLoading}
        className="h-11 rounded-xl"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        {backLabel}
      </Button>
      <Button
        type={submit ? "submit" : "button"}
        onClick={onNextClick ?? onNext}
        disabled={nextDisabled}
        loading={nextLoading}
        loadingText={nextLoadingText}
        className="h-11 rounded-xl bg-champagne hover:bg-champagne/90 text-white font-bold"
      >
        {!nextLoading && (
          <>
            {nextLabel}
            {nextIcon ?? <ChevronRight className="h-4 w-4 ml-1" />}
          </>
        )}
      </Button>
    </div>
  );
}
