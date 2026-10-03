import Anthropic from "@anthropic-ai/sdk";
import { anthropic, MODEL, MAX_OUTPUT_TOKENS } from "@/lib/anthropic";
import { MAX_QUESTION_LENGTH } from "@/lib/config";
import { isModeId } from "@/lib/modes";
import { buildSystemPrompt } from "@/lib/prompts";
import { checkRateLimit, clientIp } from "@/lib/rate-limit";
import type { ApiErrorBody, AskRequest } from "@/lib/types";

function jsonError(status: number, error: string, headers?: HeadersInit) {
  return Response.json({ error } satisfies ApiErrorBody, { status, headers });
}

function parseBody(body: unknown): AskRequest | string {
  if (typeof body !== "object" || body === null) return "Некорректный запрос";
  const { question, mode } = body as Record<string, unknown>;
  if (typeof question !== "string" || !question.trim()) return "Введите вопрос";
  if (question.length > MAX_QUESTION_LENGTH) {
    return `Вопрос слишком длинный (максимум ${MAX_QUESTION_LENGTH} символов)`;
  }
  if (!isModeId(mode)) return "Неизвестный режим ассистента";
  return { question: question.trim(), mode };
}

function toUserError(error: unknown): { status: number; message: string } {
  if (error instanceof Anthropic.AuthenticationError) {
    return { status: 500, message: "Сервер не может авторизоваться в Claude API: проверьте ANTHROPIC_API_KEY" };
  }
  if (error instanceof Anthropic.RateLimitError) {
    return { status: 429, message: "Слишком много запросов к модели. Попробуйте через минуту" };
  }
  if (error instanceof Anthropic.BadRequestError) {
    return { status: 400, message: "Модель не смогла обработать запрос. Попробуйте переформулировать вопрос" };
  }
  if (error instanceof Anthropic.APIConnectionTimeoutError) {
    return { status: 504, message: "Сервис модели не ответил вовремя. Попробуйте ещё раз" };
  }
  if (error instanceof Anthropic.APIConnectionError) {
    return { status: 503, message: "Нет соединения с Claude API. Проверьте интернет и попробуйте ещё раз" };
  }
  if (error instanceof Anthropic.APIError) {
    return { status: 502, message: "Сервис модели временно недоступен. Попробуйте ещё раз" };
  }
  return { status: 500, message: "Что-то пошло не так. Попробуйте ещё раз" };
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return jsonError(500, "API-ключ не настроен: добавьте ANTHROPIC_API_KEY в .env.local и перезапустите сервер");
  }

  const limit = checkRateLimit(`ask:${clientIp(request)}`);
  if (!limit.ok) {
    return jsonError(429, `Слишком много запросов. Повторите через ${limit.retryAfterSec} с`, {
      "Retry-After": String(limit.retryAfterSec),
    });
  }

  const parsed = parseBody(await request.json().catch(() => null));
  if (typeof parsed === "string") return jsonError(400, parsed);

  const stream = anthropic.beta.messages.stream(
    {
      model: MODEL,
      max_tokens: MAX_OUTPUT_TOKENS,
      system: buildSystemPrompt(parsed.mode),
      messages: [{ role: "user", content: parsed.question }],
      output_config: { effort: "medium" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
    },
    { signal: request.signal },
  );

  const events = stream[Symbol.asyncIterator]();
  let first: IteratorResult<Anthropic.Beta.BetaRawMessageStreamEvent>;
  try {
    first = await events.next();
  } catch (error) {
    console.error("[api/ask] Claude API error:", error);
    const { status, message } = toUserError(error);
    return jsonError(status, message);
  }

  const encoder = new TextEncoder();
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      const push = (text: string) => controller.enqueue(encoder.encode(text));
      try {
        let result = first;
        while (!result.done) {
          const event = result.value;
          if (event.type === "content_block_delta" && event.delta.type === "text_delta") {
            push(event.delta.text);
          }
          result = await events.next();
        }

        const final = await stream.finalMessage();
        if (final.stop_reason === "max_tokens") {
          push("\n\n> ⚠️ Ответ обрезан по длине. Уточните вопрос, чтобы получить более сжатый ответ.");
        } else if (final.stop_reason === "refusal") {
          push("\n\n> ⚠️ Модель не может ответить на этот запрос. Попробуйте переформулировать его.");
        }
        controller.close();
      } catch (error) {
        if (request.signal.aborted) return controller.close();
        console.error("[api/ask] stream error:", error);
        controller.error(error);
      }
    },
    cancel() {
      stream.abort();
    },
  });

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "no-store",
    },
  });
}
