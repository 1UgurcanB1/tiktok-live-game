// apps/web/src/services/api.ts
import { env } from "../env";
import type {
  DBStatusEvent,
  GameConfig,
  LeaderboardDaily,
  Session,
  TikTokStatusEvent,
} from "@tiktok/types";

const BASE = env.VITE_API_BASE ?? "/";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export class ApiError extends Error {
  status: number;
  body?: unknown;
  constructor(message: string, status: number, body?: unknown) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

function u(path: string) {
  if (/^https?:\/\//i.test(BASE)) {
    return new URL(path, BASE).toString();
  }

  if (typeof window !== "undefined") {
    const baseUrl = new URL(BASE || "/", window.location.origin);
    return new URL(path, baseUrl).toString();
  }

  return path;
}

type ReqOpts = {
  signal?: AbortSignal;
  timeoutMs?: number;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
};

async function request<T>(
  method: Method,
  path: string,
  body?: unknown,
  opts: ReqOpts = {},
): Promise<T> {
  const { signal, timeoutMs = 10_000, headers, credentials } = opts;

  const controller = new AbortController();
  const to = setTimeout(() => controller.abort(), timeoutMs);
  const composite = mergeSignals(controller.signal, signal);

  const res = await fetch(u(path), {
    method,
    credentials,
    headers: {
      ...(body ? { "content-type": "application/json" } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: composite ?? undefined,
    cache: "no-store",
  }).catch((e) => {
    clearTimeout(to);
    throw new ApiError(e?.message ?? "network_error", 0);
  });

  clearTimeout(to);

  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson
    ? await res.json().catch(() => undefined)
    : await res.text();

  if (!res.ok) {
    throw new ApiError(`HTTP ${res.status}`, res.status, data);
  }
  return data as T;
}

function mergeSignals(a: AbortSignal, b?: AbortSignal) {
  if (!b) return a;
  const ctrl = new AbortController();
  const onAbort = () => ctrl.abort();
  if (a.aborted || b.aborted) ctrl.abort();
  a.addEventListener("abort", onAbort);
  b.addEventListener("abort", onAbort);
  return ctrl.signal;
}

export type ReadyResponse = { ready: boolean; db: boolean; tiktok: boolean };

export type TikTokStatus = {
  ok?: boolean;
  tiktok: { connected: boolean; username?: string | null };
};

export type CreateSessionBody = {
  gameId: string;
  totalRounds?: number;
};

export type SessionAction = "start" | "pause" | "resume" | "next" | "end";

export function getDBStatus(opts?: ReqOpts) {
  return request<DBStatusEvent>("GET", "/api/health", undefined, opts);
}

export function getTiktokStatus(opts?: ReqOpts) {
  return request<TikTokStatusEvent>(
    "GET",
    "/api/tiktok/status",
    undefined,
    opts,
  );
}

export function tiktokConnect(
  username: string,
  opts?: ReqOpts & { mode?: "real" | "sim" },
) {
  return request<TikTokStatusEvent>(
    "POST",
    "/api/tiktok/connect",
    { username, mode: opts?.mode },
    opts,
  );
}

export function tiktokDisconnect(opts?: ReqOpts) {
  return request<TikTokStatusEvent>(
    "POST",
    "/api/tiktok/disconnect",
    undefined,
    opts,
  );
}

export function getGames(opts?: ReqOpts) {
  return request<GameConfig[]>("GET", "/api/games", undefined, opts);
}

export function createSession(body: CreateSessionBody, opts?: ReqOpts) {
  return request<Session>("POST", "/api/sessions", body, opts);
}

export function getSession(id: string, opts?: ReqOpts) {
  return request<Session>("GET", `/api/sessions/${id}`, undefined, opts);
}

export function sessionAction(
  id: string,
  action: SessionAction,
  opts?: ReqOpts,
) {
  return request<Session>(
    "POST",
    `/api/sessions/${id}/${action}`,
    undefined,
    opts,
  );
}

export function getLeaderboardToday(opts?: ReqOpts) {
  return request<LeaderboardDaily>(
    "GET",
    "/api/leaderboard/today",
    undefined,
    opts,
  );
}
