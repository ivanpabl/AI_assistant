import "server-only";
import Anthropic from "@anthropic-ai/sdk";

export const MODEL = process.env.ANTHROPIC_MODEL || "claude-opus-5";

export const MAX_OUTPUT_TOKENS = 8192;

export const anthropic = new Anthropic();
