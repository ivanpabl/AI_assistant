"use client";

import { HISTORY_LIMIT } from "@/lib/config";
import { getMode } from "@/lib/modes";
import type { HistoryItem } from "@/lib/types";
import { ClockIcon, CloseIcon, TrashIcon } from "./icons";

interface HistoryPanelProps {
  items: HistoryItem[];
  activeId: string | null;
  onSelect: (item: HistoryItem) => void;
  onRemove: (id: string) => void;
  onClear: () => void;
}

const timeFormat = new Intl.DateTimeFormat("ru-RU", { hour: "2-digit", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("ru-RU", { day: "numeric", month: "short" });

function formatTime(timestamp: number): string {
  const date = new Date(timestamp);
  const isToday = date.toDateString() === new Date().toDateString();
  return isToday ? timeFormat.format(date) : dateFormat.format(date);
}

export function HistoryPanel({ items, activeId, onSelect, onRemove, onClear }: HistoryPanelProps) {
  return (
    <section
      aria-labelledby="history-title"
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 id="history-title" className="flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          <ClockIcon />
          Недавние запросы
          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-500 dark:bg-zinc-800">
            {items.length}/{HISTORY_LIMIT}
          </span>
        </h2>
        {items.length > 0 && (
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-zinc-400 transition hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10"
          >
            <TrashIcon />
            Очистить
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-200 px-4 py-6 text-center text-sm text-zinc-400 dark:border-zinc-800">
          Здесь появятся последние {HISTORY_LIMIT} вопросов — к ним можно вернуться в один клик
        </p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((item) => {
            const mode = getMode(item.mode);
            const active = item.id === activeId;
            return (
              <li key={item.id} className="group relative">
                <button
                  type="button"
                  onClick={() => onSelect(item)}
                  aria-current={active}
                  className={`w-full rounded-xl px-3 py-2.5 pr-9 text-left transition
                    ${active ? "bg-indigo-50 ring-1 ring-indigo-200 dark:bg-indigo-500/10 dark:ring-indigo-500/30" : "hover:bg-zinc-50 dark:hover:bg-zinc-800/60"}`}
                >
                  <span className="line-clamp-2 text-sm text-zinc-800 dark:text-zinc-200">{item.question}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-xs text-zinc-400">
                    <span aria-hidden="true">{mode.icon}</span>
                    {mode.label} · {formatTime(item.createdAt)}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  aria-label="Удалить из истории"
                  className="absolute right-2 top-2.5 rounded-md p-1 text-zinc-400 opacity-0 transition hover:bg-zinc-200 hover:text-zinc-700 focus:opacity-100 group-hover:opacity-100 dark:hover:bg-zinc-700 dark:hover:text-zinc-200 max-lg:opacity-100"
                >
                  <CloseIcon />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
