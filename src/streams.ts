import { fetchDocument, loadDocument, type DocumentSource } from "./documents.js";
import type { Parameter, ParameterSchema } from "./spec.js";

export const STREAMS_URL = "https://dydt.ai/asyncapi.json";

export interface Stream {
  id: string;
  title: string;
  summary: string;
  description: string;
  fields: Parameter[];
}

interface PayloadSchema {
  required?: string[];
  properties?: Record<string, ParameterSchema & { description?: string }>;
}

interface RawMessage {
  title?: string;
  summary?: string;
  description?: string;
  payload?: { properties?: { payload?: PayloadSchema } };
}

export interface AsyncApiDocument {
  components: { messages: Record<string, RawMessage> };
}

const SUBSCRIBE_PREFIX = "subscribe_";

function isAsyncApi(value: unknown): value is AsyncApiDocument {
  const messages = (value as { components?: { messages?: unknown } } | null)?.components?.messages;
  return typeof messages === "object" && messages !== null;
}

const ASYNCAPI: DocumentSource<AsyncApiDocument> = {
  name: "asyncapi",
  url: STREAMS_URL,
  isValid: isAsyncApi,
};

export const loadStreamSpec = (): Promise<AsyncApiDocument> => loadDocument(ASYNCAPI);
export const fetchStreamSpec = (): Promise<AsyncApiDocument> => fetchDocument(ASYNCAPI);

function fieldsOf(payload: PayloadSchema | undefined): Parameter[] {
  const required = new Set(payload?.required ?? []);
  return Object.entries(payload?.properties ?? {}).map(([name, schema]) => ({
    name,
    in: "query",
    required: required.has(name),
    description: schema.description,
    schema,
  }));
}

export function streamsOf(document: AsyncApiDocument): Stream[] {
  return Object.entries(document.components.messages)
    .filter(([key]) => key.startsWith(SUBSCRIBE_PREFIX))
    .map(([key, message]) => ({
      id: key.slice(SUBSCRIBE_PREFIX.length),
      title: (message.title ?? key).replace(/^Subscribe:\s*/, ""),
      summary: message.summary ?? "",
      description: message.description ?? "",
      fields: fieldsOf(message.payload?.properties?.payload),
    }));
}
