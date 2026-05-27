export const PHONE_VALIDATION_MESSAGE =
  "Enter a valid 10-digit mobile number (must start with 6, 7, 8, or 9).";

export function sanitizePhoneInput(value: string): string {
  return value.replace(/\D/g, "").slice(0, 10);
}

export function validatePhoneField(
  phone: string,
  options?: { required?: boolean }
): string | null {
  const { required = true } = options ?? {};
  const digits = sanitizePhoneInput(phone);
  if (!digits) {
    return required ? PHONE_VALIDATION_MESSAGE : null;
  }
  if (!isValidIndianMobile(digits)) {
    return PHONE_VALIDATION_MESSAGE;
  }
  return null;
}

export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");

  if (digits.length === 10) {
    return `+91${digits}`;
  }

  if (digits.length === 12 && digits.startsWith("91")) {
    return `+${digits}`;
  }

  if (digits.length === 13 && digits.startsWith("091")) {
    return `+91${digits.slice(3)}`;
  }

  if (input.trim().startsWith("+") && digits.length >= 10) {
    return `+${digits}`;
  }

  return `+${digits}`;
}

export function isValidIndianMobile(phone: string): boolean {
  const normalized = normalizePhone(phone);
  return /^\+91[6-9]\d{9}$/.test(normalized);
}

/** 10-digit Indian mobile for Django API (accounts/staff serializers). */
export function toBackendPhone(input: string): string {
  const digits = normalizePhone(input).replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) {
    return digits.slice(2);
  }
  if (digits.length >= 10) {
    return digits.slice(-10);
  }
  return digits;
}

export function formatPhoneDisplay(phone: string): string {
  const normalized = normalizePhone(phone);
  const local = normalized.replace(/^\+91/, "");
  if (local.length !== 10) return phone;
  return `+91 ${local.slice(0, 5)} ${local.slice(5)}`;
}
