"use client";

import ReactMarkdown, { type Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { CopyButton } from "./CopyButton";

const components: Components = {
  pre({ children, node }) {
    const code = node?.children[0];
    const className =
      code?.type === "element" && Array.isArray(code.properties.className)
        ? code.properties.className.join(" ")
        : "";
    const language = /language-([\w-]+)/.exec(className)?.[1];
    const rawText = extractText(code);

    return (
      <div className="not-prose my-4 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-950 dark:border-zinc-800">
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-1.5 text-xs text-zinc-400">
          <span>{language ?? "code"}</span>
          <CopyButton text={rawText} label="Код" variant="ghost" />
        </div>
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed">{children}</pre>
      </div>
    );
  },
  a({ children, href }) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto">
        <table>{children}</table>
      </div>
    );
  },
};

type HastNode = { type: string; value?: string; children?: HastNode[] } | undefined;

function extractText(node: HastNode): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(extractText).join("");
}

export function Markdown({ content }: { content: string }) {
  return (
    <div className="prose prose-zinc max-w-none dark:prose-invert prose-headings:font-semibold prose-h3:mt-6 prose-h3:text-base prose-p:leading-relaxed prose-a:text-indigo-600 dark:prose-a:text-indigo-400 prose-code:rounded prose-code:bg-zinc-100 prose-code:px-1 prose-code:py-0.5 prose-code:font-normal prose-code:before:content-none prose-code:after:content-none dark:prose-code:bg-zinc-800 prose-blockquote:border-indigo-400 prose-blockquote:not-italic">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
