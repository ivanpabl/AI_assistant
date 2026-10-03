import type { ModeId } from "./types";

export interface ModeMeta {
  id: ModeId;
  label: string;
  icon: string;
  hint: string;
  placeholder: string;
  examples: string[];
}

export const MODES: ModeMeta[] = [
  {
    id: "explain",
    label: "Объяснить",
    icon: "💡",
    hint: "Разобраться в термине, технологии или процессе",
    placeholder: "Например: чем отличается REST от GraphQL и когда что выбирать?",
    examples: [
      "Что такое технический долг и как объяснить его менеджеру?",
      "Чем Kanban отличается от Scrum?",
      "Как работает OAuth 2.0 простыми словами?",
    ],
  },
  {
    id: "summarize",
    label: "Саммари",
    icon: "📝",
    hint: "Сжать длинный текст, переписку или заметки встречи",
    placeholder: "Вставьте текст встречи, треда или документа — получите выжимку и action items",
    examples: [
      "Сделай саммари: обсудили релиз 2.3, Аня берёт фикс оплаты до пятницы, Олег — ревью дизайна, релиз сдвигаем на вторник из-за бага в авторизации.",
    ],
  },
  {
    id: "write",
    label: "Написать",
    icon: "✉️",
    hint: "Письмо, сообщение в чат, анонс или ответ клиенту",
    placeholder: "Например: напиши в общий чат, что релиз переносится на вторник",
    examples: [
      "Напиши в чат команды, что релиз переносится на вторник из-за бага",
      "Вежливо откажи клиенту в срочной доработке до конца спринта",
    ],
  },
  {
    id: "code",
    label: "Код",
    icon: "🧑‍💻",
    hint: "Ревью, поиск бага, пример реализации",
    placeholder: "Вставьте код или опишите задачу — разберу, найду проблемы, предложу решение",
    examples: [
      "Как в TypeScript сделать debounce с корректной типизацией?",
      "Почему useEffect в React вызывается дважды в dev-режиме?",
    ],
  },
];

export const DEFAULT_MODE: ModeId = "explain";

export function getMode(id: ModeId): ModeMeta {
  return MODES.find((m) => m.id === id) ?? MODES[0];
}

export function isModeId(value: unknown): value is ModeId {
  return MODES.some((m) => m.id === value);
}
