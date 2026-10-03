"use client";

import { type FormEvent, useState } from "react";
import type { ApiErrorBody } from "@/lib/types";

export function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      const response = await fetch("/api/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (response.ok) {
        window.location.replace("/");
        return;
      }
      const body = (await response.json().catch(() => null)) as ApiErrorBody | null;
      setError(body?.error ?? `Ошибка сервера (${response.status})`);
    } catch {
      setError("Не удалось связаться с сервером. Проверьте подключение");
    }
    setPending(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="flex items-center gap-3">
        <div
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-lg shadow-indigo-500/30"
        >
          ✦
        </div>
        <div>
          <h1 className="font-semibold tracking-tight">Team AI Assistant</h1>
          <p className="text-sm text-zinc-500">Доступ только для команды</p>
        </div>
      </div>

      <label htmlFor="password" className="mt-6 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        Пароль
      </label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="current-password"
        autoFocus
        required
        className="mt-1.5 block w-full rounded-xl border border-zinc-200 bg-transparent px-3.5 py-2.5 text-sm outline-none transition focus:border-indigo-400 focus:ring-4 focus:ring-indigo-500/10 dark:border-zinc-700"
      />

      {error && (
        <p role="alert" className="mt-3 text-sm text-rose-600 dark:text-rose-400">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending || !password}
        className="mt-5 w-full rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none dark:disabled:bg-zinc-700"
      >
        {pending ? "Проверяем…" : "Войти"}
      </button>
    </form>
  );
}
