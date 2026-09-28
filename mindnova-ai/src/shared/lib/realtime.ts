import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { clientApiUrl } from "./api-url";

/**
 * Realtime (Laravel Reverb via Echo) is optional. It is only enabled when the
 * public Reverb env vars are set explicitly, and it never points a deployed
 * site at a loopback host (that would try to reach the visitor's own machine).
 * When realtime is disabled or the socket cannot connect, callers fall back to
 * polling — see `useRealtimeStatus`.
 */

export interface RealtimeConfig {
  key: string;
  host: string;
  port: number;
  scheme: "http" | "https";
}

export type RealtimeStatus = "disabled" | "connecting" | "connected" | "unavailable";

const LOOPBACK_HOSTS = new Set(["localhost", "127.0.0.1", "::1", "[::1]", "0.0.0.0"]);
/** Consecutive socket errors tolerated before giving up for this page session. */
const MAX_CONNECTION_ERRORS = 2;

export function isLoopbackHost(host: string): boolean {
  return LOOPBACK_HOSTS.has(host.trim().toLowerCase());
}

interface RealtimeEnv {
  key?: string;
  host?: string;
  port?: string;
  scheme?: string;
}

// Next.js only inlines NEXT_PUBLIC_* when accessed literally, so read them here.
function readEnv(): RealtimeEnv {
  return {
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    host: process.env.NEXT_PUBLIC_REVERB_HOST,
    port: process.env.NEXT_PUBLIC_REVERB_PORT,
    scheme: process.env.NEXT_PUBLIC_REVERB_SCHEME,
  };
}

export function resolveRealtimeConfig(
  env: RealtimeEnv = readEnv(),
  pageLocation: Pick<Location, "hostname" | "protocol"> | null = typeof window !== "undefined" ? window.location : null,
): RealtimeConfig | null {
  const key = env.key?.trim();
  const host = env.host?.trim();
  if (!key || !host) return null;

  // A deployed page can never reach a Reverb server on the visitor's loopback.
  if (isLoopbackHost(host) && pageLocation && !isLoopbackHost(pageLocation.hostname)) return null;

  const scheme: "http" | "https" =
    env.scheme === "https" || env.scheme === "http"
      ? env.scheme
      : pageLocation?.protocol === "https:"
        ? "https"
        : "http";
  const parsedPort = Number(env.port);
  const port = Number.isInteger(parsedPort) && parsedPort > 0 ? parsedPort : scheme === "https" ? 443 : 8080;

  return { key, host, port, scheme };
}

// ─── Status store (shared by every hook on the page) ─────────────────────────

let status: RealtimeStatus = "disabled";
const listeners = new Set<() => void>();

function setStatus(next: RealtimeStatus) {
  if (status === next) return;
  status = next;
  listeners.forEach((listener) => listener());
}

export function getRealtimeStatus(): RealtimeStatus {
  return status;
}

export function subscribeRealtimeStatus(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

// ─── Echo singleton ──────────────────────────────────────────────────────────

let echo: Echo<"reverb"> | null = null;
let echoToken: string | null = null;
let gaveUp = false;

function teardown() {
  echo?.disconnect();
  echo = null;
  echoToken = null;
}

/**
 * Echo client for the current token, or null when realtime is disabled or the
 * server was unreachable earlier in this page session.
 */
export function getEcho(token: string): Echo<"reverb"> | null {
  if (typeof window === "undefined" || gaveUp) return null;

  const config = resolveRealtimeConfig();
  if (!config) {
    setStatus("disabled");
    return null;
  }
  if (echo && echoToken === token) return echo;
  teardown();

  (window as unknown as { Pusher: typeof Pusher }).Pusher = Pusher;
  Pusher.logToConsole = process.env.NEXT_PUBLIC_ENABLE_PUSHER_LOGS === "true";
  const tls = config.scheme === "https";

  echo = new Echo({
    broadcaster: "reverb",
    key: config.key,
    wsHost: config.host,
    wsPort: config.port,
    wssPort: config.port,
    forceTLS: tls,
    disableStats: true,
    enabledTransports: tls ? ["ws", "wss"] : ["ws"],
    authEndpoint: clientApiUrl("broadcasting/auth"),
    auth: { headers: { Authorization: `Bearer ${token}` } },
  });
  echoToken = token;
  setStatus("connecting");

  const connection = (echo.connector as unknown as { pusher?: { connection?: PusherConnection } }).pusher?.connection;
  if (connection) {
    let errors = 0;
    const giveUp = () => {
      gaveUp = true;
      teardown();
      setStatus("unavailable");
    };
    connection.bind("state_change", ({ current }: { current: string }) => {
      if (current === "connected") {
        errors = 0;
        setStatus("connected");
      } else if (current === "unavailable" || current === "failed") {
        giveUp();
      } else if (current === "connecting" && status !== "connected") {
        setStatus("connecting");
      }
    });
    connection.bind("error", () => {
      errors += 1;
      if (errors >= MAX_CONNECTION_ERRORS && status !== "connected") giveUp();
    });
  }

  return echo;
}

interface PusherConnection {
  bind(event: string, callback: (payload: { current: string }) => void): void;
}

/** Test helper: forget the singleton and status between tests. */
export function resetRealtimeForTests() {
  teardown();
  gaveUp = false;
  status = "disabled";
  listeners.clear();
}
