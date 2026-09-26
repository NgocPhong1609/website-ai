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
  window.location.assign(getRedirectPath(user));
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
 <h1 className="text-[26px] font-bold text-[#0F172A] leading-tight tracking-tight">
 Create Account
 </h1>
 </div>

 {statusMessage && (
 <div
 role={statusMessage.includes("thành công") ? "status" : "alert"}
 className={`mb-3 p-3 rounded-xl text-xs font-medium border ${
  statusMessage.includes("thành công")
  ? "bg-[#E8F8F0] text-[#27AE60] border-[#27AE60]/20"
  : "bg-[#EFF6FF] text-[#3B82F6] border-[#3B82F6]/30"
 }`}
 >
 {statusMessage}
 </div>
 )}

 <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3">
  {/* Role Selection */}
  <div className="flex p-1 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
  <button
  type="button"
  onClick={() => handleRoleChange("student")}
  className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
  values.role === "student"
  ? "bg-white text-[#3B82F6] shadow-sm"
  : "text-[#64748B] hover:text-[#2563EB]"
  }`}
  >
  Student
  </button>
  <button
  type="button"
  onClick={() => handleRoleChange("teacher")}
  className={`flex-1 py-1.5 text-[13px] font-semibold rounded-lg transition-all duration-200 ${
  values.role === "teacher"
  ? "bg-white text-[#3B82F6] shadow-sm"
  : "text-[#64748B] hover:text-[#2563EB]"
  }`}
  >
  Teacher
  </button>
  </div>

  {isSwitchingRole ? (
  <div className="relative w-full">
  <div className="flex flex-col gap-3 animate-pulse w-full opacity-50">
  {/* Full Name Skeleton */}
  <div className="space-y-1.5">
  <div className="h-[18px] bg-[#E2E8F0] rounded w-24"></div>
  <div className="h-[52px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"></div>
  </div>
  
  {/* Email Skeleton */}
  <div className="space-y-1.5">
  <div className="h-[18px] bg-[#E2E8F0] rounded w-28"></div>
  <div className="h-[52px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"></div>
  </div>
  
  {/* Password Grid Skeleton */}
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
  <div className="space-y-1.5">
  <div className="h-[18px] bg-[#E2E8F0] rounded w-20"></div>
  <div className="h-[52px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"></div>
  </div>
  <div className="space-y-1.5">
  <div className="h-[18px] bg-[#E2E8F0] rounded w-32"></div>
  <div className="h-[52px] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]"></div>
  </div>
  </div>
  
  {/* Submit Button Skeleton */}
  <div className="mt-1 h-[48px] bg-[#E2E8F0] rounded-xl"></div>
  </div>
  </div>
  ) : (
  <>
  <FormField
 id={nameId}
 label="Full Name"
 type="text"
 autoComplete="name"
 value={values.name}
 onChange={handleChange("name")}

 error={errors.name}
 />
 <FormField
 id={emailId}
 label="Email Address"
 type="email"

 autoComplete="email"
 value={values.email}
 onChange={handleChange("email")}

 error={errors.email}
 />

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 <FormField
 id={passwordId}
 label="Password"
 type={showPassword ? "text" : "password"}

 autoComplete="new-password"
 value={values.password}
 onChange={handleChange("password")}

 error={errors.password}
 rightElement={
 <button
 type="button"
 onClick={togglePassword}
 className="text-[#94A3B8] hover:text-[#2563EB] transition-colors focus:outline-none"
 >
 {showPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
 </button>
 }
 />
 <FormField
 id={confirmPasswordId}
 label="Confirm Password"
 type={showConfirmPassword ? "text" : "password"}

 autoComplete="new-password"
 value={values.password_confirmation}
 onChange={handleChange("password_confirmation")}

 error={errors.password_confirmation}
 rightElement={
 <button
 type="button"
 onClick={toggleConfirmPassword}
 className="text-[#94A3B8] hover:text-[#2563EB] transition-colors focus:outline-none"
 >
 {showConfirmPassword ? <EyeOpenIcon /> : <EyeClosedIcon />}
 </button>
 }
 />
 </div>
 
 <button
 type="submit"
 disabled={isLoading || !canSubmit}
 className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-[#3B82F6] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#3B82F6]/30"
 >
 {isLoading ? "Creating account..." : <>Sign Up <ArrowRightIcon /></>}
 </button>
 </>
  )}

 </form>

 <p className="mt-5 text-center text-[13px] text-[#64748B]">
 Already have an account?{" "}
 <button
 type="button"
 onClick={onFlipToLogin}
 className="font-semibold text-[#3B82F6] hover:text-[#2563EB] transition-colors hover:underline underline-offset-2 focus:outline-none"
 >
 Login
 </button>
 </p>
 </div>

 {/* Footer â€” bÃ¡m sÃ¡t phÃ­a dÆ°á»›i */}
 <div className="mt-auto text-center">
 <p className="text-[11px] text-[#94A3B8] leading-relaxed">
 Â© 2024 MindNova AI. Empowering global learners through intelligence.
 </p>
 </div>
 </div>
 );
}



