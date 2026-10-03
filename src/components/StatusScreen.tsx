import type { ReactNode } from "react";

interface StatusScreenProps {
  icon: string;
  title: string;
  description: string;
  children: ReactNode;
}

export function StatusScreen({ icon, title, description, children }: StatusScreenProps) {
  return (
    <main className="grid min-h-screen place-items-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 text-center shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <div aria-hidden="true" className="text-4xl">
          {icon}
        </div>
        <h1 className="mt-3 text-lg font-semibold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-zinc-500">{description}</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">{children}</div>
      </div>
    </main>
  );
}

export const primaryButtonClass =
  "inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500";

export const secondaryButtonClass =
  "inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800";
