import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ForgotPasswordFlow } from '../forgot-password/ForgotPasswordFlow';
import { LoginForm } from '../login/LoginForm';
import { RegisterForm } from '../login/RegisterForm';

vi.mock('next/navigation', () => ({ useRouter: () => ({ push: vi.fn() }) }));

const fetchMock = vi.fn();
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json' },
});
const fill = (label: string, value: string) => fireEvent.change(screen.getByLabelText(label), { target: { value } });

beforeEach(() => {
  window.localStorage.clear();
  fetchMock.mockReset();
  vi.stubGlobal('fetch', fetchMock);
});
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });

describe('friendly auth errors', () => {
  it.each(['json', 'html'])('explains a %s gateway failure and lets the student retry requesting an OTP', async (format) => {
    fetchMock.mockResolvedValueOnce(format === 'json'
      ? json({ status: 'error', code: 502, message: 'Application failed to respond', request_id: 'private-id' }, 502)
      : new Response('<html><title>Application failed to respond</title>Railway request_id=private-id</html>', { status: 502 }));
    fetchMock.mockResolvedValueOnce(json({ message: 'Đã gửi mã OTP.' }));
    render(<ForgotPasswordFlow />);
    fill('Email Address', 'student@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Gửi mã xác nhận' }));
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/thử lại/i);
    expect(alert).not.toHaveTextContent(/Application|Railway|private-id|JSON|Unexpected|502|html/i);
    expect(screen.getByRole('heading', { name: 'Quên mật khẩu' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Gửi mã xác nhận' }));
    expect(await screen.findByRole('heading', { name: 'Nhập mã OTP' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(screen.getByText('Gửi lại mã sau 60s')).toBeInTheDocument();
  });

  it('explains network loss during login and keeps the form ready to retry', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('Failed to fetch'));
    render(<LoginForm onFlipToRegister={() => {}} />);
    fill('Email Address', 'student@example.com');
    fill('Password', 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/kết nối|mạng/i);
    expect(screen.getByRole('alert')).not.toHaveTextContent('Failed to fetch');
    expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled();
  });

  it('keeps actionable credential errors for login', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'Email hoặc mật khẩu không chính xác!' }, 401));
    render(<LoginForm onFlipToRegister={() => {}} />);
    fill('Email Address', 'student@example.com');
    fill('Password', 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Login' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/Email hoặc mật khẩu không chính xác/i);
  });

  it('preserves registration field validation without raw server details and allows correction', async () => {
    fetchMock.mockResolvedValueOnce(json({ errors: { email: ['The email has already been taken.'] } }, 422));
    render(<RegisterForm onFlipToLogin={() => {}} />);
    fill('Full Name', 'Student');
    fill('Email Address', 'student@example.com');
    fill('Password', 'password123');
    fill('Confirm Password', 'password123');
    fireEvent.click(screen.getByRole('button', { name: 'Sign Up' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/kiểm tra/i);
    expect(screen.getByText(/email.*(sử dụng|tồn tại|đăng ký)/i)).toBeInTheDocument();
    expect(screen.queryByText('The email has already been taken.')).not.toBeInTheDocument();
    fill('Email Address', 'another@example.com');
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeEnabled();
  });

  it('keeps OTP errors, retries verification and reset failures, then completes the password reset', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'Đã gửi mã OTP.' }))
      .mockResolvedValueOnce(json({ message: 'Mã xác nhận không chính xác.' }, 400))
      .mockResolvedValueOnce(json({ message: 'Mã OTP hợp lệ.' }))
      .mockResolvedValueOnce(new Response('<html>SQLSTATE private backend failure</html>', { status: 500 }))
      .mockResolvedValueOnce(json({ message: 'Mật khẩu đã được thay đổi thành công.' }));
    render(<ForgotPasswordFlow />);
    fill('Email Address', 'student@example.com');
    fireEvent.click(screen.getByRole('button', { name: 'Gửi mã xác nhận' }));
    await screen.findByRole('heading', { name: 'Nhập mã OTP' });
    fill('Mã OTP', '123456');
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận OTP' }));
    expect(await screen.findByRole('alert')).toHaveTextContent('Mã xác nhận không chính xác.');
    fill('Mã OTP', '654321');
    fireEvent.click(screen.getByRole('button', { name: 'Xác nhận OTP' }));
    await screen.findByRole('heading', { name: 'Đặt lại mật khẩu' });
    fill('Mật khẩu mới', 'newpassword');
    fill('Xác nhận mật khẩu', 'different');
    fireEvent.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));
    expect(screen.getByRole('alert')).toHaveTextContent('Mật khẩu xác nhận không khớp.');
    fill('Xác nhận mật khẩu', 'newpassword');
    fireEvent.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));
    await waitFor(() => expect(screen.getByRole('alert')).toHaveTextContent(/thử lại/i));
    expect(screen.getByRole('alert')).not.toHaveTextContent(/SQLSTATE|private|JSON|html/i);
    fireEvent.click(screen.getByRole('button', { name: 'Đổi mật khẩu' }));
    expect(await screen.findByRole('heading', { name: 'Thành công!' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Đăng nhập ngay' })).toHaveAttribute('href', '/login');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(JSON.parse(fetchMock.mock.calls.at(-1)![1].body)).toEqual({
      email: 'student@example.com', otp: '654321', password: 'newpassword', password_confirmation: 'newpassword',
    });
  });
});
