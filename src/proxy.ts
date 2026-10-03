import { type NextRequest, NextResponse } from "next/server";
import { isSessionValid, SESSION_COOKIE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  if (isSessionValid(request.cookies.get(SESSION_COOKIE)?.value)) {
    return NextResponse.next();
  }

  if (request.nextUrl.pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Сессия истекла. Обновите страницу и войдите заново" }, { status: 401 });
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|icon.svg|login|api/session).*)"],
};
