import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";

export const SESSION_COOKIE = "assistant_session";
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

function getPassword(): string {
  return process.env.ACCESS_PASSWORD ?? "";
}

export function isAuthEnabled(): boolean {
  return getPassword().length > 0;
}

export function createSessionToken(): string {
  return createHmac("sha256", getPassword()).update("team-ai-assistant:session").digest("hex");
}

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function isPasswordValid(input: string): boolean {
  return isAuthEnabled() && safeEqual(input, getPassword());
}

export function isSessionValid(token: string | undefined): boolean {
  if (!isAuthEnabled()) return true;
  return token !== undefined && safeEqual(token, createSessionToken());
}
