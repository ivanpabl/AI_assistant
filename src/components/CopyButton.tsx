"use client";

import { useEffect, useState } from "react";
import { copyToClipboard } from "@/lib/clipboard";
import { CheckIcon, CopyIcon } from "./icons";

type CopyState = "idle" | "copied" | "failed";

interface CopyButtonProps {
  text: string;
  label?: string;
  variant?: "solid" | "ghost";
}

const VARIANT_CLASSES = {
  solid: {
    base: "rounded-lg px-3 py-1.5 text-sm bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700",
    copied: "rounded-lg px-3 py-1.5 text-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  ghost: {
    base: "rounded-md px-2 py-0.5 text-xs text-zinc-400 hover:text-white",
    copied: "rounded-md px-2 py-0.5 text-xs text-emerald-400",
  },
};

export function CopyButton({ text, label = "Копировать", variant = "solid" }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = setTimeout(() => setState("idle"), 2000);
    return () => clearTimeout(timer);
  }, [state]);

  const handleClick = async () => {
    setState((await copyToClipboard(text)) ? "copied" : "failed");
  };

  const caption = state === "copied" ? "Скопировано" : state === "failed" ? "Не удалось" : label;

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={!text}
      aria-live="polite"
      className={`inline-flex items-center gap-1.5 font-medium transition disabled:cursor-not-allowed disabled:opacity-50
        ${VARIANT_CLASSES[variant][state === "copied" ? "copied" : "base"]}`}
    >
      {state === "copied" ? <CheckIcon /> : <CopyIcon />}
      {caption}
    </button>
  );
}
