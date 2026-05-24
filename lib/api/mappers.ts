import { roomImagesFromApi } from "@/lib/images/room-image";
import type {
  BookingStatus,
  Coupon,
  Donor,
  DonorBooking,
  DonorTier,
  Room,
  RoomCategory,
} from "@/types";

type BackendBranch = {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
};

type BackendRoomType = { id: string; name: string };

export type BackendRoomAvailability = {
  id: string;
  branch: BackendBranch;
  room_number: string;
  room_type: BackendRoomType;
  capacity: number;
  base_price_per_night: number;
  base_price_display?: string;
  is_donor_exclusive: boolean;
  is_available: boolean;
  unavailable_reason?: string | null;
};

export type BackendCoupon = {
  id: string;
  serial_number: number;
  coupon_type: "concession" | "free";
  status: "issued" | "dispatched" | "redeemed";
  batch?: { extra_benefit?: string };
};

export type BackendDonorProfile = {
  id: string;
  donor_id: string;
  name: string;
  phone: string;
  tier?: { name: string } | null;
  club_name?: string;
  total_donated_paise?: number;
  available_coupons_count?: number;
  date_joined?: string;
};

export type BackendBooking = {
  id: string;
  booking_reference: string;
  status: string;
  payment_status: string;
  check_in_date: string;
  check_out_date: string;
  nights: number;
  guest_count?: number;
  guest_name?: string;
  guest_phone?: string;
  base_amount_paise?: number;
  discount_amount_paise?: number;
  final_amount_paise: number;
  base_amount_display?: string;
  discount_display?: string;
  final_amount_display?: string;
  payment_gateway?: string;
  payment_reference?: string;
  payment_paid_at?: string | null;
  notes?: string;
  expires_at?: string | null;
  created_at?: string;
  branch?: BackendBranch;
  room?: {
    id: string;
    room_number: string;
    room_type?: BackendRoomType;
    capacity?: number;
    base_price_per_night?: number;
    is_donor_exclusive?: boolean;
  };
  coupons_applied?: BackendCoupon[];
  user?: {
    name?: string;
    phone?: string;
    email?: string;
  };
};

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function mapRoomCategory(name: string): RoomCategory {
  const n = name.toLowerCase();
  if (n.includes("suite")) return "Suite";
  if (n.includes("penthouse")) return "Penthouse";
  if (n.includes("deluxe")) return "Deluxe";
  return "Standard";
}

/** Build a Room from booking detail (resume pending checkout). */
export function mapRoomFromBooking(b: BackendBooking): Room | null {
  const room = b.room;
  const branch = b.branch;
  if (!room?.id || !branch) return null;

  const slug = slugify(branch.name);
  const priceRupees = Math.round((room.base_price_per_night ?? b.final_amount_paise ?? 0) / 100);
  const typeName = room.room_type?.name ?? "Room";
  const category = mapRoomCategory(typeName);
  const mapped = {
    id: room.id,
    hotelId: branch.id,
    hotelSlug: slug,
    hotelName: branch.name,
    name: `${typeName} · ${room.room_number}`,
    category,
    description: `${typeName} at ${branch.name}, ${branch.city}`,
    pricePerNight: priceRupees || 1,
    bedType: "Standard",
    sizeSqFt: 200,
    maxOccupancy: room.capacity ?? 2,
    floor: 1,
    amenities: [] as string[],
    images: [] as string[],
    isDonorExclusive: room.is_donor_exclusive ?? false,
    isFullyBooked: false,
    availableDates: [] as string[],
  };
  return {
    ...mapped,
    images: roomImagesFromApi(mapped),
  };
}

export function mapRoomFromBackend(room: BackendRoomAvailability): Room {
  const branch = room.branch;
  const slug = slugify(branch.name);
  const priceRupees = Math.round(room.base_price_per_night / 100);
  const category = mapRoomCategory(room.room_type.name);
  const mapped = {
    id: room.id,
    hotelId: branch.id,
    hotelSlug: slug,
    hotelName: branch.name,
    name: `${room.room_type.name} · ${room.room_number}`,
    category,
    description: `${room.room_type.name} at ${branch.name}, ${branch.city}`,
    pricePerNight: priceRupees,
    bedType: "Standard",
    sizeSqFt: 200,
    maxOccupancy: room.capacity,
    floor: 1,
    amenities: [] as string[],
    images: [] as string[],
    isDonorExclusive: room.is_donor_exclusive,
    isFullyBooked: !room.is_available,
    availableDates: [] as string[],
  };
  return {
    ...mapped,
    images: roomImagesFromApi(mapped),
  };
}

function parseConcessionPercent(extra: string | undefined): number {
  const match = (extra ?? "").match(/(\d+)\s*%/);
  return match ? Number(match[1]) : 50;
}

