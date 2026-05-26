import { randomUUID } from "crypto";
import { normalizePhone } from "@/lib/auth/phone";

type VerificationRecord = {
  phone: string;
  expiresAt: number;
};

const TOKEN_TTL_MS = 10 * 60 * 1000;

type VerificationStore = Map<string, VerificationRecord>;

const globalForAuth = globalThis as typeof globalThis & {
  __vasaviVerificationTokens?: VerificationStore;
};

const verificationTokens: VerificationStore =
  globalForAuth.__vasaviVerificationTokens ?? new Map();

if (!globalForAuth.__vasaviVerificationTokens) {
  globalForAuth.__vasaviVerificationTokens = verificationTokens;
}

export function issueVerificationToken(phone: string): string {
  const normalized = normalizePhone(phone);
  const token = randomUUID();

  verificationTokens.set(token, {
    phone: normalized,
    expiresAt: Date.now() + TOKEN_TTL_MS,
  });

  return token;
}

export function consumeVerificationToken(token: string, phone: string): boolean {
  const record = verificationTokens.get(token);
  const normalized = normalizePhone(phone);

  if (!record || record.phone !== normalized) {
    return false;
  }

  if (Date.now() > record.expiresAt) {
    verificationTokens.delete(token);
    return false;
  }

  verificationTokens.delete(token);
  return true;
}
