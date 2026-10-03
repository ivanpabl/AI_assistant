import { HISTORY_LIMIT } from "./config";
import { isModeId } from "./modes";
import type { HistoryItem } from "./types";

const STORAGE_KEY = "team-ai-assistant:history";
const EMPTY: HistoryItem[] = [];

let cache: HistoryItem[] | null = null;
const listeners = new Set<() => void>();

function createId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function isHistoryItem(value: unknown): value is HistoryItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "string" &&
    typeof v.question === "string" &&
    typeof v.answer === "string" &&
    typeof v.createdAt === "number" &&
    isModeId(v.mode)
  );
}

function read(): HistoryItem[] {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter(isHistoryItem).slice(0, HISTORY_LIMIT) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function write(items: HistoryItem[]) {
  cache = items;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {}
  listeners.forEach((notify) => notify());
}

export const historyStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY) return;
      cache = null;
      listener();
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners.delete(listener);
      window.removeEventListener("storage", onStorage);
    };
  },

  getSnapshot(): HistoryItem[] {
    cache ??= read();
    return cache;
  },

  getServerSnapshot(): HistoryItem[] {
    return EMPTY;
  },

  add(item: Omit<HistoryItem, "id" | "createdAt">): HistoryItem {
    const entry: HistoryItem = { ...item, id: createId(), createdAt: Date.now() };
    write([entry, ...historyStore.getSnapshot()].slice(0, HISTORY_LIMIT));
    return entry;
  },

  remove(id: string) {
    write(historyStore.getSnapshot().filter((i) => i.id !== id));
  },

  clear() {
    write(EMPTY);
  },
};
