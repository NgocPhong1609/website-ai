import { cookies } from "next/headers";

const API_BASE_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "[apiClient] BACKEND_URL or NEXT_PUBLIC_API_URL is not set. Check your .env file."
    );
  }

  // Ensure base URL correctly targets the Laravel /api prefix without duplicating /api/api
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  let cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  if (baseUrl.endsWith("/api") && cleanEndpoint.startsWith("/api")) {
    cleanEndpoint = cleanEndpoint.slice(4);
  }
  const apiPrefix = baseUrl.endsWith("/api") || cleanEndpoint.startsWith("/api") ? "" : "/api";

  const url = `${baseUrl}${apiPrefix}${cleanEndpoint}`;

  // Attach auth token safely from cookies (server-side support with fallbacks)
  let token: string | undefined = undefined;
  try {
    const cookieStore = await cookies();
    // Thử quét qua các tên cookie phổ biến để tránh lệch pha tên biến
    const rawToken = 
      cookieStore.get("accessToken")?.value || 
      cookieStore.get("token")?.value || 
      cookieStore.get("auth_token")?.value;
      
    token = rawToken ? decodeURIComponent(rawToken) : undefined;
  } catch {
    // Trường hợp chạy ở môi trường ngoại lệ không gọi được cookies()
    token = undefined;
  }

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    signal: options.signal ?? AbortSignal.timeout(15000), // Prevent SSR blocking/hanging (15s limit)
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorText = await response.text();
    const compactBody = errorText.replace(/\s+/g, " ").slice(0, 220);

    if (response.status === 401) {
      throw new Error("[apiClient] Unauthorized (401). Token may have expired.");
    }

    throw new Error(
      `[apiClient] HTTP ${response.status} ${response.statusText} — ${url} | body: ${compactBody}`
    );
  }

  // Handle empty responses (e.g., 204 No Content)
  const text = await response.text();

  if (!text) {
    return {} as T;
  }

  const contentType = response.headers.get("content-type") ?? "";
  const isJson = contentType.includes("application/json");

  if (!isJson) {
    const compactBody = text.replace(/\s+/g, " ").slice(0, 220);
    throw new Error(
      `[apiClient] Expected JSON but got '${contentType || "unknown"}' from ${url}. ` +
        `Check NEXT_PUBLIC_API_URL and API auth. body: ${compactBody}`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    const compactBody = text.replace(/\s+/g, " ").slice(0, 220);
    throw new Error(
      `[apiClient] Invalid JSON response from ${url}. body: ${compactBody}`
    );
  }
}