"use client";

import { useState, useCallback, useId, useEffect } from "react";
import Link from "next/link";
import {
  LogoMark,
  EmailIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  GoogleIcon,
  ArrowRightIcon,
  FormField,
  getUserRoleStr,
  getRedirectPath,
  UserRole
} from "./AuthShared";

interface LoginFormProps {
  onFlipToRegister: () => void;
}

export function LoginForm({ onFlipToRegister }: LoginFormProps) {
  const emailId = useId();
  const passwordId = useId();
  const rememberMeId = useId();

  const [values, setValues] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Tự động đồng bộ token & chuyển hướng nếu đã đăng nhập
  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");
    const userInfoRaw = window.localStorage.getItem("userInfo");

    if (token && userInfoRaw) {
      try {
        const user = JSON.parse(userInfoRaw);
        const roleStr = getUserRoleStr(user.roles || []);
        
        document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
        document.cookie = `userRole=${roleStr}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;

        window.location.assign(getRedirectPath(user.roles || []));
      } catch {
        window.localStorage.clear();
        document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    } else {
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
  }, []);

  const handleChange = useCallback(
    (field: keyof typeof values) =>
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
      const response = await fetch("http://127.0.0.1:8000/api/login", {
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
      const user = payload?.user; 

      if (token && user) {
        window.localStorage.setItem("accessToken", token);
        window.localStorage.setItem("userInfo", JSON.stringify(user));

        const maxAge = values.rememberMe ? 60 * 60 * 24 * 30 : 60 * 60 * 8;
        const roleStr = getUserRoleStr(user.roles || []);
        document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
        document.cookie = `userRole=${roleStr}; path=/; max-age=${maxAge}; samesite=lax`;

        setStatusMessage("Đăng nhập thành công...");
        window.location.assign(getRedirectPath(user.roles || []));
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Đăng nhập thất bại.");
    } finally {
      setIsLoading(false);
    }
  }, [values]);

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);
  const canSubmit = values.email.trim() !== "" && values.password.length >= 1;

  return (
    <div className="flex flex-col w-full h-full px-8 sm:px-10 py-6">
      {/* Header — bám sát phía trên */}
      <div className="flex items-center gap-2.5 mb-auto">
        <LogoMark />
        <span className="text-[14px] font-bold tracking-tight text-[#1A1A2E]">MindNova AI</span>
      </div>

      {/* Content — căn giữa dọc */}
      <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-6">
        <div className="mb-5">
          <h1 className="text-[26px] font-bold text-[#1A1A2E] leading-tight tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1.5 text-[13px] text-[#7878A0] leading-relaxed">
            Continue your personalized learning journey with{" "}
            <span className="text-[#6B6BFF] font-medium">AI-driven</span> insights.
          </p>
        </div>

        {statusMessage && (
          <div
            className={`mb-3 p-3 rounded-xl text-xs font-medium border ${
              statusMessage.includes("thành công")
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-600 border-red-200"
            }`}
          >
            {statusMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
          <FormField
            id={emailId}
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            leftIcon={<EmailIcon />}
          />
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
                className="text-[#B0B0C8] hover:text-[#6B6BFF] transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
              </button>
            }
          />
          <label
            htmlFor={rememberMeId}
            className="flex items-center gap-2.5 cursor-pointer w-fit group"
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
            <span className="text-[13px] text-[#7878A0] group-hover:text-[#1A1A2E] transition-colors">
              Remember me for 30 days
            </span>
          </label>
          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_18px_rgba(107,107,255,0.45)] hover:shadow-[0_8px_28px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/30"
          >
            {isLoading ? "Signing in..." : <>Login <ArrowRightIcon /></>}
          </button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E4E4EF] to-transparent" />
          <span className="text-[11px] text-[#B0B0C8] font-medium uppercase tracking-widest">OR</span>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-[#E4E4EF] to-transparent" />
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center gap-3 py-3 rounded-xl text-[13px] font-semibold text-[#1A1A2E] bg-white border border-[#E4E4EF] hover:border-[#6B6BFF]/40 hover:bg-[#F8F8FF] hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgba(107,107,255,0.1)] active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/15"
        >
          <GoogleIcon />
          Continue with Google
        </button>

        <p className="mt-5 text-center text-[13px] text-[#7878A0]">
          Don&apos;t have an account?{" "}
          <button
            type="button"
            onClick={onFlipToRegister}
            className="font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors hover:underline underline-offset-2 focus:outline-none"
          >
            Sign up
          </button>
        </p>
      </div>

      {/* Footer — bám sát phía dưới */}
      <div className="mt-auto text-center">
        <p className="text-[11px] text-[#C0C0D4] leading-relaxed">
          © 2024 MindNova AI. Empowering global learners through intelligence.
        </p>
      </div>
    </div>
  );
}