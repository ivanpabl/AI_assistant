"use client";

import { MODES } from "@/lib/modes";
import type { ModeId } from "@/lib/types";

interface ModeSelectorProps {
  value: ModeId;
  onChange: (mode: ModeId) => void;
  disabled?: boolean;
}

export function ModeSelector({ value, onChange, disabled }: ModeSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Режим ассистента" className="flex flex-wrap gap-2">
      {MODES.map((mode) => {
        const active = mode.id === value;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={active}
            title={mode.hint}
            disabled={disabled}
            onClick={() => onChange(mode.id)}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition
              disabled:cursor-not-allowed disabled:opacity-60
              ${
                active
                  ? "border-indigo-500 bg-indigo-500 text-white shadow-sm shadow-indigo-500/30"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-indigo-300 hover:text-indigo-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-indigo-500/60 dark:hover:text-indigo-300"
              }`}
          >
            <span aria-hidden="true">{mode.icon}</span>
            {mode.label}
          </button>
        );
      })}
    </div>
  );
}
