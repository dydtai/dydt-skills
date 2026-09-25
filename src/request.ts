import type { Operation, Parameter, ParameterSchema } from "./spec.js";

export const DEFAULT_API_BASE = "https://data.dydt.ai/v1";

const TRUSTED_API_HOST = /(^|\.)dydt\.ai$/;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export type ParamValues = Record<string, string[]>;

export class UsageError extends Error {}

export function apiBase(): string {
  const configured = process.env.DYDT_API_BASE?.trim();
  if (!configured) return DEFAULT_API_BASE;
  const url = new URL(configured);
  const trusted =
    (url.protocol === "https:" && TRUSTED_API_HOST.test(url.hostname)) ||
    LOCAL_HOSTS.has(url.hostname);
  if (!trusted) throw new UsageError("DYDT_API_BASE must be an https dydt.ai host or localhost");
  return configured.replace(/\/$/, "");
}

function isArrayParam(param: Parameter): boolean {
  return param.schema.type === "array";
}

function valueSchema(param: Parameter): ParameterSchema {
  if (isArrayParam(param)) return param.schema.items ?? {};
  return param.schema;
}

function checkNumber(name: string, value: string, schema: ParameterSchema): string | null {
  const number = Number(value);
  if (!Number.isFinite(number)) return `--${name} must be a number`;
  if (schema.type === "integer" && !Number.isInteger(number)) return `--${name} must be an integer`;
  if (schema.minimum !== undefined && number < schema.minimum)
    return `--${name} must be at least ${schema.minimum}`;
  if (schema.maximum !== undefined && number > schema.maximum)
    return `--${name} must be at most ${schema.maximum}`;
  if (schema.exclusiveMinimum !== undefined && number <= schema.exclusiveMinimum)
    return `--${name} must be greater than ${schema.exclusiveMinimum}`;
  return null;
}

function checkValue(param: Parameter, value: string): string | null {
  const schema = valueSchema(param);
  const allowed = schema.enum?.map(String);
  if (allowed && !allowed.includes(value))
    return `--${param.name} must be one of: ${allowed.join(", ")}`;
  if (schema.pattern && !new RegExp(schema.pattern).test(value))
    return `--${param.name} is not valid (expected ${schema.pattern})`;
  if (schema.type === "integer" || schema.type === "number")
    return checkNumber(param.name, value, schema);
  if (schema.type === "boolean" && value !== "true" && value !== "false")
    return `--${param.name} must be true or false`;
  return null;
}

function splitValues(param: Parameter, values: string[]): string[] {
  if (!isArrayParam(param)) return values;
  return values.flatMap((value) => value.split(",")).map((value) => value.trim()).filter(Boolean);
}

export function buildUrl(base: string, operation: Operation, input: ParamValues): string {
  const known = new Set(operation.parameters.map((param) => param.name));
  const unknown = Object.keys(input).filter((name) => !known.has(name));
  if (unknown.length > 0)
    throw new UsageError(
      `unknown option ${unknown.map((name) => `--${name}`).join(", ")} for ${operation.command}. Run: dydt help ${operation.command}`,
    );

  let path = operation.path;
  const query = new URLSearchParams();
  for (const param of operation.parameters) {
    const values = splitValues(param, input[param.name] ?? []);
    if (values.length === 0) {
      if (param.required) throw new UsageError(`--${param.name} is required for ${operation.command}`);
      continue;
    }
    if (values.length > 1 && !isArrayParam(param))
      throw new UsageError(`--${param.name} takes one value`);
    for (const value of values) {
      const problem = checkValue(param, value);
      if (problem) throw new UsageError(problem);
    }
    if (param.in === "path") {
      path = path.replace(`{${param.name}}`, encodeURIComponent(values[0] ?? ""));
      continue;
    }
    for (const value of values) query.append(param.name, value);
  }
  const search = query.toString();
  if (!search) return `${base}${path}`;
  return `${base}${path}?${search}`;
}
