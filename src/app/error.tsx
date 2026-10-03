"use client";

import { useEffect } from "react";
import { RetryIcon } from "@/components/icons";
import { primaryButtonClass, secondaryButtonClass, StatusScreen } from "@/components/StatusScreen";

interface ErrorPageProps {
  error: Error & { digest?: string };
  retry: () => void;
}

export default function ErrorPage({ error, retry }: ErrorPageProps) {
  useEffect(() => {
    console.error("[ui] page crashed:", error);
  }, [error]);

  return (
    <StatusScreen
      icon="🛠️"
      title="Что-то пошло не так"
      description="Интерфейс столкнулся с неожиданной ошибкой. История запросов сохранена — попробуйте ещё раз."
    >
      <button type="button" onClick={retry} className={primaryButtonClass}>
        <RetryIcon />
        Попробовать снова
      </button>
      <button type="button" onClick={() => window.location.reload()} className={secondaryButtonClass}>
        Обновить страницу
      </button>
    </StatusScreen>
  );
}
