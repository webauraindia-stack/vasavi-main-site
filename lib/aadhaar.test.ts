import { describe, expect, it } from "vitest";
import {
  DEMO_VALID_AADHAAR,
  formatAadhaarDisplay,
  getAadhaarValidationError,
  isValidAadhaar,
  isValidAadhaarDigits,
  normalizeAadhaar,
  stripAadhaar,
} from "./aadhaar";

describe("stripAadhaar", () => {
  it("keeps digits only", () => {
    expect(stripAadhaar("3590 3009 6348")).toBe("359030096348");
  });

  it("caps at 12 digits", () => {
    expect(stripAadhaar("1234567890123456")).toBe("123456789012");
  });
});

describe("formatAadhaarDisplay", () => {
  it("formats four digits per space group", () => {
    expect(formatAadhaarDisplay("123456789012")).toBe("1234 5678 9012");
  });

  it("formats partial input progressively", () => {
    expect(formatAadhaarDisplay("3590")).toBe("3590");
    expect(formatAadhaarDisplay("35903009")).toBe("3590 3009");
  });

  it("returns empty for no digits", () => {
    expect(formatAadhaarDisplay("")).toBe("");
    expect(formatAadhaarDisplay("abc")).toBe("");
  });
});

describe("isValidAadhaarDigits", () => {
  it("accepts exactly 12 digits", () => {
    expect(isValidAadhaarDigits(DEMO_VALID_AADHAAR)).toBe(true);
    expect(isValidAadhaar("3590 3009 6348")).toBe(true);
    expect(isValidAadhaar("123456789012")).toBe(true);
  });

  it("rejects too few digits", () => {
    expect(isValidAadhaarDigits("23456789026")).toBe(false);
  });

  it("rejects empty input", () => {
    expect(isValidAadhaarDigits("")).toBe(false);
  });
});

describe("getAadhaarValidationError", () => {
  it("returns null for 12 digits", () => {
    expect(getAadhaarValidationError("359030096348")).toBeNull();
  });

  it("flags incomplete numbers", () => {
    expect(getAadhaarValidationError("35903009634")).toBe("length");
  });

  it("flags empty input", () => {
    expect(getAadhaarValidationError("")).toBe("required");
  });
});

describe("normalizeAadhaar", () => {
  it("stores plain 12-digit value", () => {
    expect(normalizeAadhaar("3590 3009 6348")).toBe("359030096348");
  });
});
