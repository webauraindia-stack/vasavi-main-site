import { apiFetch } from "@/lib/api/client";
import { fetchAllResults } from "@/lib/api/paginate";

export type BackendFunctionHall = {
  id: string;
  branch: { id: string; name: string };
  name: string;
  capacity: number;
  base_price_per_day: number;
  base_price_display?: string;
  is_active: boolean;
  operational_status: string;
  description?: string;
  amenities?: string[];
  images?: {
    id: string;
    image: string | null;
    is_primary: boolean;
    sort_order?: number;
  }[];
  is_available?: boolean;
};

export async function listBranchFunctionHalls(
  branchId: string
): Promise<BackendFunctionHall[]> {
  return fetchAllResults<BackendFunctionHall>(
    `properties/function-halls/?branch_id=${encodeURIComponent(branchId)}`
  );
}

export async function searchFunctionHalls(params: {
  branch_id: string;
  check_in_date: string;
  check_out_date: string;
  guests?: number;
}): Promise<BackendFunctionHall[]> {
  const qs = new URLSearchParams({
    branch_id: params.branch_id,
    check_in_date: params.check_in_date,
    check_out_date: params.check_out_date,
    guests: String(params.guests ?? 50),
  });
  return apiFetch<BackendFunctionHall[]>(
    `properties/function-halls/search/?${qs.toString()}`,
    { method: "GET" }
  );
}
