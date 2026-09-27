import { cookies } from "next/headers";
import { readApiResponse } from "./user-error";
import { backendApiUrl } from "./backend-url";

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = backendApiUrl(endpoint);

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

  return readApiResponse<T>(response, "Không thể tải dữ liệu. Vui lòng thử lại.");
}