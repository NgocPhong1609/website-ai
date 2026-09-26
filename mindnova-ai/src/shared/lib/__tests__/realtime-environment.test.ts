import { afterEach, expect, it, vi } from 'vitest';
const { echo } = vi.hoisted(() => ({ echo: vi.fn() }));
vi.mock('laravel-echo', () => ({ default: class { constructor(options: unknown) { echo(options); } } }));
vi.mock('pusher-js', () => ({ default: {} }));
afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); echo.mockClear(); });
it.each(['https://backend.example', 'https://backend.example/api/', ''])('authenticates realtime on the API prefix: %s', async base => {
  vi.stubEnv('NEXT_PUBLIC_API_URL', base);
  vi.stubEnv('NEXT_PUBLIC_REVERB_HOST', 'chat.example');
  vi.stubEnv('NEXT_PUBLIC_REVERB_PORT', '8443');
  vi.stubEnv('NEXT_PUBLIC_REVERB_SCHEME', 'https');
  const { getEchoInstance } = await import('../../../hooks/useRealtimeChat');
  getEchoInstance('test-token');
  expect(echo).toHaveBeenCalledWith(expect.objectContaining({
    wsHost: 'chat.example', wssPort: 8443, forceTLS: true,
    authEndpoint: `${base ? 'https://backend.example' : ''}/api/broadcasting/auth`,
    auth: { headers: { Authorization: 'Bearer test-token' } },
  }));
});
