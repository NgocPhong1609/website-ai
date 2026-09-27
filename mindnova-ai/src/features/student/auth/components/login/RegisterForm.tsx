"use client";

import { useState, useCallback, useId } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getErrorMessage, getValidationErrors, readApiResponse } from "@/src/shared/lib/user-error";
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
 const [isSwitchingRole, setIsSwitchingRole] = useState(false);
 const [statusMessage, setStatusMessage] = useState<string | null>(null);
 const [errors, setErrors] = useState<Record<string, string>>({});
 const [touched, setTouched] = useState<Record<string, boolean>>({});

 const isNameValid = values.name.trim().length > 0;
 const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email);
 const isPasswordValid = values.password.length >= 6;
 const isConfirmMatch = values.password === values.password_confirmation && values.password.length >= 6;
 const liveErrors: Record<string, string> = {
 name: isNameValid ? "" : "Vui lòng nhập họ và tên.",
 email: !values.email.trim() ? "Vui lòng nhập email." : isEmailValid ? "" : "Email không đúng định dạng.",
 password: isPasswordValid ? "" : "Mật khẩu cần ít nhất 6 ký tự.",
 password_confirmation: values.password_confirmation && values.password !== values.password_confirmation ? "Mật khẩu xác nhận không khớp." : "",
 };
 const fieldError = (field: keyof typeof liveErrors) => errors[field] || (touched[field] ? liveErrors[field] : "");
 const markTouched = (field: string) => () => setTouched((prev) => ({ ...prev, [field]: true }));
 const hasNoErrors = Object.values(errors).every((v) => !v);
 const canSubmit = isNameValid && isEmailValid && isPasswordValid && isConfirmMatch && hasNoErrors;

 const validate = () => {
 const newErrors: Record<string, string> = {};
 if (!values.name.trim()) newErrors.name = "Vui lòng nhập họ và tên.";
 if (!values.email.trim()) {
 newErrors.email = "Vui lòng nhập email.";
 } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
 newErrors.email = "Email không đúng định dạng.";
 }
 if (values.password.length < 6) {
 newErrors.password = "Mật khẩu cần ít nhất 6 ký tự.";
 }
 if (values.password !== values.password_confirmation) {
 newErrors.password_confirmation = "Mật khẩu xác nhận không khớp.";
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

 const payload = await readApiResponse(response, "Không thể đăng ký. Vui lòng thử lại.");

 const token = payload?.access_token;
 const user = payload?.user;

 if (token && user) {
 window.localStorage.setItem("accessToken", token);
 window.localStorage.setItem("userInfo", JSON.stringify(user));

 const maxAge = 60 * 60 * 8; // default 8 hours for register
 const roleStr = getUserRoleStr(user);
 document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
 document.cookie = `userRole=${roleStr}; path=/; max-age=${maxAge}; samesite=lax`;

 setStatusMessage("Đăng ký thành công...");
  toast.success('Đăng ký thành công!');
  setTimeout(() => {
  // New learners set their goals first so the AI study plan has something to work with.
  const target = getUserRoleStr(user) === "student" && !user?.is_onboarded ? "/onboarding" : getRedirectPath(user);
  window.location.assign(target);
  }, 1000);
 }
 } catch (error) {
 const apiErrors = getValidationErrors(error);
 setErrors(apiErrors);
 setStatusMessage(Object.keys(apiErrors).length > 0
 ? "Vui lòng kiểm tra lại thông tin."
 : getErrorMessage(error, "Không thể đăng ký. Vui lòng thử lại."));
 } finally {
 setIsLoading(false);
 }
 }, [values]);

 const togglePassword = useCallback(() => setShowPassword((v) => !v), []);
 const toggleConfirmPassword = useCallback(() => setShowConfirmPassword((v) => !v), []);

 const handleRoleChange = useCallback((newRole: string) => {
 if (values.role === newRole) return;
 setIsSwitchingRole(true);
 setTimeout(() => {
 setValues((prev) => ({ ...prev, role: newRole }));
 setIsSwitchingRole(false);
 }, 400);
 }, [values.role]);

 return (
 <div className="flex flex-col w-full h-full px-8 sm:px-10 py-6">


 {/* Content â€” cÄƒn giá»¯a dá»c */}
 <div className="flex flex-col justify-center w-full max-w-[480px] mx-auto py-6 my-auto">
 <div className="mb-5">
 <h1 className="text-[26px] font-bold text-slate-900 leading-tight tracking-tight">
 Tạo tài khoản
 </h1>
 </div>

 {statusMessage && (
 <div
 role={statusMessage.includes("thành công") ? "status" : "alert"}
 className={`mb-3 p-3 rounded-xl text-xs font-medium border ${
  statusMessage.includes("thành công")
  ? "bg-emerald-50 text-emerald-600 border-emerald-600/20"
  : "bg-blue-50 text-blue-500 border-blue-500/30"
 }`}
 >
 {statusMessage}
 </div>
 )}

 <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
  {/* Role Selection */}
  <div className="flex p-1 bg-slate-50 rounded-xl border border-slate-200">
  <button
  type="button"
  onClick={() => handleRoleChange("student")}
  className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
  values.role === "student"
  ? "bg-white text-blue-500 shadow-sm"
  : "text-slate-500 hover:text-blue-600"
  }`}
  >
  Học viên
  </button>
  <button
  type="button"
  onClick={() => handleRoleChange("teacher")}
  className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
  values.role === "teacher"
  ? "bg-white text-blue-500 shadow-sm"
  : "text-slate-500 hover:text-blue-600"
  }`}
  >
  Giảng viên
  </button>
  </div>

  {isSwitchingRole ? (
  <div className="relative w-full">
  <div className="flex flex-col gap-3 animate-pulse w-full opacity-50">
  {/* Full Name Skeleton */}
  <div className="space-y-1.5">
  <div className="h-[18px] bg-slate-200 rounded w-24"></div>
  <div className="h-[52px] bg-slate-50 rounded-xl border border-slate-200"></div>
  </div>
  
  {/* Email Skeleton */}
  <div className="space-y-1.5">
  <div className="h-[18px] bg-slate-200 rounded w-28"></div>
  <div className="h-[52px] bg-slate-50 rounded-xl border border-slate-200"></div>
  </div>
  
  {/* Password Grid Skeleton */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div className="space-y-1.5">
  <div className="h-[18px] bg-slate-200 rounded w-20"></div>
  <div className="h-[52px] bg-slate-50 rounded-xl border border-slate-200"></div>
  </div>
  <div className="space-y-1.5">
  <div className="h-[18px] bg-slate-200 rounded w-32"></div>
  <div className="h-[52px] bg-slate-50 rounded-xl border border-slate-200"></div>
  </div>
  </div>
  
  {/* Submit Button Skeleton */}
  <div className="mt-1 h-[48px] bg-slate-200 rounded-xl"></div>
  </div>
  </div>
  ) : (
  <>
  <FormField
 id={nameId}
 label="Họ và tên"
 type="text"
 autoComplete="name"
 value={values.name}
 onChange={handleChange("name")}
 onBlur={markTouched("name")}
 error={fieldError("name")}
 />
 <FormField
 id={emailId}
 label="Email"
 type="email"

 autoComplete="email"
 value={values.email}
 onChange={handleChange("email")}
 onBlur={markTouched("email")}
 error={fieldError("email")}
 />

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <FormField
 id={passwordId}
 label="Mật khẩu"
 type={showPassword ? "text" : "password"}

 autoComplete="new-password"
 value={values.password}
 onChange={handleChange("password")}
 onBlur={markTouched("password")}
 error={fieldError("password")}
 rightElement={
 <button
 type="button"
 onClick={togglePassword}
 className="text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
 >
 {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
 </button>
 }
 />
 <FormField
 id={confirmPasswordId}
 label="Xác nhận mật khẩu"
 type={showConfirmPassword ? "text" : "password"}

 autoComplete="new-password"
 value={values.password_confirmation}
 onChange={handleChange("password_confirmation")}
 onBlur={markTouched("password_confirmation")}
 error={fieldError("password_confirmation")}
 rightElement={
 <button
 type="button"
 onClick={toggleConfirmPassword}
 className="text-slate-400 hover:text-blue-600 transition-colors focus:outline-none"
 >
 {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
 </button>
 }
 />
 </div>
 
 <button
 type="submit"
 disabled={isLoading || !canSubmit}
 className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-blue-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-500/30"
 >
 {isLoading ? "Đang tạo tài khoản..." : <>Đăng ký <ArrowRightIcon /></>}
 </button>
 </>
  )}

 </form>

 <p className="mt-5 text-center text-[13px] text-slate-500">
 Đã có tài khoản?{" "}
 <button
 type="button"
 onClick={onFlipToLogin}
 className="font-semibold text-blue-500 hover:text-blue-600 transition-colors hover:underline underline-offset-2 focus:outline-none"
 >
 Đăng nhập
 </button>
 </p>
 </div>

 {/* Footer â€” bÃ¡m sÃ¡t phÃ­a dÆ°á»›i */}
 <div className="mt-auto text-center">
 <p className="text-[11px] text-slate-400 leading-relaxed">
 © 2026 MindNova AI. Nền tảng học tập cá nhân hóa cùng AI.
 </p>
 </div>
 </div>
 );
}



