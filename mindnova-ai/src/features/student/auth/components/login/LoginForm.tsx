"use client";

import { useState, useCallback, useId } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

function LogoMark() {
  return (
    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#6B6BFF] to-[#4648D4] flex items-center justify-center shadow-[0_6px_20px_rgba(107,107,255,0.5)]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="2.8" fill="white" />
        <path
          d="M12 2v3.5M12 18.5V22M4.22 4.22l2.47 2.47M17.31 17.31l2.47 2.47M2 12h3.5M18.5 12H22M4.22 19.78l2.47-2.47M17.31 6.69l2.47-2.47"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function EmailIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function EyeOpenIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeClosedIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}

// ─── Reusable Input ───────────────────────────────────────────────────────────

interface StyledInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  leftIcon: React.ReactNode;
  rightElement?: React.ReactNode;
  labelRight?: React.ReactNode;
}

function FormField({ id, label, leftIcon, rightElement, labelRight, ...inputProps }: StyledInputProps) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-semibold text-[#1A1A2E]">
          {label}
        </label>
        {labelRight}
      </div>
      <div className="relative group">
        {/* Left icon */}
        <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-[#B0B0C8] group-focus-within:text-[#6B6BFF] transition-colors duration-200">
          {leftIcon}
        </div>
        <input
          id={id}
          className="w-full pl-11 pr-11 py-3.5 rounded-xl text-sm text-[#1A1A2E] placeholder-[#C0C0D8] bg-[#F8F8FC] border border-[#E4E4EF] transition-all duration-200 focus:outline-none focus:bg-white focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 hover:border-[#C8C8E0]"
          {...inputProps}
        />
        {/* Right element */}
        {rightElement && (
          <div className="absolute inset-y-0 right-4 flex items-center">
            {rightElement}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function LoginForm() {
  const emailId   = useId();
  const passwordId = useId();
  const rememberMeId = useId();

  const [values, setValues] = useState<LoginFormValues>({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof LoginFormValues) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = field === "rememberMe" ? e.target.checked : e.target.value;
        setValues((prev) => ({ ...prev, [field]: value }));
      },
    [],
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      // Gọi /api/login trên cùng domain — Next.js rewrites sẽ proxy sang Laravel
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Đăng nhập thất bại.");
      }

      const token = payload?.access_token;

      if (token) {
        window.localStorage.setItem("accessToken", token);
        // Set cookie cho SSR và middleware
        document.cookie = `accessToken=${token}; path=/; max-age=2592000; SameSite=Lax`;
      }

      setStatusMessage("Đăng nhập thành công. Đang chuyển hướng...");
      window.location.assign("/admin/users");
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Đăng nhập thất bại.");
    } finally {
      setIsLoading(false);
    }
  }, [values.email, values.password]);

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);

  const canSubmit = values.email.trim() !== "" && values.password.length >= 1;

  return (
    /* Outer shell: fill left pane height, center content vertically */
    <div className="flex flex-col flex-1 min-h-screen">
      {/* Top bar — logo */}
      <div className="px-10 pt-8 pb-4">
        <div className="flex items-center gap-3">
          <LogoMark />
          <span className="text-[15px] font-bold tracking-tight text-[#1A1A2E]">MindNova AI</span>
        </div>
      </div>

      {/* Main area — vertically centered */}
      <div className="flex flex-col flex-1 justify-center px-10 py-6">
        <div className="w-full max-w-[380px] mx-auto">

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-[30px] font-bold text-[#1A1A2E] leading-tight tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-[14px] text-[#7878A0] leading-relaxed">
              Continue your personalized learning journey with{" "}
              <span className="text-[#6B6BFF] font-medium">AI-driven</span> insights.
            </p>
          </div>

          {/* Form */}
          {statusMessage && (
            <div
              className={`mb-4 p-3.5 rounded-xl text-xs font-medium border ${
                statusMessage.includes("thành công")
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-red-50 text-red-600 border-red-200"
              }`}
            >
              {statusMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

            {/* Email */}
            <FormField
              id={emailId}
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              autoComplete="email"
              value={values.email}
              onChange={handleChange("email")}
              leftIcon={<EmailIcon />}
              rightElement={
                values.email.includes("@") ? (
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2 2 4-4" stroke="#10B981" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                ) : undefined
              }
            />

            {/* Password */}
            <FormField
              id={passwordId}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange("password")}
              leftIcon={<LockIcon />}
              labelRight={
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors"
                >
                  Forgot password?
                </Link>
              }
              rightElement={
                <button
                  type="button"
                  onClick={togglePassword}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="text-[#B0B0C8] hover:text-[#6B6BFF] transition-colors focus:outline-none"
                >
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              }
            />

            {/* Remember me */}
            <label
              htmlFor={rememberMeId}
              className="flex items-center gap-2.5 cursor-pointer w-fit group mt-1"
            >
              <div className="relative">
                <input
                  id={rememberMeId}
                  type="checkbox"
                  checked={values.rememberMe}
                  onChange={handleChange("rememberMe")}
                  className="sr-only peer"
                />
                <div className="w-[18px] h-[18px] rounded-[5px] border-2 border-[#D0D0E8] bg-white peer-checked:bg-[#6B6BFF] peer-checked:border-[#6B6BFF] transition-all duration-200 flex items-center justify-center shadow-sm group-hover:border-[#6B6BFF]/70">
                  {values.rememberMe && (
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                      <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="text-sm text-[#7878A0] group-hover:text-[#1A1A2E] transition-colors">
                Remember me for 30 days
              </span>
            </label>

            {/* Submit button */}
            <button
              type="submit"
              disabled={isLoading || !canSubmit}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_18px_rgba(107,107,255,0.45)] hover:shadow-[0_8px_28px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/30"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Signing in…
                </>
              ) : (
                <>
                  Login
                  <ArrowRightIcon />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E4E4EF] to-transparent" />
            <span className="text-xs text-[#B0B0C8] font-medium uppercase tracking-widest">OR</span>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E4E4EF] to-transparent" />
          </div>

          {/* Google SSO */}
          <button
            type="button"
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl text-sm font-semibold text-[#1A1A2E] bg-white border border-[#E4E4EF] hover:border-[#6B6BFF]/40 hover:bg-[#F8F8FF] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(107,107,255,0.1)] active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/15"
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Sign up */}
          <p className="mt-7 text-center text-sm text-[#7878A0]">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors hover:underline underline-offset-2"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="px-10 py-6 text-center">
        <p className="text-[11px] text-[#C0C0D4] leading-relaxed">
          © 2024 MindNova AI. Empowering global learners through intelligence.
        </p>
      </div>
    </div>
  );
}
