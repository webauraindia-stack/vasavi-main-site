"use client";

import type { ComponentPropsWithoutRef } from "react";
import { Input } from "@/components/ui/input";
import { formatAadhaarDisplay, stripAadhaar } from "@/lib/aadhaar";
import { cn } from "@/lib/utils";

export type AadhaarInputProps = Omit<
  ComponentPropsWithoutRef<typeof Input>,
  "value" | "onChange" | "type" | "inputMode"
> & {
  value: string;
  onValueChange: (digits: string) => void;
  invalid?: boolean;
};

export function AadhaarInput({
  value,
  onValueChange,
  invalid,
  className,
  placeholder = "XXXX XXXX XXXX",
  ...props
}: AadhaarInputProps) {
  return (
    <Input
      {...props}
      type="text"
      inputMode="numeric"
      autoComplete="off"
      spellCheck={false}
      placeholder={placeholder}
      maxLength={14}
      value={formatAadhaarDisplay(value)}
      onChange={(event) => onValueChange(stripAadhaar(event.target.value))}
      className={cn(
        "font-mono tracking-[0.2em] tabular-nums placeholder:tracking-[0.15em] placeholder:text-charcoal/35",
        invalid && "border-red-500 focus-visible:ring-red-500/30",
        className
      )}
      aria-describedby={props["aria-describedby"]}
    />
  );
}
