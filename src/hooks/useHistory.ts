import { useSyncExternalStore } from "react";
import { historyStore } from "@/lib/history";

export function useHistory() {
  return useSyncExternalStore(historyStore.subscribe, historyStore.getSnapshot, historyStore.getServerSnapshot);
}
