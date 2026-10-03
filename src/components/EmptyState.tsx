"use client";

import { getMode } from "@/lib/modes";
import type { ModeId } from "@/lib/types";

interface EmptyStateProps {
  mode: ModeId;
  onPick: (question: string) => void;
}

export function EmptyState({ mode, onPick }: EmptyStateProps) {
  const meta = getMode(mode);

  return (
    <div className="rounded-2xl border border-dashed border-zinc-200 px-5 py-8 text-center dark:border-zinc-800">
      <div aria-hidden="true" className="text-3xl">
        {meta.icon}
      </div>
      <p className="mt-2 font-medium text-zinc-800 dark:text-zinc-200">{meta.hint}</p>
      <p className="mt-1 text-sm text-zinc-500">Попробуйте один из примеров:</p>
      <div className="mt-4 flex flex-col items-center gap-2">
        {meta.examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onPick(example)}
            className="max-w-xl rounded-xl border border-zinc-200 bg-white px-4 py-2 text-left text-sm text-zinc-700 transition hover:border-indigo-300 hover:text-indigo-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300"
          >
            <span className="line-clamp-2">{example}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
