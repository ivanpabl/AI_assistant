"use client";

import type { AskStatus } from "@/hooks/useAskAI";
import { getMode } from "@/lib/modes";
import type { ModeId } from "@/lib/types";
import { CopyButton } from "./CopyButton";
import { RetryIcon } from "./icons";
import { Markdown } from "./Markdown";

interface AnswerCardProps {
  status: AskStatus;
  question: string;
  mode: ModeId;
  answer: string;
  error: string | null;
  durationMs: number | null;
  onRetry: () => void;
}

export function AnswerCard({ status, question, mode, answer, error, durationMs, onRetry }: AnswerCardProps) {
  const modeMeta = getMode(mode);
  const streaming = status === "streaming";

  return (
    <article
      aria-live="polite"
      aria-busy={status === "loading" || streaming}
      className="animate-fade-in rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <header className="flex items-start gap-3 border-b border-zinc-100 px-5 py-4 dark:border-zinc-800">
        <span
          aria-hidden="true"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-indigo-50 text-lg dark:bg-indigo-500/10"
        >
          {modeMeta.icon}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
            {modeMeta.label}
          </p>
          <h2 className="mt-0.5 line-clamp-2 break-words font-medium text-zinc-900 dark:text-zinc-100">{question}</h2>
        </div>
      </header>

      <div className="px-5 py-5">
        {status === "loading" && <ThinkingSkeleton />}

        {answer && (
          <div className={streaming ? "streaming-caret" : undefined}>
            <Markdown content={answer} />
          </div>
        )}

        {status === "error" && error && (
          <div
            role="alert"
            className="mt-2 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
          >
            <span>⚠️ {error}</span>
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 font-medium text-rose-700 shadow-sm hover:bg-rose-100 dark:bg-rose-500/20 dark:text-rose-200 dark:hover:bg-rose-500/30"
            >
              <RetryIcon />
              Повторить
            </button>
          </div>
        )}
      </div>

      {(status === "stopped" || (status === "done" && answer)) && (
        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-5 py-3 dark:border-zinc-800">
          <span className="text-xs text-zinc-400">
            {status === "stopped"
              ? "Генерация остановлена"
              : durationMs
                ? `Ответ за ${(durationMs / 1000).toFixed(1)} с`
                : "Из истории"}
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <RetryIcon />
              Спросить заново
            </button>
            {answer && <CopyButton text={answer} label="Копировать ответ" />}
          </div>
        </footer>
      )}
    </article>
  );
}

function ThinkingSkeleton() {
  return (
    <div className="space-y-3" aria-label="Ассистент думает">
      <p className="flex items-center gap-2 text-sm text-zinc-500">
        <span className="flex gap-1">
          <span className="size-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.3s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:-0.15s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-indigo-500" />
        </span>
        Ассистент думает…
      </p>
      <div className="h-3 w-11/12 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-3 w-4/5 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
      <div className="h-3 w-2/3 animate-pulse rounded bg-zinc-100 dark:bg-zinc-800" />
    </div>
  );
}
