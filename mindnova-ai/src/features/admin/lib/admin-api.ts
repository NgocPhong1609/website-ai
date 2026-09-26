"use client";

import { clientApiUrl } from "@/src/shared/lib/api-url";

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

 const response = await fetch(clientApiUrl(path), {
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
