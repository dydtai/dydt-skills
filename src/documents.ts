import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const DOCUMENT_TTL_MS = 24 * 60 * 60 * 1000;
const DOCUMENT_TIMEOUT_MS = 5_000;

export interface DocumentSource<T> {
  name: string;
  url: string;
  isValid: (value: unknown) => value is T;
}

interface CachedDocument {
  fetchedAt: number;
  document: unknown;
}

const cacheFile = (name: string): string =>
  join(process.env.XDG_CACHE_HOME ?? join(homedir(), ".cache"), "dydt", `${name}.json`);

const bundledFile = (name: string): string =>
  join(dirname(fileURLToPath(import.meta.url)), "..", "spec", `${name}.json`);

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, "utf8"));
}

async function readCache<T>(source: DocumentSource<T>): Promise<{ fetchedAt: number; document: T } | null> {
  try {
    const cached = (await readJson(cacheFile(source.name))) as CachedDocument;
    if (!source.isValid(cached.document)) return null;
    return { fetchedAt: cached.fetchedAt, document: cached.document };
  } catch {
    return null;
  }
}

export async function fetchDocument<T>(source: DocumentSource<T>): Promise<T> {
  const response = await fetch(source.url, {
    signal: AbortSignal.timeout(DOCUMENT_TIMEOUT_MS),
    headers: { Accept: "application/json" },
  });
  if (!response.ok) throw new Error(`${source.url} returned HTTP ${response.status}`);
  const document: unknown = await response.json();
  if (!source.isValid(document)) throw new Error(`${source.url} is not a valid ${source.name} document`);
  const file = cacheFile(source.name);
  await mkdir(dirname(file), { recursive: true });
  await writeFile(file, JSON.stringify({ fetchedAt: Date.now(), document }));
  return document;
}

export async function loadDocument<T>(source: DocumentSource<T>): Promise<T> {
  const cached = await readCache(source);
  if (cached && Date.now() - cached.fetchedAt < DOCUMENT_TTL_MS) return cached.document;
  try {
    return await fetchDocument(source);
  } catch {
    if (cached) return cached.document;
    const bundled = await readJson(bundledFile(source.name));
    if (!source.isValid(bundled)) throw new Error(`bundled ${source.name} is unreadable`);
    return bundled;
  }
}
