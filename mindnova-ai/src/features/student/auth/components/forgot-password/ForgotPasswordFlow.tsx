"use client";

import { useState, useCallback, useId, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LogoMark,
  EmailIcon,
  LockIcon,
  ArrowRightIcon,
  FormField,
  EyeOpenIcon,
  EyeClosedIcon
} from "../login/AuthShared";

type Step = "REQUEST_OTP" | "VERIFY_OTP" | "RESET_PASSWORD" | "SUCCESS";

export function ForgotPasswordFlow() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("REQUEST_OTP");
  
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);

  const emailId = useId();
  const otpId = useId();
  const passwordId = useId();
  const confirmPasswordId = useId();

  // Handle countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const requestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể gửi OTP.");
      setStep("VERIFY_OTP");
      setCountdown(60);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/forgot-password/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Mã OTP không hợp lệ.");
      setStep("RESET_PASSWORD");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setErrorMsg("Mật khẩu xác nhận không khớp.");
      return;
    }
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, password: newPassword, password_confirmation: confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Không thể đặt lại mật khẩu.");
      setStep("SUCCESS");
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case "REQUEST_OTP":
        return (
          <form onSubmit={requestOtp} className="flex flex-col gap-3">
            <FormField
              id={emailId}
              label="Email Address"
              type="email"
              placeholder="Nhập email của bạn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              leftIcon={<EmailIcon />}
            />
            <button
              type="submit"
              disabled={isLoading || !email}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-[#6B6BFF] hover:bg-[#4648D4] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Gửi mã xác nhận"}
            </button>
          </form>
        );
      
      case "VERIFY_OTP":
        return (
          <form onSubmit={verifyOtp} className="flex flex-col gap-3">
            <div className="text-sm text-[#64647A] mb-2 text-center">
              Mã xác nhận gồm 6 chữ số đã được gửi đến <br /> <b>{email}</b>
            </div>
            <FormField
              id={otpId}
              label="Mã OTP"
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              leftIcon={<LockIcon />}
            />
            <button
              type="submit"
              disabled={isLoading || otp.length < 6}
              className="mt-2 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-[#6B6BFF] hover:bg-[#4648D4] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận OTP"}
            </button>
            <div className="text-center mt-3 text-xs">
              {countdown > 0 ? (
                <span className="text-[#A0A0C0]">Gửi lại mã sau {countdown}s</span>
              ) : (
                <button type="button" onClick={requestOtp} className="text-[#6B6BFF] hover:underline font-semibold">Gửi lại mã</button>
              )}
            </div>
          </form>
        );

      case "RESET_PASSWORD":
        return (
          <form onSubmit={resetPassword} className="flex flex-col gap-3">
            <FormField
              id={passwordId}
              label="Mật khẩu mới"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              leftIcon={<LockIcon />}
              rightElement={
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#B0B0C8] hover:text-[#6B6BFF]">
                  {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              }
            />
            <FormField
              id={confirmPasswordId}
              label="Xác nhận mật khẩu"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              leftIcon={<LockIcon />}
              rightElement={
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="text-[#B0B0C8] hover:text-[#6B6BFF]">
                  {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
                </button>
              }
            />
            <button
              type="submit"
              disabled={isLoading || newPassword.length < 6}
              className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-[#6B6BFF] hover:bg-[#4648D4] transition-colors disabled:opacity-50"
            >
              {isLoading ? "Đang xử lý..." : "Đổi mật khẩu"}
            </button>
          </form>
        );

      case "SUCCESS":
        return (
          <div className="flex flex-col items-center justify-center text-center py-6">
            <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <h2 className="text-xl font-bold text-[#1A1A2E] mb-2">Thành công!</h2>
            <p className="text-sm text-[#64647A] mb-6">Mật khẩu của bạn đã được cập nhật.</p>
            <Link href="/login" className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-gradient-to-r from-[#10B981] to-[#059669] shadow-md hover:-translate-y-0.5 transition-all">
              Đăng nhập ngay
            </Link>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col w-full h-full px-8 sm:px-10 py-8">
      <div className="flex items-center gap-2.5 mb-6">
        <LogoMark />
        <span className="text-[14px] font-bold tracking-tight text-[#1A1A2E]">MindNova AI</span>
      </div>

      <div className="mb-6">
        <h1 className="text-[26px] font-bold text-[#1A1A2E] leading-tight tracking-tight mb-2">
          {step === "REQUEST_OTP" ? "Quên mật khẩu" : step === "VERIFY_OTP" ? "Nhập mã OTP" : step === "RESET_PASSWORD" ? "Đặt lại mật khẩu" : "Hoàn tất"}
        </h1>
        {step === "REQUEST_OTP" && (
          <p className="text-[13px] text-[#7878A0] leading-relaxed">
            Nhập email của bạn để nhận mã khôi phục.
          </p>
        )}
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl text-xs font-medium bg-red-50 text-red-600 border border-red-200">
          {errorMsg}
        </div>
      )}

      {renderStep()}

      {step !== "SUCCESS" && (
        <div className="mt-6 text-center">
          <Link href="/login" className="text-[13px] font-semibold text-[#6B6BFF] hover:text-[#4648D4] hover:underline transition-colors">
            Quay lại đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
