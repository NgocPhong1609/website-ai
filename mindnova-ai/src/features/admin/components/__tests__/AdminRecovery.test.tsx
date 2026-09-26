import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { AdminUsersManagementPage } from '../AdminUsersManagementPage';
import { adminApi } from '../../lib/admin-api';
import { axiosClient } from '@/src/shared/lib/axios';
vi.mock('../../lib/admin-api', () => ({ adminApi: vi.fn() }));
vi.mock('@/src/shared/lib/axios', () => ({ axiosClient: { get: vi.fn(), post: vi.fn() } }));
beforeEach(() => {
  vi.mocked(axiosClient.get).mockResolvedValue({ data: { remaining: 0 } });
  vi.mocked(adminApi).mockImplementation(async (path) => {
    if (path.startsWith('/admin/users?')) return { data: [{ id: 17, name: 'Student', email: 'student@example.com', role: 'student', status: 'active', is_locked: false }], summary: { teachers: 0, students: 1, guests: 0, locked: 0 } };
    return { reset_url: 'https://example.com/forgot-password#email=student%40example.com&recovery_code=test-private', expires_at: '2026-09-26T18:30:00Z' };
  });
});
afterEach(() => { cleanup(); vi.resetAllMocks(); });
it('collects verification and admin password before issuing a link, then clears it on close', async () => {
  render(<AdminUsersManagementPage />);
  fireEvent.click(await screen.findByRole('button', { name: 'Khôi phục mật khẩu' }));
  expect(screen.getByText(/không đủ.*xác minh/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: 'Cấp liên kết khôi phục' })).toBeDisabled();
  fireEvent.change(screen.getByLabelText('Mật khẩu quản trị viên'), { target: { value: 'AdminPass1!' } });
  fireEvent.change(screen.getByLabelText('Cách đã xác minh chủ tài khoản'), { target: { value: 'Đã đối chiếu thông tin giao dịch và kênh liên hệ được lưu trước đó.' } });
  fireEvent.click(screen.getByRole('button', { name: 'Cấp liên kết khôi phục' }));
  expect(await screen.findByLabelText('Liên kết khôi phục')).toHaveValue('https://example.com/forgot-password#email=student%40example.com&recovery_code=test-private');
  expect(adminApi).toHaveBeenCalledWith('/admin/users/17/password-recovery', expect.objectContaining({ method: 'POST', body: JSON.stringify({ current_password: 'AdminPass1!', verification_note: 'Đã đối chiếu thông tin giao dịch và kênh liên hệ được lưu trước đó.' }) }));
  fireEvent.click(screen.getByRole('button', { name: 'Đóng khôi phục' }));
  expect(screen.queryByLabelText('Liên kết khôi phục')).not.toBeInTheDocument();
});
