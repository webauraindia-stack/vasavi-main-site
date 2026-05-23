import { apiFetch } from "@/lib/api/client";
import type { BackendRoomAvailability } from "@/lib/api/mappers";

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
