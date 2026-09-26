import { fetchDocument, loadDocument, type DocumentSource } from "./documents.js";

export const SPEC_URL = "https://dydt.ai/openapi.json";

export interface ParameterSchema {
  type?: string;
  enum?: Array<string | number | boolean>;
  default?: string | number | boolean;
  pattern?: string;
  minimum?: number;
  maximum?: number;
  exclusiveMinimum?: number;
  maxItems?: number;
  items?: ParameterSchema;
}

export interface Parameter {
  name: string;
  in: "path" | "query";
  required: boolean;
  description?: string;
  explode?: boolean;
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

export interface OpenApiDocument {
  paths: Record<string, { get?: RawOperation }>;
}

function isOpenApi(value: unknown): value is OpenApiDocument {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as { paths?: unknown }).paths === "object"
  );
}

const OPENAPI: DocumentSource<OpenApiDocument> = {
  name: "openapi",
  url: SPEC_URL,
  isValid: isOpenApi,
};

export const loadSpec = (): Promise<OpenApiDocument> => loadDocument(OPENAPI);
export const fetchSpec = (): Promise<OpenApiDocument> => fetchDocument(OPENAPI);

const VERB_PREFIX = /^(get|list)_/;

export function commandName(operationId: string): string {
  return operationId.replace(VERB_PREFIX, "").replaceAll("_", "-");
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
