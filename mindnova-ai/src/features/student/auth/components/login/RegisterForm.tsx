"use client";

import { useState, useCallback, useId } from "react";
import {
  LogoMark,
  UserIcon,
  EmailIcon,
  LockIcon,
  EyeOpenIcon,
  EyeClosedIcon,
  GoogleIcon,
  ArrowRightIcon,
  FormField,
  getUserRoleStr,
  getRedirectPath
} from "./AuthShared";

interface RegisterFormProps {
  onFlipToLogin: () => void;
}

export function RegisterForm({ onFlipToLogin }: RegisterFormProps) {
  const nameId = useId();
  const emailId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "student",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isNameValid = values.name.trim().length > 0;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
  const isPasswordValid = values.password.length >= 6;
  const isConfirmMatch = values.password === values.password_confirmation && values.password.length >= 6;
  const hasNoErrors = Object.values(errors).every((v) => !v);
  const canSubmit = isNameValid && isEmailValid && isPasswordValid && isConfirmMatch && hasNoErrors;

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!values.name.trim()) newErrors.name = "Full name is required.";
    if (!values.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
      newErrors.email = "Invalid email format.";
    }
    if (values.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (values.password !== values.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = useCallback(
    (field: keyof typeof values) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setValues((prev) => ({ ...prev, [field]: e.target.value }));
        if (errors[field]) {
          setErrors((prev) => ({ ...prev, [field]: "" }));
        }
      },
    [errors]
  );

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(values),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (payload?.errors) {
          const apiErrors: Record<string, string> = {};
          Object.keys(payload.errors).forEach((key) => {
            apiErrors[key] = payload.errors[key][0];
          });
          setErrors(apiErrors);
          throw new Error("Vui lòng kiểm tra lại thông tin.");
        }
        throw new Error(payload?.message ?? "Đăng ký thất bại.");
      }

      const token = payload?.access_token;
      const user = payload?.user;

      if (token && user) {
        window.localStorage.setItem("accessToken", token);
        window.localStorage.setItem("userInfo", JSON.stringify(user));

        const maxAge = 60 * 60 * 8; // default 8 hours for register
        const roleStr = getUserRoleStr(user.roles || []);
        document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
        document.cookie = `userRole=${roleStr}; path=/; max-age=${maxAge}; samesite=lax`;

        setStatusMessage("Đăng ký thành công...");
        window.location.assign(getRedirectPath(user.roles || []));
      }
    } catch (error) {
      setStatusMessage(error instanceof Error ? error.message : "Đăng ký thất bại.");
    } finally {
      setIsLoading(false);
    }
  }, [values]);

  const togglePassword = useCallback(() => setShowPassword((v) => !v), []);
  const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((v) => !v), []);

  return (
    <div className="flex flex-col w-full h-full px-8 sm:px-10 py-6">
      {/* Header — bám sát phía trên */}
      <div className="flex items-center gap-2.5 mb-auto">
        <LogoMark />
        <span className="text-[14px] font-bold tracking-tight text-[#1A1A2E]">MindNova AI</span>
      </div>

      {/* Content — căn giữa dọc */}
      <div className="flex flex-col justify-center w-full max-w-[480px] mx-auto py-6">
        <div className="mb-5">
          <h1 className="text-[26px] font-bold text-[#1A1A2E] leading-tight tracking-tight">
            Create Account
          </h1>
          <p className="mt-1.5 text-[13px] text-[#7878A0] leading-relaxed">
            Start your personalized learning journey with{" "}
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
          {/* Role Selection */}
          <div className="flex p-1 bg-[#F6F6FB] rounded-xl border border-[#EAEAF4]">
            <button
              type="button"
              onClick={() => setValues(prev => ({ ...prev, role: "student" }))}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                values.role === "student"
                  ? "bg-white text-[#4648D4] shadow-sm"
                  : "text-[#7878A0] hover:text-[#4648D4]"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setValues(prev => ({ ...prev, role: "teacher" }))}
              className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
                values.role === "teacher"
                  ? "bg-white text-[#4648D4] shadow-sm"
                  : "text-[#7878A0] hover:text-[#4648D4]"
              }`}
            >
              Teacher
            </button>
          </div>

          <FormField
            id={nameId}
            label="Full Name"
            type="text"
            placeholder="John Doe"
            autoComplete="name"
            value={values.name}
            onChange={handleChange("name")}
            leftIcon={<UserIcon />}
            error={errors.name}
          />
          <FormField
            id={emailId}
            label="Email Address"
            type="email"
            placeholder="name@example.com"
            autoComplete="email"
            value={values.email}
            onChange={handleChange("email")}
            leftIcon={<EmailIcon />}
            error={errors.email}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <FormField
              id={passwordId}
              label="Password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={values.password}
              onChange={handleChange("password")}
              leftIcon={<LockIcon />}
              error={errors.password}
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
            <FormField
              id={confirmPasswordId}
              label="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              autoComplete="new-password"
              value={values.password_confirmation}
              onChange={handleChange("password_confirmation")}
              leftIcon={<LockIcon />}
              error={errors.password_confirmation}
              rightElement={
                <button
                  type="button"
                  onClick={toggleConfirmPassword}
                  className="text-[#B0B0C8] hover:text-[#6B6BFF] transition-colors focus:outline-none"
                >
                  {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              }
            />
          </div>
          
          <button
            type="submit"
            disabled={isLoading || !canSubmit}
            className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_18px_rgba(107,107,255,0.45)] hover:shadow-[0_8px_28px_rgba(107,107,255,0.55)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#6B6BFF]/30"
          >
            {isLoading ? "Creating account..." : <>Sign Up <ArrowRightIcon /></>}
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
          Already have an account?{" "}
          <button
            type="button"
            onClick={onFlipToLogin}
            className="font-semibold text-[#6B6BFF] hover:text-[#4648D4] transition-colors hover:underline underline-offset-2 focus:outline-none"
          >
            Login
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
