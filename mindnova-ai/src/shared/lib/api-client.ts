import { cookies } from "next/headers";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error(
      "[apiClient] NEXT_PUBLIC_API_URL is not set. Check your .env file."
    );
  }

  // Ensure base URL correctly targets the Laravel /api prefix even if .env omits it
  const baseUrl = API_BASE_URL.replace(/\/+$/, "");
  const apiPrefix = baseUrl.endsWith("/api") || endpoint.startsWith("/api") ? "" : "/api";
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const url = `${baseUrl}${apiPrefix}${cleanEndpoint}`;

  // Attach auth token from cookies (server-side only)
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("accessToken")?.value;
  const token = rawToken ? decodeURIComponent(rawToken) : undefined;

  const headers: Record<string, string> = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    signal: options.signal ?? AbortSignal.timeout(8000), // Prevent SSR blocking/hanging
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