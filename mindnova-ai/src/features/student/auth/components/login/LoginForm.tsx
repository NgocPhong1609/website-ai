"use client";

import { useState, useCallback, useId, useEffect } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { getErrorMessage, readApiResponse } from "@/src/shared/lib/user-error";
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
 const isExpiredSession = new URLSearchParams(window.location.search).get("sessionExpired") === "1";
 if (isExpiredSession) {
 window.localStorage.removeItem("accessToken");
 window.localStorage.removeItem("userInfo");
 document.cookie = "accessToken=; path=/; max-age=0; samesite=lax";
 document.cookie = "userRole=; path=/; max-age=0; samesite=lax";
 return;
 }

 const token = window.localStorage.getItem("accessToken");
 const userInfoRaw = window.localStorage.getItem("userInfo");

 if (token && userInfoRaw) {
 try {
 const user = JSON.parse(userInfoRaw);
 const roleStr = getUserRoleStr(user);
 
 document.cookie = `accessToken=${encodeURIComponent(token)}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;
 document.cookie = `userRole=${roleStr}; path=/; max-age=${60 * 60 * 24 * 30}; samesite=lax`;

 toast.success('Đăng nhập thành công!');
  setTimeout(() => {
  window.location.assign(getRedirectPath(user));
  }, 1000);
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

 const payload = await readApiResponse(response, "Không thể đăng nhập. Vui lòng thử lại.");

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
 setStatusMessage(getErrorMessage(error, "Không thể đăng nhập. Vui lòng thử lại."));
 } finally {
 setIsLoading(false);
 }
 }, [values]);

 const togglePassword = useCallback(() => setShowPassword((v) => !v), []);
 const canSubmit = values.email.trim() !== "" && values.password.length >= 1;

 return (
 <div className="flex flex-col w-full h-full px-8 sm:px-10 py-6">


 {/* Content — căn giữa dọc */}
 <div className="flex flex-col justify-center w-full max-w-[380px] mx-auto py-6 my-auto">
 <div className="mb-5">
 <h1 className="text-[26px] font-bold text-slate-900 leading-tight tracking-tight">
 Chào mừng trở lại
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
 <FormField
 id={emailId}
 label="Email"
 type="email"

 autoComplete="email"
 value={values.email}
 onChange={handleChange("email")}

 />
 <FormField
 id={passwordId}
 label="Mật khẩu"
 type={showPassword ? "text" : "password"}

 autoComplete="current-password"
 value={values.password}
 onChange={handleChange("password")}

 labelRight={
 <Link
 href="/forgot-password"
 className="text-xs font-semibold text-blue-500 hover:text-blue-600 transition-colors"
 >
 Quên mật khẩu?
 </Link>
 }
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
 <button
 type="submit"
 disabled={isLoading || !canSubmit}
 className="mt-6 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[13px] font-semibold text-white bg-blue-500 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-y-0 disabled:shadow-none focus:outline-none focus:ring-4 focus:ring-blue-500/30"
 >
 {isLoading ? "Đang đăng nhập..." : <>Đăng nhập <ArrowRightIcon /></>}
 </button>
 </form>

 <p className="mt-5 text-center text-[13px] text-slate-500">
 Chưa có tài khoản?{" "}
 <button
 type="button"
 onClick={onFlipToRegister}
 className="font-semibold text-blue-500 hover:text-blue-600 transition-colors hover:underline underline-offset-2 focus:outline-none"
 >
 Đăng ký
 </button>
 </p>
 </div>

 {/* Footer — bám sát phía dưới */}
 <div className="mt-auto text-center">
 <p className="text-[11px] text-slate-400 leading-relaxed">
 © 2026 MindNova AI. Nền tảng học tập cá nhân hóa cùng AI.
 </p>
 </div>
 </div>
 );
}

