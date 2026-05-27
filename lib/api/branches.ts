import { apiFetch } from "@/lib/api/client";

export type BackendBranch = {
  id: string;
  name: string;
  city: string;
  address?: string;
  phone?: string;
  is_active?: boolean;
};

type BranchListPayload = {
  results: BackendBranch[];
};

let cachedBranches: BackendBranch[] | null = null;
let cacheExpiry = 0;
const CACHE_MS = 60_000;

export async function fetchBranches(force = false): Promise<BackendBranch[]> {
  const now = Date.now();
  if (!force && cachedBranches && now < cacheExpiry) {
    return cachedBranches;
  }

  const data = await apiFetch<BranchListPayload>("branches/", {
    method: "GET",
  });
  cachedBranches = data.results ?? [];
  cacheExpiry = now + CACHE_MS;
  return cachedBranches;
}

export function invalidateBranchCache(): void {
  cachedBranches = null;
  cacheExpiry = 0;
}
