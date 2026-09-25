import { createRequire } from "node:module";

const REQUEST_TIMEOUT_MS = 30_000;

const { version } = createRequire(import.meta.url)("../package.json") as { version: string };
export const CLI_VERSION = version;

export interface ApiError {
  http: number;
  code: number | null;
  message: string;
  retry_after_seconds?: number;
  quota_remaining?: number;
}

export type ApiResult =
  | { ok: true; data: unknown; totalCount: number | null; quotaRemaining: number | null; quotaLimit: number | null }
  | { ok: false; error: ApiError };

interface Envelope {
  status?: { statusMessage?: string; statusCode?: number; totalCount?: number };
  data?: unknown;
}

function numberHeader(headers: Headers, name: string): number | null {
  const raw = headers.get(name);
  if (raw === null || raw === "") return null;
  const value = Number(raw);
  if (!Number.isFinite(value)) return null;
  return value;
}

function retryAfter(headers: Headers): number | undefined {
  const seconds = numberHeader(headers, "retry-after");
  if (seconds !== null) return seconds;
  const reset = numberHeader(headers, "x-ratelimit-reset");
  if (reset === null) return undefined;
  const nowSeconds = Math.floor(Date.now() / 1000);
  if (reset > nowSeconds) return reset - nowSeconds;
  return Math.max(0, Math.ceil(reset));
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
  if (response.ok && body) {
    return {
      ok: true,
      data: body.data ?? null,
      totalCount: body.status?.totalCount ?? null,
      quotaRemaining,
      quotaLimit: numberHeader(response.headers, "x-quota-limit"),
    };
  }
  const error: ApiError = {
    http: response.status,
    code: body?.status?.statusCode ?? null,
    message: body?.status?.statusMessage ?? response.statusText ?? "Request failed",
  };
  if (response.status === 429) error.retry_after_seconds = retryAfter(response.headers);
  if (quotaRemaining !== null) error.quota_remaining = quotaRemaining;
  return { ok: false, error };
}
