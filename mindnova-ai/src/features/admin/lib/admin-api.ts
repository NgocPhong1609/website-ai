"use client";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000";
const RAW_BASE_URL = process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL;
const API_BASE = RAW_BASE_URL.replace(/\/$/, "").replace(/\/api$/i, "");

function resolveApiUrl(path: string): string {
 const normalized = path.startsWith("/") ? path : `/${path}`;
 const withApiPrefix = normalized.startsWith("/api/") ? normalized : `/api${normalized}`;
 return `${API_BASE}${withApiPrefix}`;
}

function readToken(): string {
 const cookieValue = document.cookie
 .split("; ")
 .find((row) => row.startsWith("accessToken="))
 ?.split("=")[1];

 const cookieToken = cookieValue ? decodeURIComponent(cookieValue) : "";
 const localToken = window.localStorage.getItem("accessToken") ?? "";

 return cookieToken || localToken;
}

export async function adminApi<T>(path: string, options: RequestInit = {}): Promise<T> {
 const token = readToken();
 const headers = new Headers(options.headers || {});
 headers.set("Accept", "application/json");

 if (!(options.body instanceof FormData)) {
 headers.set("Content-Type", "application/json");
 }

 if (token) {
 headers.set("Authorization", `Bearer ${token}`);
 }

 const response = await fetch(resolveApiUrl(path), {
 ...options,
 headers,
 credentials: "include",
 });

 const payload = await response.json().catch(() => null);

 if (!response.ok) {
 throw new Error(payload?.message ?? `Request failed: ${response.status}`);
 }

 return payload as T;
}
