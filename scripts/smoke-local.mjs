// Run against the local seeded demo only: node scripts/smoke-local.mjs
import assert from 'node:assert/strict';

const backend = 'http://127.0.0.1:8000';
const frontend = 'http://127.0.0.1:3000';
const request = (url, options = {}) => fetch(url, {
  signal: AbortSignal.timeout(15000), ...options,
});

assert.equal((await request(`${backend}/up`)).status, 200);
assert.equal((await request(`${frontend}/login`)).status, 200);
const catalog = await request(`${frontend}/api/student/courses/available`, {
  headers: { Accept: 'application/json' },
});
assert.equal(catalog.status, 200);
assert.ok(Array.isArray(await catalog.json()), 'Catalog must return an array');
assert.equal((await request(`${backend}/api/profile`, {
  headers: { Accept: 'application/json' },
})).status, 401);

for (const [email, role] of [
  ['hieu.student@mindnova.ai', 'student'],
  ['teacher@mindnova.ai', 'teacher'],
]) {
  const login = await request(`${backend}/api/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ email, password: 'password' }),
  });
  assert.equal(login.status, 200, `Login failed: ${email}`);
  const data = await login.json();
  assert.equal(data.user.role, role);
  assert.ok(data.access_token);
  const headers = { Accept: 'application/json', Authorization: `Bearer ${data.access_token}` };
  try {
    assert.equal((await request(`${backend}/api/profile`, { headers })).status, 200);
    assert.equal((await request(`${backend}/api/admin/users`, { headers })).status, 403);
    console.log(`PASS: ${role} login, profile, admin access denied`);
  } finally {
    const logout = await request(`${backend}/api/logout`, { method: 'POST', headers });
    assert.equal(logout.status, 200, 'Logout must revoke the smoke-test token');
  }
}
console.log('PASS: health, login page, catalog proxy, unauthenticated profile');
