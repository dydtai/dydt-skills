import { rejectUnknown, validatedValues, type ParamValues } from "./request.js";
import type { Stream } from "./streams.js";

const AUTH_WAIT_MS = 5_000;
const PING_EVERY_MS = 15_000;

const CLOSE_REASONS: Record<number, string> = {
  4401: "The API key is invalid or revoked.",
  4402: "Streams need a paid plan; the Free plan is REST only. Upgrade at https://dydt.ai/developers/billing",
  4429: "Connection limit or monthly stream message allowance reached for this plan.",
};

export type StopReason = "max-events" | "time-limit" | "closed" | "error";

export interface WatchOptions {
  url: string;
  key: string;
  stream: Stream;
  payload: Record<string, unknown>;
  seconds: number;
  maxEvents: number;
  onEvent: (event: unknown) => void;
}

export interface WatchResult {
  events: number;
  stopped: StopReason;
  error?: { code?: number; message: string };
}

interface Frame {
  type?: string;
  status?: string;
  message?: string;
  stream?: string;
}

const SCALAR: Record<string, (value: string) => unknown> = {
  number: Number,
  integer: Number,
  boolean: (value) => value === "true",
};

function coerce(schemaType: string | undefined, values: string[]): unknown {
  if (schemaType === "array") return values;
  const convert = SCALAR[schemaType ?? ""];
  if (!convert) return values[0];
  return convert(values[0] ?? "");
}

export function buildPayload(stream: Stream, input: ParamValues): Record<string, unknown> {
  rejectUnknown(stream.fields, input, `watch ${stream.id}`);
  const entries = stream.fields.flatMap((field) => {
    const values = validatedValues(field, input, `watch ${stream.id}`);
    if (values.length === 0) return [];
    return [[field.name, coerce(field.schema.type, values)]];
  });
  return Object.fromEntries(entries);
}

function parse(data: unknown): Frame | null {
  if (typeof data !== "string") return null;
  try {
    return JSON.parse(data) as Frame;
  } catch {
    return null;
  }
}

export function watch(options: WatchOptions): Promise<WatchResult> {
  return new Promise((resolve) => {
    const socket = new WebSocket(options.url);
    let events = 0;
    let subscribed = false;
    let settled = false;
    let failed = false;
    const timers: NodeJS.Timeout[] = [];

    const finish = (result: WatchResult): void => {
      if (settled) return;
      settled = true;
      for (const timer of timers) clearTimeout(timer);
      if (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)
        socket.close(1000);
      resolve(result);
    };

    const send = (frame: object): void => {
      if (socket.readyState === WebSocket.OPEN) socket.send(JSON.stringify(frame));
    };

    const subscribe = (): void => {
      if (subscribed) return;
      subscribed = true;
      send({ type: "subscribe", stream: options.stream.id, payload: options.payload });
    };

    timers.push(setTimeout(() => finish({ events, stopped: "time-limit" }), options.seconds * 1000));
    const ping = setInterval(() => send({ type: "ping" }), PING_EVERY_MS);
    timers.push(ping);

    socket.addEventListener("open", () => {
      send({ type: "auth", key: options.key });
      timers.push(setTimeout(subscribe, AUTH_WAIT_MS));
    });

    socket.addEventListener("message", (message) => {
      const frame = parse(message.data);
      if (!frame) return;
      if (frame.type === "auth" && frame.status === "ok") return subscribe();
      if (frame.type === "pong") return;
      if (frame.type === "error")
        return finish({ events, stopped: "error", error: { message: frame.message ?? "Stream error" } });
      if (!frame.stream) return;
      events += 1;
      options.onEvent(frame);
      if (events >= options.maxEvents) finish({ events, stopped: "max-events" });
    });

    socket.addEventListener("close", (event) => {
      const message = CLOSE_REASONS[event.code];
      if (message) return finish({ events, stopped: "error", error: { code: event.code, message } });
      if (failed)
        return finish({ events, stopped: "error", error: { message: `Could not connect to ${options.url}` } });
      finish({ events, stopped: "closed" });
    });

    socket.addEventListener("error", () => {
      failed = true;
    });
  });
}
