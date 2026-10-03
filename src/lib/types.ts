export type ModeId = "explain" | "summarize" | "write" | "code";

export interface AskRequest {
  question: string;
  mode: ModeId;
}

export interface ApiErrorBody {
  error: string;
}

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  mode: ModeId;
  createdAt: number;
}
