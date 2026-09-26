import { describe, expect, it } from 'vitest';
import { ApiError, getErrorMessage, getValidationErrors, isUnauthorizedError, readApiResponse } from '../user-error';

describe('user-facing error messages', () => {
  it.each([500, 502, 503, 504])('hides upstream details for HTTP %i', status => {
    const text = getErrorMessage({ response: { status, data: { message: 'Application failed to respond', error: 'SQLSTATE secret' } } });
    expect(text).toMatch(/Hệ thống|phản hồi/);
    expect(text).toMatch(/thử lại/);
    expect(text).not.toMatch(/Application|SQLSTATE|secret/);
  });
  it.each([
    [401, /đăng nhập/], [403, /quyền/], [404, /không còn|không tìm thấy/i],
    [409, /thay đổi|xung đột/], [413, /Tệp|tệp/], [422, /kiểm tra/], [429, /chờ|quá nhiều/],
  ])('explains HTTP %i', (status, pattern) => {
    expect(getErrorMessage({ response: { status, data: {} } })).toMatch(pattern);
  });
  it('distinguishes network failure and timeout without assuming server success', () => {
    expect(getErrorMessage(new TypeError('Failed to fetch'))).toMatch(/kết nối/);
    expect(getErrorMessage({ code: 'ECONNABORTED', message: 'timeout of 1000ms exceeded' })).toMatch(/quá lâu/);
  });
  it('keeps useful Vietnamese business explanations', () => {
    expect(getErrorMessage({ response: { status: 422, data: { message: 'Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.' } } })).toBe('Mã xác nhận đã hết hạn. Vui lòng yêu cầu mã mới.');
    expect(getErrorMessage(new Error('Vui lòng chọn danh mục khóa học.'))).toBe('Vui lòng chọn danh mục khóa học.');
  });
  it.each([
    'SQLSTATE[HY000]: password=secret', '<html><body>502 Bad Gateway</body></html>',
    'Lỗi máy chủ: SQLSTATE[HY000] secret', 'Call to undefined method App\\Models\\User',
    'Không thể kết nối https://internal.example?token=secret', 'Unexpected token < in JSON',
  ])('does not show technical details: %s', message => {
    const result = getErrorMessage(new Error(message), 'Không thể lưu thay đổi. Vui lòng thử lại.');
    expect(result).not.toMatch(/SQLSTATE|secret|<html|App\\|https:\/\/internal|Unexpected token/);
    expect(result).toMatch(/Vui lòng|Hệ thống/);
  });
  it('translates Laravel field validation and preserves friendly field details', () => {
    const error = { response: { status: 422, data: { message: 'The given data was invalid.', errors: {
      email: ['The email field must be a valid email address.'], password: ['The password field must be at least 8 characters.'],
      otp: ['Mã xác nhận không đúng.'], name: ['SQLSTATE secret'],
    } } } };
    expect(getValidationErrors(error)).toMatchObject({ email: expect.stringMatching(/email/i), password: expect.stringMatching(/8/), otp: 'Mã xác nhận không đúng.' });
    expect(getErrorMessage(error)).not.toMatch(/The given|SQLSTATE|secret/);
  });
  it('keeps a safe explanation for a failed operation and adds recovery advice', () => {
    expect(getErrorMessage({ response: { status: 500, data: { message: 'Không thể lưu tỷ lệ' } } })).toBe('Không thể lưu tỷ lệ. Vui lòng thử lại sau ít phút.');
  });
  it('preserves login recovery when server transport drops custom status fields', () => {
    const original = new ApiError(401, { message: 'Unauthenticated.' });
    const transported = new Error(original.message);
    transported.name = original.name;
    expect(isUnauthorizedError(transported)).toBe(true);
    expect(getErrorMessage(transported)).toMatch(/đăng nhập/);
  });
  it('handles missing/malformed error objects', () => {
    for (const error of [null, undefined, {}, { message: { unexpected: true } }, { errors: { email: [null, {}] } }]) {
      expect(typeof getErrorMessage(error)).toBe('string');
      expect(getErrorMessage(error)).not.toMatch(/object Object|undefined/);
    }
  });
});

describe('fetch response handling', () => {
  it.each(['<html>Bad Gateway</html>', JSON.stringify({ message: 'Application failed to respond' })])('handles gateway body without a JSON parsing leak', async body => {
    try { await readApiResponse(new Response(body, { status: 502 })); throw new Error('expected rejection'); }
    catch (error) { expect(error).toBeInstanceOf(ApiError); expect((error as ApiError).status).toBe(502); expect(getErrorMessage(error)).toMatch(/tạm thời/); }
  });
  it('preserves validation fields and status', async () => {
    try { await readApiResponse(new Response(JSON.stringify({ errors: { email: ['The email field is required.'] } }), { status: 422 })); }
    catch (error) { expect((error as ApiError).status).toBe(422); expect(getValidationErrors(error).email).toMatch(/nhập|bắt buộc/); return; }
    throw new Error('expected validation rejection');
  });
  it('does not claim success on malformed successful data', async () => {
    await expect(readApiResponse(new Response('<html>proxy page</html>', { status: 200 }))).rejects.toThrow(/phản hồi/);
  });
  it('returns successful data unchanged and accepts 204', async () => {
    await expect(readApiResponse(new Response('{"success":true,"data":{"id":1}}'))).resolves.toEqual({ success: true, data: { id: 1 } });
    await expect(readApiResponse(new Response(null, { status: 204 }))).resolves.toEqual({});
  });
  it('explains Retry-After when available', async () => {
    await expect(readApiResponse(new Response('{}', { status: 429, headers: { 'Retry-After': '60' } }))).rejects.toThrow(/60 giây/);
  });
});
