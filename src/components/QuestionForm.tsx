"use client";

import { type FormEvent, type KeyboardEvent, useEffect, useRef } from "react";
import { MAX_QUESTION_LENGTH } from "@/lib/config";
import { getMode } from "@/lib/modes";
import type { ModeId } from "@/lib/types";
import { SendIcon, StopIcon } from "./icons";
import { ModeSelector } from "./ModeSelector";

interface QuestionFormProps {
  question: string;
  mode: ModeId;
  busy: boolean;
  onQuestionChange: (value: string) => void;
  onModeChange: (mode: ModeId) => void;
  onSubmit: () => void;
  onStop: () => void;
}

export function QuestionForm({
  question,
  mode,
  busy,
  onQuestionChange,
  onModeChange,
  onSubmit,
  onStop,
}: QuestionFormProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const trimmed = question.trim();
  const tooLong = question.length > MAX_QUESTION_LENGTH;
  const canSubmit = !busy && trimmed.length > 0 && !tooLong;

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [question]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (canSubmit) onSubmit();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      if (canSubmit) onSubmit();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      autoComplete="off"
      className="rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-500/10 dark:border-zinc-800 dark:bg-zinc-900 sm:p-5"
    >
      <ModeSelector value={mode} onChange={onModeChange} disabled={busy} />

      <label htmlFor="question" className="sr-only">
        Ваш вопрос
      </label>
      <textarea
        id="question"
        ref={textareaRef}
        value={question}
        onChange={(e) => onQuestionChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={getMode(mode).placeholder}
        rows={3}
        autoFocus
        className="mt-4 block w-full resize-none bg-transparent text-base leading-relaxed text-zinc-900 outline-none placeholder:text-zinc-400 dark:text-zinc-100 dark:placeholder:text-zinc-500"
      />

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
        <p className="text-xs text-zinc-400">
          {tooLong ? (
            <span className="text-rose-500">
              Слишком длинный вопрос: {question.length} / {MAX_QUESTION_LENGTH}
            </span>
          ) : (
            <>
              <kbd className="rounded border border-zinc-200 px-1 font-sans dark:border-zinc-700">Ctrl</kbd> +{" "}
              <kbd className="rounded border border-zinc-200 px-1 font-sans dark:border-zinc-700">Enter</kbd> — отправить
            </>
          )}
        </p>

        {busy ? (
          <button
            key="stop"
            type="button"
            onClick={onStop}
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white"
          >
            <StopIcon />
            Остановить
          </button>
        ) : (
          <button
            key="submit"
            type="submit"
            disabled={!canSubmit}
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/30 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:bg-zinc-300 disabled:shadow-none dark:disabled:bg-zinc-700"
          >
            <SendIcon />
            Спросить AI
          </button>
        )}
      </div>
    </form>
  );
}
