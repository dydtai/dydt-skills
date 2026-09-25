import type { ParamValues } from "./request.js";

export const FLAGS = ["raw", "help"] as const;
export type Flag = (typeof FLAGS)[number];

export interface ParsedArgs {
  positionals: string[];
  params: ParamValues;
  flags: Set<Flag>;
}

function isFlag(name: string): name is Flag {
  return (FLAGS as readonly string[]).includes(name);
}

export function parseArgs(argv: readonly string[]): ParsedArgs {
  const positionals: string[] = [];
  const params: ParamValues = {};
  const flags = new Set<Flag>();
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index] ?? "";
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }
    const body = token.slice(2);
    const equals = body.indexOf("=");
    if (equals !== -1) {
      addParam(params, body.slice(0, equals), body.slice(equals + 1));
      continue;
    }
    if (isFlag(body)) {
      flags.add(body);
      continue;
    }
    index += 1;
    const value = argv[index];
    if (value === undefined) throw new Error(`--${body} needs a value`);
    addParam(params, body, value);
  }
  return { positionals, params, flags };
}

function addParam(params: ParamValues, name: string, value: string): void {
  params[name] = [...(params[name] ?? []), value];
}
