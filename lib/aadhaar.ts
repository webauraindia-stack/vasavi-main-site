/** Strip to digits only, capped at 12 (Aadhaar length). */
export function stripAadhaar(value: string): string {
  return value.replace(/\D/g, "").slice(0, 12);
}

/** Display as four digits per group: XXXX XXXX XXXX */
export function formatAadhaarDisplay(digits: string): string {
  const clean = stripAadhaar(digits);
  if (!clean) return "";
  return clean.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/** Normalize stored value — always 12 digits or empty string. */
export function normalizeAadhaar(value: string): string {
  return stripAadhaar(value);
}

/** Valid when exactly 12 digits. */
export function isValidAadhaarDigits(digits: string): boolean {
  return stripAadhaar(digits).length === 12;
}

export function isValidAadhaar(value: string): boolean {
  return isValidAadhaarDigits(value);
}

export type AadhaarValidationError = "required" | "length";

/** Returns the first validation issue, or null when valid. */
export function getAadhaarValidationError(digits: string): AadhaarValidationError | null {
  const clean = stripAadhaar(digits);
  if (!clean) return "required";
  if (clean.length < 12) return "length";
  return null;
}

/** Demo number for tests and OTP demo flows. */
export const DEMO_VALID_AADHAAR = "123456789012";
