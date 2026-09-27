"use client";

import { getErrorMessage, readApiResponse } from "@/src/shared/lib/user-error";
import { useState } from "react";

import { clientApiUrl } from "@/src/shared/lib/api-url";

const API_BASE_URL = clientApiUrl();

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

 const payload = await readApiResponse(response, "Không thể cập nhật trạng thái.");

 const nextStatus = String(payload?.data?.status ?? payload?.user?.status ?? status);
 setStatus(nextStatus);
 } catch (error) {
 window.alert(getErrorMessage(error, "Không thể cập nhật trạng thái tài khoản. Vui lòng thử lại."));
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
 ? "bg-emerald-50 text-[#0F172A] hover:bg-[#F8FAFC]"
 : "bg-rose-50 text-rose-700 hover:bg-rose-100"
 }`}
 >
 {isLoading ? "Đang xử lý..." : isBanned ? "Mở khóa" : "Khóa tài khoản"}
 </button>
 );
}
