import type { ApiError } from "@/lib/api/types";

/** Extract a user-visible message from Vasavi or legacy middleware JSON. */
export function parseApiErrorMessage(data: unknown, fallback: string): string {
  if (!data || typeof data !== "object") {
    return fallback;
  }

  const record = data as Record<string, unknown>;

  if (record.success === false && record.error && typeof record.error === "object") {
    const err = record.error as ApiError["error"];
    const fields = err.fields;
    if (fields && typeof fields === "object") {
      const parts: string[] = [];
      for (const messages of Object.values(fields)) {
        if (Array.isArray(messages)) {
          for (const m of messages) {
            if (m) parts.push(String(m));
          }
        }
      }
      if (parts.length > 0) return parts.join(" ");
    }
    return err.message || fallback;
  }

  if (typeof record.detail === "string") {
    return record.detail;
  }

  if (Array.isArray(record.messages) && record.messages.length > 0) {
    const first = record.messages[0];
    if (first && typeof first === "object" && "message" in first) {
      const msg = (first as { message?: unknown }).message;
      if (typeof msg === "string") return msg;
    }
  }

  if (typeof record.error === "string") {
    return record.error;
  }

  if (record.error && typeof record.error === "object") {
    const nested = record.error as Record<string, unknown>;
    if (typeof nested.message === "string") {
      return nested.message;
    }
  }

  return fallback;
}
