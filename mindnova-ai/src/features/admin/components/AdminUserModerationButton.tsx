"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

function readStoredToken(): string {
 const cookieValue = document.cookie
 .split("; ")
 .find((row) => row.startsWith("accessToken="))
 ?.split("=")[1];

 const cookieToken = cookieValue ? decodeURIComponent(cookieValue) : "";
 const localToken = window.localStorage.getItem("accessToken") ?? "";

 return cookieToken || localToken;
}

function getAuthHeaders(): Record<string, string> {
 const token = readStoredToken();

 return {
 "Content-Type": "application/json",
 ...(token ? { Authorization: `Bearer ${token}` } : {}),
 };
}

interface AdminUserModerationButtonProps {
 userId: number;
 initialStatus: string;
}

export function AdminUserModerationButton({ userId, initialStatus }: AdminUserModerationButtonProps) {
 const [status, setStatus] = useState(initialStatus);
 const [isLoading, setIsLoading] = useState(false);

 const isBanned = status.toLowerCase() === "banned";

 const handleToggle = async () => {
 setIsLoading(true);

 try {
 const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, {
 method: "POST",
 headers: getAuthHeaders(),
 credentials: "include",
 });

 const payload = await response.json().catch(() => null);

 if (!response.ok) {
 throw new Error(payload?.message ?? "Không thể cập nhật trạng thái.");
 }

 const nextStatus = String(payload?.data?.status ?? payload?.user?.status ?? status);
 setStatus(nextStatus);
 } catch {
 // Keep current status when call fails.
 } finally {
 setIsLoading(false);
 }
 };

 return (
 <button
 type="button"
 onClick={handleToggle}
 disabled={isLoading || userId === 0}
 className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
 isBanned
 ? "bg-emerald-50 -[#2C3039] hover:-[#FAF7F2]"
 : "bg-rose-50 text-rose-700 hover:bg-rose-100"
 }`}
 >
 {isLoading ? "Đang xử lý..." : isBanned ? "Mở khóa" : "Khóa tài khoản"}
 </button>
 );
}
