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

  const url = `${API_BASE_URL}${endpoint}`;

  // Attach auth token from cookies (server-side only)
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("[apiClient] Unauthorized (401). Token may have expired.");
    }
    throw new Error(
      `[apiClient] HTTP ${response.status} ${response.statusText} — ${url}`
    );
  }

  // Handle empty responses (e.g., 204 No Content)
  const text = await response.text();
  return text ? (JSON.parse(text) as T) : ({} as T);
}