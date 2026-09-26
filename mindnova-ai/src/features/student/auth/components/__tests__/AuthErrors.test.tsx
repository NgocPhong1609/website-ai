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

  it.each(['json', 'html'])('recovers with a saved code after a %s failure, clearing old credentials', async (format) => {
    fetchMock.mockResolvedValueOnce(format === 'json'
      ? json({ message: 'Application failed to respond' }, 502)
      : new Response('<html>SQLSTATE private</html>', { status: 500 }))
      .mockResolvedValueOnce(json({ message: 'Đã đặt lại mật khẩu.' }));
    localStorage.setItem('accessToken', 'old-token');
    document.cookie = 'accessToken=old-token; path=/';
    document.cookie = 'userRole=student; path=/';
    render(<ForgotPasswordFlow />);
    fill('Email', 'student@example.com');
    fill('Mã khôi phục', 'abcd-1234-abcd-1234-abcd-1234-abcd-1234');
    fill('Mật khẩu mới', 'NewPassword123!');
    fill('Xác nhận mật khẩu', 'Different123!');
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }));
    expect(screen.getByRole('alert')).toHaveTextContent(/không khớp/);
    expect(fetchMock).not.toHaveBeenCalled();
    fill('Xác nhận mật khẩu', 'NewPassword123!');
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/thử lại/);
    expect(screen.getByRole('alert')).not.toHaveTextContent(/SQLSTATE|private|Application|html/);
    fireEvent.click(screen.getByRole('button', { name: 'Đặt lại mật khẩu' }));
    expect(await screen.findByRole('heading', { name: 'Thành công!' })).toBeInTheDocument();
    expect(localStorage.getItem('accessToken')).toBeNull();
    expect(document.cookie).not.toContain('accessToken=old-token');
    const [url, options] = fetchMock.mock.calls.at(-1)!;
    expect(url).toBe('/api/reset-password');
    expect(new Headers(options.headers).get('Accept')).toBe('application/json');
    expect(JSON.parse(options.body)).toEqual({ email: 'student@example.com', recovery_code: 'abcd-1234-abcd-1234-abcd-1234-abcd-1234', password: 'NewPassword123!', password_confirmation: 'NewPassword123!' });
    expect(screen.getByRole('link', { name: 'Đăng nhập ngay' })).toHaveAttribute('href', '/login');
  });

  it('accepts an administrator link from the fragment and removes it from the address bar', () => {
    window.history.replaceState(null, '', '/forgot-password#email=student%40example.com&recovery_code=private-code');
    render(<ForgotPasswordFlow />);
    expect(screen.getByLabelText('Email')).toHaveValue('student@example.com');
    expect(screen.getByLabelText('Mã khôi phục')).toHaveValue('private-code');
    expect(window.location.hash).toBe('');
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('submits support details without requesting an OTP or claiming the account is verified', async () => {
    fetchMock.mockResolvedValueOnce(json({ message: 'Đã tiếp nhận yêu cầu hỗ trợ.' }));
    render(<ForgotPasswordFlow />);
    fireEvent.click(screen.getByRole('button', { name: 'Tôi không có mã khôi phục' }));
    fill('Email', 'student@example.com');
    fill('Kênh liên hệ', 'Telegram @student');
    fill('Thông tin hỗ trợ xác minh', 'Tôi đã mua khóa học, cần hỗ trợ xác minh tài khoản.');
    fireEvent.click(screen.getByRole('button', { name: 'Gửi yêu cầu hỗ trợ' }));
    expect(await screen.findByRole('status')).toHaveTextContent(/tiếp nhận/);
    expect(fetchMock.mock.calls[0][0]).toBe('/api/password-recovery/support');
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toMatchObject({ email: 'student@example.com', contact: 'Telegram @student' });
    expect(screen.queryByRole('heading', { name: 'Thành công!' })).not.toBeInTheDocument();
  });
});
