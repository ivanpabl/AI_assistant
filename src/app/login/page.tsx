import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/LoginForm";
import { isAuthEnabled, isSessionValid, SESSION_COOKIE } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Вход — Team AI Assistant",
};

export default async function LoginPage() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!isAuthEnabled() || isSessionValid(token)) redirect("/");

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <LoginForm />
    </main>
  );
}
