import { cn } from "@/lib/utils";

const FIELD_H = "h-[3.25rem] min-h-[3.25rem]";

export function GlobalSearchBarSkeleton({
  className,
  variant = "hero",
}: {
  className?: string;
  variant?: "hero" | "compact";
}) {
  return (
    <div
      className={cn(
        "search-card relative z-20 w-full rounded-2xl border border-charcoal/10 bg-white p-3 sm:p-3.5",
        variant === "hero" ? "max-w-6xl mx-auto" : "",
        className
      )}
      aria-hidden
    >
      <div className="flex flex-col gap-3 lg:flex-row lg:items-stretch lg:gap-2">
        <div className={cn("w-full rounded-xl bg-charcoal/5 animate-pulse", FIELD_H)} />
        <div className={cn("w-full rounded-xl bg-charcoal/5 animate-pulse", FIELD_H)} />
        <div className={cn("w-full rounded-xl bg-charcoal/5 animate-pulse", FIELD_H)} />
        <div className={cn("w-full rounded-xl bg-champagne/20 animate-pulse lg:w-36", FIELD_H)} />
      </div>
    </div>
  );
}
