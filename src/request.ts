import type { Operation, Parameter, ParameterSchema } from "./spec.js";

export const DEFAULT_API_BASE = "https://data.dydt.ai/v1";
export const DEFAULT_WS_URL = "wss://data.dydt.ai/ws";

const TRUSTED_HOST = /(^|\.)dydt\.ai$/;
const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1"]);

export type ParamValues = Record<string, string[]>;

export class UsageError extends Error {}

function trustedUrl(envName: string, fallback: string, secureProtocol: string): string {
  const configured = process.env[envName]?.trim();
  if (!configured) return fallback;
  const url = new URL(configured);
  const trusted =
    (url.protocol === secureProtocol && TRUSTED_HOST.test(url.hostname)) ||
    LOCAL_HOSTS.has(url.hostname);
  if (!trusted)
    throw new UsageError(`${envName} must be a ${secureProtocol}// dydt.ai host or localhost`);
  return configured.replace(/\/$/, "");
}

export const apiBase = (): string => trustedUrl("DYDT_API_BASE", DEFAULT_API_BASE, "https:");
export const wsUrl = (): string => trustedUrl("DYDT_WS_URL", DEFAULT_WS_URL, "wss:");

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

const SOLANA_ADDRESS_ALPHABET = "1-9A-HJ-NP-Za-km-z";

function patternProblem(name: string, pattern: string): string {
  if (pattern.includes(SOLANA_ADDRESS_ALPHABET))
    return `--${name} is not a valid Solana address (32 to 44 base58 characters)`;
  return `--${name} is not valid (expected ${pattern})`;
}

function checkValue(param: Parameter, value: string): string | null {
  const schema = valueSchema(param);
  const allowed = schema.enum?.map(String);
  if (allowed && !allowed.includes(value))
    return `--${param.name} must be one of: ${allowed.join(", ")}`;
  if (schema.pattern && !new RegExp(schema.pattern).test(value))
    return patternProblem(param.name, schema.pattern);
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

export function rejectUnknown(params: Parameter[], input: ParamValues, command: string): void {
  const known = new Set(params.map((param) => param.name));
  const unknown = Object.keys(input).filter((name) => !known.has(name));
  if (unknown.length === 0) return;
  throw new UsageError(
    `unknown option ${unknown.map((name) => `--${name}`).join(", ")} for ${command}. Run: dydt help ${command}`,
  );
}

function defaultValues(param: Parameter): string[] {
  if (param.schema.default === undefined) return [];
  return [String(param.schema.default)];
}

function missingProblem(param: Parameter, command: string): string {
  if (param.in === "path")
    return `missing <${param.name}>. Usage: dydt ${command} <${param.name}>`;
  return `--${param.name} is required for ${command}. Run: dydt help ${command}`;
}

export function validatedValues(param: Parameter, input: ParamValues, command: string): string[] {
  const given = splitValues(param, input[param.name] ?? []);
  if (given.length === 0 && param.required && param.schema.default === undefined)
    throw new UsageError(missingProblem(param, command));
  const values = given.length === 0 && param.required ? defaultValues(param) : given;
  if (values.length > 1 && !isArrayParam(param)) throw new UsageError(`--${param.name} takes one value`);
  const maxItems = param.schema.maxItems;
  if (maxItems !== undefined && values.length > maxItems)
    throw new UsageError(`--${param.name} takes at most ${maxItems} values`);
  for (const value of values) {
    const problem = checkValue(param, value);
    if (problem) throw new UsageError(problem);
  }
  return values;
}

export function buildUrl(base: string, operation: Operation, input: ParamValues): string {
  rejectUnknown(operation.parameters, input, operation.command);
  let path = operation.path;
  const query = new URLSearchParams();
  for (const param of operation.parameters) {
    const values = validatedValues(param, input, operation.command);
    if (values.length === 0) continue;
    if (param.in === "path") {
      path = path.replace(`{${param.name}}`, encodeURIComponent(values[0] ?? ""));
      continue;
    }
    if (param.explode === false) {
      query.append(param.name, values.join(","));
      continue;
    }
    for (const value of values) query.append(param.name, value);
  }
  const search = query.toString();
  if (!search) return `${base}${path}`;
  return `${base}${path}?${search}`;
}
