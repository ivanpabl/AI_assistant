"use client";

import { useEffect } from "react";
import "./globals.css";

interface GlobalErrorProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function GlobalError({ error, retry }: GlobalErrorProps) {
  useEffect(() => {
    console.error("[ui] app crashed:", error);
  }, [error]);

  return (
    <html lang="ru">
      <body className="grid min-h-screen place-items-center px-4 font-sans">
        <title>Ошибка — Team AI Assistant</title>
        <div className="max-w-md text-center">
          <div aria-hidden="true" className="text-4xl">
            ⚠️
          </div>
          <h1 className="mt-3 text-lg font-semibold">Приложение не смогло загрузиться</h1>
          <p className="mt-1.5 text-sm text-zinc-500">
            Произошла критическая ошибка. Попробуйте ещё раз или обновите страницу.
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              onClick={retry}
              className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Попробовать снова
            </button>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              Обновить страницу
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
