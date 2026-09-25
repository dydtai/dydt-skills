import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const SPEC_URL = "https://dydt.ai/openapi.json";
const SPEC_TTL_MS = 24 * 60 * 60 * 1000;
const SPEC_TIMEOUT_MS = 5_000;

export interface ParameterSchema {
  type?: string;
  enum?: Array<string | number | boolean>;
  default?: string | number | boolean;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  items?: ParameterSchema;
}

export interface Parameter {
  name: string;
  in: "path" | "query";
  required: boolean;
  description?: string;
  schema: ParameterSchema;
}

export interface Operation {
  command: string;
  path: string;
  tag: string;
  summary: string;
  description: string;
  parameters: Parameter[];
}

interface RawOperation {
  operationId: string;
  tags?: string[];
  summary?: string;
  description?: string;
  parameters?: Parameter[];
}

interface OpenApiDocument {
  paths: Record<string, { get?: RawOperation }>;
}

interface CachedSpec {
  fetchedAt: number;
  spec: OpenApiDocument;
}

const cacheFile = (): string =>
  join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "dydt", "openapi.json");

const bundledFile = (): string =>
  join(dirname(fileURLToPath(import.meta.url)), "..", "spec", "openapi.json");

export function commandName(operationId: string): string {
  return operationId.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

export function operationsOf(spec: OpenApiDocument): Operation[] {
  return Object.entries(spec.paths).flatMap(([path, item]) => {
    const raw = item.get;
    if (!raw) return [];
    return [
      {
        command: commandName(raw.operationId),
        path,
        tag: raw.tags?.[0] ?? "Other",
        summary: raw.summary ?? "",
        description: raw.description ?? "",
        parameters: raw.parameters ?? [],
      },
    ];
  });
}

function isSpec(value: unknown): value is OpenApiDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { paths?: unknown }).paths === "object"
  );
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

async function readCache(): Promise<CachedSpec | null> {
  try {
    const cached = (await readJson(cacheFile())) as CachedSpec;
    if (!isSpec(cached.spec)) return null;
    return cached;
  } catch {
    return null;
  }
}

export async function fetchSpec(): Promise<OpenApiDocument> {
  const response = await fetch(SPEC_URL, {
    signal: AbortSignal.timeout(SPEC_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`spec fetch failed with HTTP ${response.status}`);
  const spec = await response.json();
  if (!isSpec(spec)) throw new Error("spec response is not an OpenAPI document");
  const file = cacheFile();
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify({ fetchedAt: Date.now(), spec }));
  return spec;
}

export async function loadSpec(): Promise<OpenApiDocument> {
  const cached = await readCache();
  if (cached && Date.now() - cached.fetchedAt < SPEC_TTL_MS) return cached.spec;
  try {
    return await fetchSpec();
  } catch {
    if (cached) return cached.spec;
    const bundled = await readJson(bundledFile());
    if (!isSpec(bundled)) throw new Error("bundled spec is unreadable");
    return bundled;
  }
}
