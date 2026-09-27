import { afterEach, describe, expect, it, vi } from 'vitest';

const { echo, disconnect, bindings } = vi.hoisted(() => ({
  echo: vi.fn(),
  disconnect: vi.fn(),
  bindings: {} as Record<string, (payload: { current: string }) => void>,
}));
vi.mock('laravel-echo', () => ({
  default: class {
    connector = { pusher: { connection: { bind: (event: string, cb: (payload: { current: string }) => void) => { bindings[event] = cb; } } } };
    constructor(options: unknown) { echo(options); }
    disconnect() { disconnect(); }
  },
}));
vi.mock('pusher-js', () => ({ default: {} }));

afterEach(async () => {
  const { resetRealtimeForTests } = await import('../realtime');
  resetRealtimeForTests();
  vi.unstubAllEnvs();
  vi.resetModules();
  echo.mockClear();
  disconnect.mockClear();
  for (const key of Object.keys(bindings)) delete bindings[key];
});

function stubReverb(host = 'chat.example', extra: Record<string, string> = {}) {
  vi.stubEnv('NEXT_PUBLIC_REVERB_APP_KEY', 'public-key');
  vi.stubEnv('NEXT_PUBLIC_REVERB_HOST', host);
  for (const [k, v] of Object.entries(extra)) vi.stubEnv(k, v);
}

describe('resolveRealtimeConfig', () => {
  it('is disabled unless the key and host are configured explicitly', async () => {
    const { resolveRealtimeConfig } = await import('../realtime');
    expect(resolveRealtimeConfig({}, { hostname: 'app.example', protocol: 'https:' })).toBeNull();
    expect(resolveRealtimeConfig({ key: 'k' }, { hostname: 'app.example', protocol: 'https:' })).toBeNull();
  });

  it('never points a deployed page at a loopback host', async () => {
    const { resolveRealtimeConfig } = await import('../realtime');
    const env = { key: 'k', host: '127.0.0.1', port: '8080' };
    expect(resolveRealtimeConfig(env, { hostname: 'website-mindnova-ai.vercel.app', protocol: 'https:' })).toBeNull();
    expect(resolveRealtimeConfig(env, { hostname: 'localhost', protocol: 'http:' })).toEqual({ key: 'k', host: '127.0.0.1', port: 8080, scheme: 'http' });
  });

  it('defaults the scheme and port from the page protocol', async () => {
    const { resolveRealtimeConfig } = await import('../realtime');
    expect(resolveRealtimeConfig({ key: 'k', host: 'ws.example' }, { hostname: 'app.example', protocol: 'https:' }))
      .toEqual({ key: 'k', host: 'ws.example', port: 443, scheme: 'https' });
  });
});

describe('getEchoInstance', () => {
  it.each(['https://backend.example', 'https://backend.example/api/', ''])('authenticates realtime on the API prefix: %s', async base => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', base);
    stubReverb('chat.example', { NEXT_PUBLIC_REVERB_PORT: '8443', NEXT_PUBLIC_REVERB_SCHEME: 'https' });
    const { getEchoInstance } = await import('../../../hooks/useRealtimeChat');
    getEchoInstance('test-token');
    expect(echo).toHaveBeenCalledWith(expect.objectContaining({
      key: 'public-key', wsHost: 'chat.example', wssPort: 8443, forceTLS: true,
      authEndpoint: `${base ? 'https://backend.example' : ''}/api/broadcasting/auth`,
      auth: { headers: { Authorization: 'Bearer test-token' } },
    }));
  });

  it('does not open a socket when Reverb is not configured', async () => {
    const { getEchoInstance } = await import('../../../hooks/useRealtimeChat');
    const { getRealtimeStatus } = await import('../realtime');
    expect(getEchoInstance('test-token')).toBeNull();
    expect(echo).not.toHaveBeenCalled();
    expect(getRealtimeStatus()).toBe('disabled');
  });

  it('gives up (and lets callers poll) when the server is unreachable', async () => {
    stubReverb();
    const { getEchoInstance } = await import('../../../hooks/useRealtimeChat');
    const { getRealtimeStatus } = await import('../realtime');
    expect(getEchoInstance('test-token')).not.toBeNull();
    expect(getRealtimeStatus()).toBe('connecting');

    bindings.state_change({ current: 'unavailable' });

    expect(getRealtimeStatus()).toBe('unavailable');
    expect(disconnect).toHaveBeenCalled();
    expect(getEchoInstance('test-token')).toBeNull();
    expect(echo).toHaveBeenCalledTimes(1);
  });

  it('reports connected and rebuilds the client when the token changes', async () => {
    stubReverb();
    const { getEchoInstance } = await import('../../../hooks/useRealtimeChat');
    const { getRealtimeStatus } = await import('../realtime');
    const first = getEchoInstance('token-a');
    bindings.state_change({ current: 'connected' });
    expect(getRealtimeStatus()).toBe('connected');
    expect(getEchoInstance('token-a')).toBe(first);

    getEchoInstance('token-b');
    expect(disconnect).toHaveBeenCalledTimes(1);
    expect(echo).toHaveBeenLastCalledWith(expect.objectContaining({ auth: { headers: { Authorization: 'Bearer token-b' } } }));
  });
});
