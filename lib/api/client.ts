import { parseApiErrorMessage } from "@/lib/api/parse-error";
import type { ApiResponse } from "@/lib/api/types";
import { isApiError } from "@/lib/api/types";

function apiBase(): string {
  if (typeof window === "undefined") {
    return `${process.env.BACKEND_URL ?? "http://localhost:8000"}/api/v1`;
  }
  return "/api/backend";
}

export class ApiClientError extends Error {
  code: string;
  status: number;

  constructor(code: string, message: string, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export type ApiFetchOptions = RequestInit & {
  accessToken?: string | null;
  idempotencyKey?: string;
};

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> {
  const { accessToken, idempotencyKey, headers: initHeaders, ...init } = options;
  const headers = new Headers(initHeaders);

  if (!headers.has("Content-Type") && init.body) {
    headers.set("Content-Type", "application/json");
  }
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (idempotencyKey) {
    headers.set("X-Idempotency-Key", idempotencyKey);
  }

  let normalized = path.startsWith("/") ? path.slice(1) : path;
  const qIndex = normalized.indexOf("?");
  const pathname = qIndex >= 0 ? normalized.slice(0, qIndex) : normalized;
  const query = qIndex >= 0 ? normalized.slice(qIndex) : "";
  const pathnameWithSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  normalized = `${pathnameWithSlash}${query}`;
  const res = await fetch(`${apiBase()}/${normalized}`, {
    ...init,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  let payload: unknown;
  try {
    payload = await res.json();
  } catch {
    throw new ApiClientError("SERVER_ERROR", "Invalid response from server.", res.status);
  }

  if (!res.ok) {
    if (payload && typeof payload === "object" && isApiError(payload as ApiResponse<T>)) {
      const err = payload as ApiResponse<T> & { success: false };
      throw new ApiClientError(err.error.code, err.error.message, res.status);
    }
    const record = payload as Record<string, unknown>;
    const code =
      typeof record.code === "string"
        ? record.code
        : res.status === 401
          ? "AUTH_FAILED"
          : "SERVER_ERROR";
    throw new ApiClientError(
      code,
      parseApiErrorMessage(payload, res.statusText || "Request failed."),
      res.status
    );
  }

  const envelope = payload as ApiResponse<T>;
  if (isApiError(envelope)) {
    throw new ApiClientError(
      envelope.error.code,
      envelope.error.message,
      res.status
    );
  }

  return envelope.data;
}
