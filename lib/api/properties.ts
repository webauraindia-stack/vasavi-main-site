import { apiFetch } from "@/lib/api/client";
import { fetchAllResults } from "@/lib/api/paginate";
import type { BackendRoomAvailability } from "@/lib/api/mappers";

export type BackendRoomCatalog = {
  id: string;
  branch: { id: string; name: string; city: string };
  room_number: string;
  room_type: { id: string; name: string };
  capacity: number;
  base_price_per_night: number;
  base_price_display?: string;
  is_donor_exclusive: boolean;
  is_active: boolean;
};

/** All active rooms at a branch (public catalog — no date filter). */
export async function listBranchRooms(branchId: string): Promise<BackendRoomCatalog[]> {
  return fetchAllResults<BackendRoomCatalog>(
    `properties/rooms/?branch_id=${encodeURIComponent(branchId)}`
  );
}

export async function searchRooms(params: {
  check_in: string;
  check_out: string;
  guests: number;
  branch_id?: string;
  donor_exclusive?: boolean;
}): Promise<BackendRoomAvailability[]> {
  const qs = new URLSearchParams({
    check_in: params.check_in,
    check_out: params.check_out,
    guests: String(params.guests),
  });
  if (params.branch_id) qs.set("branch_id", params.branch_id);
  if (params.donor_exclusive) qs.set("donor_exclusive", "true");
  return apiFetch<BackendRoomAvailability[]>(`properties/rooms/search?${qs}`, {
    method: "GET",
  });
}
