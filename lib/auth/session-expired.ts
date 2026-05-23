import { ApiClientError } from "@/lib/api/client";

/** Thrown when the refresh cookie is missing or invalid — user must sign in again. */
export class SessionExpiredError extends Error {
  readonly code = "SESSION_EXPIRED";

  constructor(message = "Your session has expired. Please sign in again.") {
    super(message);
    this.name = "SessionExpiredError";
  }
}

export function isUnauthorizedError(error: unknown): boolean {
  if (error instanceof ApiClientError) {
    return error.status === 401;
  }
  if (error instanceof SessionExpiredError) {
    return true;
  }
  return false;
}

export function isSessionExpiredError(error: unknown): error is SessionExpiredError {
  return error instanceof SessionExpiredError;
}
