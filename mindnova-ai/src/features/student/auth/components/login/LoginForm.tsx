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
 const roleStr = getUserRoleStr(user);
 
 document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
 document.cookie = `userRole=${roleStr}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;

 window.location.assign(getRedirectPath(user));
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
 const response = await fetch("/api/login", {
 method: "POST",
 headers: {
 "Content-Type": "application/json",
 "Accept": "application/json",
 },
 body: JSON.stringify({
 email: values.email.trim(), 
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
 const roleStr = getUserRoleStr(user);
 document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${maxAge}; samesite=lax`;
 document.cookie = `userRole=${roleStr}; path=/; max-age=${maxAge}; samesite=lax`;

 setStatusMessage("Đăng nhập thành công...");
 window.location.assign(getRedirectPath(user));
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
 <span className="text-[14px] font-bold tracking-tight text-[#2C3039]">MindNova AI</span>
 </div>

 {/* Content — căn giữa dọc */}
 <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-6">
 <div className="mb-5">
 <h1 className="text-[26px] font-bold text-[#2C3039] leading-tight tracking-tight">
 Welcome back
 </h1>
 <p className="mt-1.5 text-[13px] text-[#8A8478] leading-relaxed">
 Continue your personalized learning journey with{" "}
 <span className="text-[#C0392B] font-medium">AI-driven</span> insights.
 </p>
 </div>

 {statusMessage && (
 <div
 className={`mb-3 p-3 rounded-xl text-xs font-medium border ${
 statusMessage.includes("thành công")
 ? "bg-[#E8F8F0] text-[#27AE60] border-[#27AE60]/20"
 : "bg-[#FADBD8] text-[#C0392B] border-[#C0392B]/30"
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
 className="text-xs font-semibold text-[#C0392B] hover:text-[#C0392B] transition-colors"
 >
 Forgot password?
 </Link>
 }
 rightElement={
 <button
 type="button"
 onClick={togglePassword}
 className="text-[#B0B0C8] hover:text-[#C0392B] transition-colors focus:outline-none"
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
 <div className="w-[18px] h-[18px] rounded-[5px] border-2 border-[#D0D0E8] bg-white peer-checked:bg-[#FAF7F2] peer-checked:border-[#E8E2D9] transition-all duration-200 flex items-center justify-center shadow-sm group-hover:border-[#E8E2D9]">
 {values.rememberMe && (
 <></>
 )}
 </div>
 </div>
 <span className="text-[13px] text-[#8A8478] group-hover:text-[#2C3039] transition-colors">
 Remember me for 30 days
 </span>
 </label>
 <button
 type="submit"
 disabled={isLoading || !canSubmit}
 className="mt-1 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-[#C0392B] shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-[#C0392B]/30"
 >
 {isLoading ? "Signing in..." : <>Login <ArrowRightIcon /></>}
 </button>
 </form>

 <p className="mt-5 text-center text-[13px] text-[#8A8478]">
 Don&apos;t have an account?{" "}
 <button
 type="button"
 onClick={onFlipToRegister}
 className="font-semibold text-[#C0392B] hover:text-[#C0392B] transition-colors hover:underline underline-offset-2 focus:outline-none"
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