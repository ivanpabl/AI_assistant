import { useCallback, useRef, useState } from "react";
import type { ApiErrorBody, AskRequest } from "@/lib/types";

export type AskStatus = "idle" | "loading" | "streaming" | "done" | "stopped" | "error";

interface AskState {
  status: AskStatus;
  answer: string;
  error: string | null;
  durationMs: number | null;
}

const INITIAL: AskState = { status: "idle", answer: "", error: null, durationMs: null };

async function readError(response: Response): Promise<string> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    if (body.error) return body.error;
  } catch {}
  return `Ошибка сервера (${response.status})`;
}

export function useAskAI(onComplete?: (request: AskRequest, answer: string) => void) {
  const [state, setState] = useState<AskState>(INITIAL);
  const controllerRef = useRef<AbortController | null>(null);

  const ask = useCallback(
    async (request: AskRequest) => {
      const controller = new AbortController();
      const previous = controllerRef.current;
      controllerRef.current = controller;
      previous?.abort();
      const startedAt = performance.now();

      setState({ status: "loading", answer: "", error: null, durationMs: null });

      let answer = "";
      try {
        const response = await fetch("/api/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
          signal: controller.signal,
        }).catch((error: unknown) => {
          if (controller.signal.aborted) throw error;
          throw new Error("Не удалось связаться с сервером. Проверьте подключение");
        });

        if (response.status === 401) {
          window.location.replace("/login");
          throw new Error("Сессия истекла. Перенаправляем на страницу входа…");
        }

        if (!response.ok || !response.body) {
          throw new Error(await readError(response));
        }

        const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
        while (true) {
          const { done, value } = await reader.read().catch((error: unknown) => {
            if (controller.signal.aborted) throw error;
            throw new Error("Соединение прервалось, ответ получен не полностью. Попробуйте ещё раз");
          });
          if (done) break;
          answer += value;
          setState((s) => ({ ...s, status: "streaming", answer }));
        }

        if (!answer.trim()) throw new Error("Модель вернула пустой ответ. Попробуйте ещё раз");
      } catch (error) {
        if (controllerRef.current !== controller) return;
        controllerRef.current = null;
        if (controller.signal.aborted) {
          setState((s) => ({ ...s, status: "stopped" }));
          return;
        }
        const message = error instanceof Error ? error.message : "Неизвестная ошибка";
        setState({ status: "error", answer, error: message, durationMs: null });
        return;
      }

      if (controllerRef.current !== controller) return;
      controllerRef.current = null;
      setState({ status: "done", answer, error: null, durationMs: performance.now() - startedAt });
      onComplete?.(request, answer);
    },
    [onComplete],
  );

  const stop = useCallback(() => controllerRef.current?.abort(), []);

  const show = useCallback((answer: string) => {
    const current = controllerRef.current;
    controllerRef.current = null;
    current?.abort();
    setState({ status: "done", answer, error: null, durationMs: null });
  }, []);

  return { ...state, ask, stop, show };
}