export function mapCouponFromBackend(coupon: BackendCoupon): Coupon {
  const isFree = coupon.coupon_type === "free";
  const percent = parseConcessionPercent(coupon.batch?.extra_benefit);
  return {
    id: coupon.id,
    code: `VAS-${coupon.serial_number}`,
    name: isFree ? "Free stay coupon" : `${percent}% concession`,
    type: isFree ? "free_booking" : "percentage_discount",
    value: isFree ? 0 : percent,
    minBookingAmount: 0,
    expiryDate: "2026-12-31",
    usageLimit: 1,
    usedCount: coupon.status === "redeemed" ? 1 : 0,
    status: coupon.status === "dispatched" ? "available" : "redeemed",
    description: isFree
      ? "Complimentary stay benefit"
      : coupon.batch?.extra_benefit || `${percent}% off your booking`,
    source: "Vasavi Community",
  };
}

const TIER_MAP: Record<string, DonorTier> = {
  bronze: "bronze",
  silver: "silver",
  gold: "gold",
  platinum: "platinum",
  elite: "elite",
};

export function mapDonorFromBackend(
  profile: BackendDonorProfile,
  coupons: Coupon[]
): Donor {
  const tierName = (profile.tier?.name ?? "").toLowerCase();
  const tier =
    Object.entries(TIER_MAP).find(([k]) => tierName.includes(k))?.[1] ?? "gold";

  const memberSince = profile.date_joined
    ? profile.date_joined.slice(0, 10)
    : new Date().toISOString().slice(0, 10);

  return {
    id: profile.id,
    donorId: profile.donor_id,
    name: profile.name,
    email: `${profile.phone}@vasavi.local`,
    tier,
    membershipTierName: profile.tier?.name,
    totalDonation: Math.round((profile.total_donated_paise ?? 0) / 100),
    discountPercent: 0,
    monthlyBookingQuota: 4,
    monthlyBookingsUsed: 0,
    quotaResetDate: new Date().toISOString().slice(0, 10),
    memberSince,
    donations: [],
    bookings: [],
    rewardPoints: 0,
    compensationCredits: 0,
    coupons,
    loyaltyStreak: 0,
    bookingBenefits: [],
    clubName: profile.club_name?.trim() || "Vasavi Community",
    city: "",
  };
}

export type CustomerBookingListItem = {
  id: string;
  reference: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPaid: number;
  discountApplied: number;
};

export function mapBookingListItem(b: BackendBooking): CustomerBookingListItem {
  const totalPaid = Math.round((b.final_amount_paise ?? 0) / 100);
  const discount = Math.round((b.discount_amount_paise ?? 0) / 100);
  return {
    id: b.id,
    reference: b.booking_reference,
    hotelName: b.branch?.name ?? "Vasavi Hotel",
    roomType: b.room?.room_type?.name
      ? `${b.room.room_type.name} · ${b.room.room_number}`
      : b.room?.room_number ?? "Room",
    checkIn: b.check_in_date,
    checkOut: b.check_out_date,
    status: mapBookingStatus(b.status),
    totalPaid,
    discountApplied: discount,
  };
}

function mapBookingStatus(status: string): BookingStatus {
  switch (status) {
    case "checked_in":
      return "checked_in";
    case "checked_out":
      return "completed";
    case "confirmed":
      return "confirmed";
    case "cancelled":
      return "cancelled";
    case "no_show":
      return "cancelled";
    default:
      return "pending";
  }
}

export type CustomerBookingDetail = DonorBooking & {
  paymentStatus: string;
  paymentGateway?: string;
  paymentReference?: string;
  guestName?: string;
  guestCount?: number;
  branchCity?: string;
  branchAddress?: string;
  branchPhone?: string;
  createdAt?: string;
};

export function mapBookingDetail(b: BackendBooking): CustomerBookingDetail {
  const list = mapBookingListItem(b);
  return {
    id: list.id,
    reference: list.reference,
    hotelId: b.branch?.id,
    hotelName: list.hotelName,
    roomType: b.room?.room_type?.name ?? list.roomType,
    roomNumber: b.room?.room_number,
    checkIn: list.checkIn,
    checkOut: list.checkOut,
    nights: b.nights,
    subtotal: Math.round((b.base_amount_paise ?? 0) / 100),
    totalPaid: list.totalPaid,
    discountApplied: list.discountApplied,
    status: list.status as BookingStatus,
    guestEmail: b.user?.email,
    guestPhone: b.guest_phone || b.user?.phone,
    guestName: b.guest_name || b.user?.name,
    paymentStatus: b.payment_status,
    paymentGateway: b.payment_gateway,
    paymentReference: b.payment_reference,
    guestCount: b.guest_count,
    branchCity: b.branch?.city,
    branchAddress: b.branch?.address,
    branchPhone: b.branch?.phone,
    createdAt: b.created_at,
  };
}
