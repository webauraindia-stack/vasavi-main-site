import { apiFetch } from "@/lib/api/client";

export type Page<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

export async function fetchPage<T>(
  path: string,
  page = 1,
  pageSize = 100
): Promise<Page<T>> {
  const separator = path.includes("?") ? "&" : "?";
  return apiFetch<Page<T>>(
    `${path}${separator}page=${page}&page_size=${pageSize}`,
    { method: "GET" }
  );
}

/** Fetch every page of a paginated public list endpoint. */
export async function fetchAllResults<T>(
  path: string,
  options?: { pageSize?: number; maxPages?: number }
): Promise<T[]> {
  const pageSize = options?.pageSize ?? 100;
  const maxPages = options?.maxPages ?? 50;
  const items: T[] = [];
  let page = 1;

  for (;;) {
    const data = await fetchPage<T>(path, page, pageSize);
    items.push(...(data.results ?? []));
    if (!data.next) break;
    page += 1;
    if (page > maxPages) break;
  }

  return items;
}
