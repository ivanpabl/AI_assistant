"use client";

import { useCallback, useState } from "react";
import { useAskAI } from "@/hooks/useAskAI";
import { useHistory } from "@/hooks/useHistory";
import { historyStore } from "@/lib/history";
import { DEFAULT_MODE } from "@/lib/modes";
import type { AskRequest, HistoryItem, ModeId } from "@/lib/types";
import { AnswerCard } from "./AnswerCard";
import { EmptyState } from "./EmptyState";
import { HistoryPanel } from "./HistoryPanel";
import { QuestionForm } from "./QuestionForm";

async function logout() {
  await fetch("/api/session", { method: "DELETE" }).catch(() => null);
  window.location.replace("/login");
}

export function AssistantDashboard({ canLogout }: { canLogout: boolean }) {
  const historyItems = useHistory();
  const [question, setQuestion] = useState("");
  const [mode, setMode] = useState<ModeId>(DEFAULT_MODE);
  const [current, setCurrent] = useState<AskRequest | null>(null);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  const saveToHistory = useCallback((request: AskRequest, answer: string) => {
    setActiveHistoryId(historyStore.add({ ...request, answer }).id);
  }, []);

  const assistant = useAskAI(saveToHistory);
  const busy = assistant.status === "loading" || assistant.status === "streaming";

  const submit = (request: AskRequest) => {
    setCurrent(request);
    setActiveHistoryId(null);
    void assistant.ask(request);
  };

  const openHistoryItem = (item: HistoryItem) => {
    setCurrent({ question: item.question, mode: item.mode });
    setQuestion(item.question);
    setMode(item.mode);
    setActiveHistoryId(item.id);
    assistant.show(item.answer);
  };

  const removeHistoryItem = (id: string) => {
    historyStore.remove(id);
    if (id === activeHistoryId) setActiveHistoryId(null);
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-6 sm:px-6 lg:py-10">
      <header className="mb-6 flex items-center gap-3 lg:mb-8">
        <div
          aria-hidden="true"
          className="grid size-10 place-items-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 text-lg text-white shadow-lg shadow-indigo-500/30"
        >
          ✦
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-semibold tracking-tight">Team AI Assistant</h1>
          <p className="text-sm text-zinc-500">Объяснит, сожмёт, напишет и отревьюит — за пару секунд</p>
        </div>
        {canLogout && (
          <button
            type="button"
            onClick={logout}
            className="rounded-lg px-3 py-1.5 text-sm text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
          >
            Выйти
          </button>
        )}
      </header>

      <div className="grid flex-1 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
        <main className="flex min-w-0 flex-col gap-6">
          <QuestionForm
            question={question}
            mode={mode}
            busy={busy}
            onQuestionChange={setQuestion}
            onModeChange={setMode}
            onSubmit={() => submit({ question: question.trim(), mode })}
            onStop={assistant.stop}
          />

          {current && assistant.status !== "idle" ? (
            <AnswerCard
              status={assistant.status}
              question={current.question}
              mode={current.mode}
              answer={assistant.answer}
              error={assistant.error}
              durationMs={assistant.durationMs}
              onRetry={() => submit(current)}
            />
          ) : (
            <EmptyState
              mode={mode}
              onPick={(example) => {
                setQuestion(example);
                submit({ question: example, mode });
              }}
            />
          )}
        </main>

        <aside className="lg:sticky lg:top-10 lg:self-start">
          <HistoryPanel
            items={historyItems}
            activeId={activeHistoryId}
            onSelect={openHistoryItem}
            onRemove={removeHistoryItem}
            onClear={historyStore.clear}
          />
        </aside>
      </div>

      <footer className="mt-10 text-center text-xs text-zinc-400">
        Ответы генерирует Claude и могут содержать неточности — проверяйте важное.
      </footer>
    </div>
  );
}
