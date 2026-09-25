const HIDDEN_CHARACTERS =
  /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F-\u009F​-‏‪-‮⁠-⁤⁦-⁯﻿]/g;

const INSTRUCTION_PATTERNS: readonly RegExp[] = [
  /\b(ignore|disregard|forget|override)\b[^.\n]{0,40}\b(previous|prior|above|earlier|all|any|your)\b[^.\n]{0,40}\b(instructions?|rules|prompts?|guidelines|messages?)\b/gi,
  /\[\s*(system|assistant|developer|admin)\s*\]/gi,
  /<\/?\s*(system|assistant|developer|instructions?|tool_call|function_call)\b[^>]*>/gi,
  /^\s*(system|assistant|developer)\s*:/gim,
  /\byou\s+are\s+now\b/gi,
  /\bnew\s+instructions?\s*:/gi,
];

export const FILTERED = "[filtered]";

export interface SanitizeResult<T> {
  value: T;
  neutralized: number;
}

function cleanString(text: string, counter: { count: number }): string {
  const cleaned = INSTRUCTION_PATTERNS.reduce(
    (current, pattern) => current.replace(pattern, FILTERED),
    text.replace(HIDDEN_CHARACTERS, ""),
  );
  if (cleaned !== text) counter.count += 1;
  return cleaned;
}

function walk(value: unknown, counter: { count: number }): unknown {
  if (typeof value === "string") return cleanString(value, counter);
  if (Array.isArray(value)) return value.map((item) => walk(item, counter));
  if (typeof value === "object" && value !== null) {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, walk(item, counter)]),
    );
  }
  return value;
}

export function sanitize<T>(value: T): SanitizeResult<T> {
  const counter = { count: 0 };
  const cleaned = walk(value, counter) as T;
  return { value: cleaned, neutralized: counter.count };
}
