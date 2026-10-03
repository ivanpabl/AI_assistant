import { cookies } from "next/headers";
import { createSessionToken, isAuthEnabled, isPasswordValid, SESSION_COOKIE, SESSION_MAX_AGE_SEC } from "@/lib/auth";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import type { ApiErrorBody } from "@/lib/types";

function jsonError(status: number, error: string) {
  return Response.json({ error } satisfies ApiErrorBody, { status });
}

export async function POST(request: Request) {
  if (!isAuthEnabled()) return new Response(null, { status: 204 });

  const limit = checkRateLimit(`login:${clientIp(request)}`);
  if (!limit.ok) return jsonError(429, `Слишком много попыток. Повторите через ${limit.retryAfterSec} с`);

  const body = (await request.json().catch(() => null)) as { password?: unknown } | null;
  const password = typeof body?.password === "string" ? body.password : "";
  if (!isPasswordValid(password)) return jsonError(401, "Неверный пароль");

  (await cookies()).set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SEC,
  });
  return new Response(null, { status: 204 });
}

export async function DELETE() {
  (await cookies()).delete(SESSION_COOKIE);
  return new Response(null, { status: 204 });
}
