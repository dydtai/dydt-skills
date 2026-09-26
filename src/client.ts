import { createRequire } from "node:module";

const REQUEST_TIMEOUT_MS = 30_000;

const { version } = createRequire(import.meta.url)("../package.json") as { version: string };
export const CLI_VERSION = version;

export interface ApiError {
  http: number;
  code: number | null;
  error: string | null;
  message: string;
  retry_after_seconds?: number;
  quota_remaining?: number;
}

export interface Pagination {
  next_cursor: string | null;
  has_more: boolean;
}

export type ApiResult =
  | {
      ok: true;
      data: unknown;
      pagination: Pagination | null;
      quotaRemaining: number | null;
      quotaLimit: number | null;
    }
  | { ok: false; error: ApiError };

interface Envelope {
  code?: number;
  error?: string | null;
  message?: string;
  data?: unknown;
  pagination?: Pagination;
}

const SUCCESS_CODE = 0;

function numberHeader(headers: Headers, name: string): number | null {
  const raw = headers.get(name);
  if (raw === null || raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  return value;
}

function retryAfter(headers: Headers): number | undefined {
  return numberHeader(headers, "retry-after") ?? numberHeader(headers, "ratelimit-reset") ?? undefined;
}

async function parseEnvelope(response: Response): Promise<Envelope | null> {
  try {
    return (await response.json()) as Envelope;
  } catch {
    return null;
  }
}

export async function callApi(url: string, apiKey: string): Promise<ApiResult> {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      Accept: "application/json",
      "User-Agent": `dydt-cli/${CLI_VERSION}`,
    },
    signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
  });
  const body = await parseEnvelope(response);
  const quotaRemaining = numberHeader(response.headers, "x-quota-remaining");
  if (response.ok && body?.code === SUCCESS_CODE) {
    return {
      ok: true,
      data: body.data ?? null,
      pagination: body.pagination ?? null,
      quotaRemaining,
      quotaLimit: numberHeader(response.headers, "x-quota-limit"),
    };
  }
  const error: ApiError = {
    http: response.status,
    code: body?.code ?? null,
    error: body?.error ?? null,
    message: body?.message || response.statusText || "Request failed",
  };
  if (response.status === 429) error.retry_after_seconds = retryAfter(response.headers);
  if (quotaRemaining !== null) error.quota_remaining = quotaRemaining;
  return { ok: false, error };
}
