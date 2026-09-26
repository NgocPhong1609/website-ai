import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { SecurityPanel } from '../OtherPanels';
import { axiosClient } from '@/src/shared/lib/axios';

vi.mock('@/src/shared/lib/axios', () => ({ axiosClient: { get: vi.fn(), post: vi.fn() } }));
const savedCodes = ['1111-2222-3333-4444-5555-6666-7777-8888', 'aaaa-bbbb-cccc-dddd-eeee-ffff-0000-1111'];
beforeEach(() => { vi.mocked(axiosClient.get).mockResolvedValue({ data: { remaining: 8 } }); localStorage.clear(); });
afterEach(() => { cleanup(); vi.resetAllMocks(); });

it('requires reconfirmation before replacing codes, then hides the one-time plaintext after saving', async () => {
  vi.mocked(axiosClient.post).mockResolvedValue({ data: { codes: savedCodes } });
  render(<SecurityPanel />);
  expect(await screen.findByText(/Còn 8 mã/)).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Mật khẩu để tạo mã khôi phục'), { target: { value: 'CurrentPassword1!' } });
  const generate = screen.getByRole('button', { name: 'Tạo bộ mã mới' });
  expect(generate).toBeDisabled();
  fireEvent.click(screen.getByRole('checkbox', { name: /vô hiệu hóa/ }));
  fireEvent.click(generate);
  expect(await screen.findByText(savedCodes[0])).toBeInTheDocument();
  expect(axiosClient.post).toHaveBeenCalledWith('/api/profile/recovery-codes', { current_password: 'CurrentPassword1!' });
  expect(screen.getByLabelText('Mật khẩu để tạo mã khôi phục')).toHaveValue('');
  expect(JSON.stringify(localStorage)).not.toContain(savedCodes[0]);
  fireEvent.click(screen.getByRole('button', { name: 'Tôi đã lưu mã, ẩn mã' }));
  expect(screen.queryByText(savedCodes[0])).not.toBeInTheDocument();
  expect(screen.getByText(/Còn 2 mã/)).toBeInTheDocument();
});

it('does not show codes after a failed password check and lets the user retry', async () => {
  vi.mocked(axiosClient.get).mockResolvedValue({ data: { remaining: 0 } });
  vi.mocked(axiosClient.post).mockRejectedValueOnce({ response: { status: 422, data: { message: 'Mật khẩu hiện tại không chính xác.' } } })
    .mockResolvedValueOnce({ data: { codes: savedCodes } });
  render(<SecurityPanel />);
  await screen.findByText(/Chưa có mã khôi phục/);
  fireEvent.change(screen.getByLabelText('Mật khẩu để tạo mã khôi phục'), { target: { value: 'wrong' } });
  fireEvent.click(screen.getByRole('button', { name: 'Tạo bộ mã mới' }));
  expect(await screen.findByRole('alert')).toHaveTextContent(/không chính xác/);
  expect(screen.queryByText(savedCodes[0])).not.toBeInTheDocument();
  fireEvent.change(screen.getByLabelText('Mật khẩu để tạo mã khôi phục'), { target: { value: 'correct' } });
  fireEvent.click(screen.getByRole('button', { name: 'Tạo bộ mã mới' }));
  await waitFor(() => expect(screen.getByText(savedCodes[0])).toBeInTheDocument());
});
