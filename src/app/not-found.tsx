import type { Metadata } from "next";
import Link from "next/link";
import { primaryButtonClass, StatusScreen } from "@/components/StatusScreen";

export const metadata: Metadata = {
  title: "Страница не найдена — Team AI Assistant",
};

export default function NotFound() {
  return (
    <StatusScreen
      icon="🧭"
      title="Страница не найдена"
      description="Такого адреса нет. Возможно, ссылка устарела или в ней опечатка."
    >
      <Link href="/" className={primaryButtonClass}>
        К ассистенту
      </Link>
    </StatusScreen>
  );
}
