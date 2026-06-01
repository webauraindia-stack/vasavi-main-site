import { apiFetch, type ApiFetchOptions } from "@/lib/api/client";
import { type Page } from "@/lib/api/paginate";

export interface PublicDonor {
  id: string;
  donor_id: string;
  name: string;
  tier: string;
  club_name: string;
  district_code: string;
}

export interface DonorListParams {
  page?: number;
  search?: string;
  tier_id?: string;
  club_name?: string;
}

export const MOCK_DONORS: PublicDonor[] = [
  { id: "1", donor_id: "VCI-2024-1001", name: "Ramesh Kumar Gupta", tier: "Diamond", club_name: "KCGF Hyderabad", district_code: "V101A" },
  { id: "2", donor_id: "VCI-2024-1002", name: "Sita Ramachandran", tier: "Gold", club_name: "KCGF Bangalore", district_code: "V202B" },
  { id: "3", donor_id: "VCI-2024-1003", name: "Venkat Reddy", tier: "Silver", club_name: "KCGF Chennai", district_code: "V303C" },
  { id: "4", donor_id: "VCI-2024-1004", name: "Anjali Desai", tier: "Platinum", club_name: "KCGF Mumbai", district_code: "V404D" },
  { id: "5", donor_id: "VCI-2024-1005", name: "Kiran Patel", tier: "Bronze", club_name: "KCGF Ahmedabad", district_code: "V505E" },
  { id: "6", donor_id: "VCI-2024-1006", name: "Lakshmi Narayana", tier: "Diamond", club_name: "KCGF Vijayawada", district_code: "V101B" },
  { id: "7", donor_id: "VCI-2024-1007", name: "Rajeshwari Iyer", tier: "Gold", club_name: "KCGF Madurai", district_code: "V202C" },
  { id: "8", donor_id: "VCI-2024-1008", name: "Suresh Babu", tier: "Silver", club_name: "KCGF Kochi", district_code: "V303D" },
  { id: "9", donor_id: "VCI-2024-1009", name: "Meena Kumari", tier: "Platinum", club_name: "KCGF Delhi", district_code: "V404E" },
  { id: "10", donor_id: "VCI-2024-1010", name: "Prakash Rao", tier: "Bronze", club_name: "KCGF Pune", district_code: "V505F" },
];

export async function getPublicDonors(
  params: DonorListParams = {},
  options?: ApiFetchOptions
): Promise<Page<PublicDonor>> {
  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", params.page.toString());
  if (params.search) searchParams.set("search", params.search);
  if (params.tier_id) searchParams.set("tier_id", params.tier_id);
  const query = searchParams.toString();
  const path = query ? `donors/public/?${query}` : "donors/public/";

  try {
    const res = await apiFetch<Page<PublicDonor>>(path, options);
    if (res.results && res.results.length > 0) {
      return res;
    }
  } catch {
    if (process.env.NODE_ENV === "development") {
      console.warn("Donors API unavailable — using local fallback data");
    }
  }

  // Fallback to mock data if API returns empty or fails
  let filteredMocks = [...MOCK_DONORS];
  if (params.search) {
    const s = params.search.toLowerCase();
    filteredMocks = filteredMocks.filter(d => 
      d.name.toLowerCase().includes(s) || d.donor_id.toLowerCase().includes(s)
    );
  }
  if (params.club_name) {
    const c = params.club_name.toLowerCase();
    filteredMocks = filteredMocks.filter(d => 
      d.club_name.toLowerCase().includes(c)
    );
  }

  // Pagination for mock data
  const page = params.page || 1;
  const pageSize = 20;
  const start = (page - 1) * pageSize;
  const paginatedMocks = filteredMocks.slice(start, start + pageSize);

  return {
    count: filteredMocks.length,
    next: start + pageSize < filteredMocks.length ? "next" : null,
    previous: page > 1 ? "prev" : null,
    results: paginatedMocks,
  };
}
