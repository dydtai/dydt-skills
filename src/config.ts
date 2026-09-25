import { chmod, mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";

export const API_KEY_ENV = "DYDT_API_KEY";
export const KEYS_URL = "https://dydt.ai/developers/keys";

export const configFile = (): string =>
  join(process.env.XDG_CONFIG_HOME ?? join(homedir(), ".config"), "dydt", ".env");

function parseEnv(text: string): Record<string, string> {
  const entries = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .map((line) => {
      const at = line.indexOf("=");
      const value = line.slice(at + 1).trim().replace(/^["']|["']$/g, "");
      return [line.slice(0, at).trim(), value];
    });
  return Object.fromEntries(entries);
}

export async function readApiKey(): Promise<string | null> {
  const fromEnv = process.env[API_KEY_ENV]?.trim();
  if (fromEnv) return fromEnv;
  try {
    const stored = parseEnv(await readFile(configFile(), "utf8"))[API_KEY_ENV];
    return stored || null;
  } catch {
    return null;
  }
}

export async function saveApiKey(key: string): Promise<string> {
  const file = configFile();
  await mkdir(dirname(file), { recursive: true, mode: 0o700 });
  await writeFile(file, `${API_KEY_ENV}=${key}\n`, { mode: 0o600 });
  await chmod(file, 0o600);
  return file;
}
