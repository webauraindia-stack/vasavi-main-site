/** Map backend room/hall image rows to ordered URL lists for galleries. */

export type ApiPropertyImage = {
  url?: string | null;
  image?: string | null;
  is_primary?: boolean;
  sort_order?: number;
};

export function propertyImageUrls(images?: ApiPropertyImage[] | null): string[] {
  if (!images?.length) return [];

  const sorted = [...images].sort((a, b) => {
    if (a.is_primary && !b.is_primary) return -1;
    if (!a.is_primary && b.is_primary) return 1;
    return (a.sort_order ?? 0) - (b.sort_order ?? 0);
  });

  return sorted
    .map((row) => row.url ?? row.image)
    .filter((u): u is string => typeof u === "string" && u.trim().length > 0);
}
