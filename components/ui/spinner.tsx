import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const sizeClasses = {
  sm: "h-3.5 w-3.5",
  md: "h-4 w-4",
  lg: "h-8 w-8",
} as const;

export function Spinner({
  size = "md",
  className,
  label = "Loading",
}: {
  size?: keyof typeof sizeClasses;
  className?: string;
  label?: string;
}) {
  return (
    <Loader2
      role="status"
      aria-label={label}
      className={cn("animate-spin shrink-0", sizeClasses[size], className)}
    />
  );
}

export function LoadingOverlay({
  show,
  label = "Please wait…",
  className,
}: {
  show: boolean;
  label?: string;
  className?: string;
}) {
  if (!show) return null;
  return (
    <div
      className={cn(
        "absolute inset-0 z-20 flex flex-col items-center justify-center gap-3",
        "bg-white/70 backdrop-blur-[2px] animate-in fade-in duration-200",
        className
      )}
      aria-busy="true"
      aria-live="polite"
    >
      <Spinner size="lg" className="text-champagne-dark" label={label} />
      <p className="text-sm font-semibold text-charcoal">{label}</p>
    </div>
  );
}
