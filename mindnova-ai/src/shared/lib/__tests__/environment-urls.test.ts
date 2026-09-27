import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiUrl } from '../api-url';

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules(); });

describe('API URLs across environments', () => {
  it.each([
    ['http://127.0.0.1:8000', '/api/login', 'http://127.0.0.1:8000/api/login'],
    ['https://backend.example/api/', '/api/login', 'https://backend.example/api/login'],
    ['https://backend.example/', 'login', 'https://backend.example/api/login'],
    ['https://backend.example/gateway/api/', '/api/chat?limit=2', 'https://backend.example/gateway/api/chat?limit=2'],
    ['', '/api/login', '/api/login'],
    ['/api/', '/login', '/api/login'],
    ['', '/apiary', '/api/apiary'],
    ['https://backend.example/api', '', 'https://backend.example/api'],
  ])('%s + %s', (base, endpoint, expected) => {
    expect(apiUrl(base, endpoint)).toBe(expected);
  });

  it.each(['https://backend.example', 'https://backend.example/api/'])('uses one API prefix for proxy and server calls: %s', async (base) => {
    vi.stubEnv('BACKEND_URL', base);
    const { default: config } = await import('../../../../next.config');
    const rewrites = await (config.rewrites as () => Promise<unknown>)();
    expect(rewrites).toEqual([{ source: '/api/:path*', destination: 'https://backend.example/api/:path*' }]);
  });

  it('does not override environment-specific websocket settings in Next config', async () => {
    const { default: config } = await import('../../../../next.config');
    expect(config.env?.NEXT_PUBLIC_REVERB_HOST).toBeUndefined();
    expect(config.env?.NEXT_PUBLIC_REVERB_PORT).toBeUndefined();
    expect(config.env?.NEXT_PUBLIC_REVERB_SCHEME).toBeUndefined();
  });

  it.each(['https://backend.example', 'https://backend.example/api/', ''])('axios requests keep auth and the configured API root: %s', async (base) => {
    vi.stubEnv('NEXT_PUBLIC_API_URL', base);
    localStorage.setItem('accessToken', 'test-token');
    const { axiosClient } = await import('../axios');
    const response = await axiosClient.get('/api/student/check-in', { adapter: async config => ({
      config, data: { url: axiosClient.getUri(config), token: config.headers.Authorization },
      status: 200, statusText: 'OK', headers: {},
    }) });
    expect(response.data).toEqual({ url: `${base ? 'https://backend.example' : ''}/api/student/check-in`, token: 'Bearer test-token' });
    localStorage.removeItem('accessToken');
  });
});
