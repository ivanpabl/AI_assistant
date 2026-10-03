"use client";

import { catchError, type ErrorInfo } from "next/error";
import { Markdown } from "./Markdown";

function PlainTextFallback({ content }: { content: string }, { error }: ErrorInfo) {
  console.error("[ui] markdown render failed:", error);
  return (
    <div>
      <p className="mb-3 text-xs text-amber-600 dark:text-amber-400">
        ⚠️ Не удалось оформить ответ — показан исходный текст.
      </p>
      <pre className="whitespace-pre-wrap break-words font-sans text-sm leading-relaxed text-zinc-800 dark:text-zinc-200">
        {content}
      </pre>
    </div>
  );
}

const MarkdownBoundary = catchError(PlainTextFallback);

export function SafeMarkdown({ content }: { content: string }) {
  return (
    <MarkdownBoundary content={content}>
      <Markdown content={content} />
    </MarkdownBoundary>
  );
}
