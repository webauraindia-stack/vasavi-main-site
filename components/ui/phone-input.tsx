"use client";

import { cn } from "@/lib/utils";
import { sanitizePhoneInput, PHONE_VALIDATION_MESSAGE } from "@/lib/auth/phone";
import { Input } from "@/components/ui/input";

export { PHONE_VALIDATION_MESSAGE };

type PhoneInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
};

export function PhoneInput({
  id,
  value,
  onChange,
  required,
  disabled,
  placeholder = "98765 43210",
  error,
  className,
  inputClassName,
}: PhoneInputProps) {
  return (
    <div className={cn("space-y-1", className)}>
      <div
        className={cn(
          "flex rounded-lg border overflow-hidden focus-within:ring-2 focus-within:ring-champagne/30",
          error ? "border-red-400" : "border-charcoal/15"
        )}
      >
        <span className="inline-flex items-center px-3 text-sm font-semibold text-muted bg-surface border-r border-charcoal/10">
          +91
        </span>
        <Input
          id={id}
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          value={value}
          onChange={(e) => onChange(sanitizePhoneInput(e.target.value))}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={10}
          aria-invalid={error ? true : undefined}
          className={cn("border-0 focus-visible:ring-0 rounded-none", inputClassName)}
        />
      </div>
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
