import { cookies } from "next/headers";

import { readApiResponse } from "./user-error";
import { backendApiUrl } from "./backend-url";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = backendApiUrl(endpoint);

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
    signal: options.signal ?? AbortSignal.timeout(15000), // Prevent SSR blocking/hanging (15s limit)
    ...options,
    headers,
  });

  return readApiResponse<T>(response, "Không thể tải dữ liệu. Vui lòng thử lại.");
}
