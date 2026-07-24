import axios from "axios";

// Hàm helper để đọc cookie ở phía client
function getCookie(name: string) {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
}

export const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "",
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json",
  },
});

// Interceptor tự động thêm token vào header request
axiosClient.interceptors.request.use(
  (config) => {
    // Ưu tiên đọc từ localStorage, fallback sang cookie
    let token: string | null = null;
    if (typeof window !== "undefined") {
      token = window.localStorage.getItem("accessToken");
    }
    if (!token) {
      token = getCookie("accessToken") || null;
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor xử lý lỗi chung (ví dụ: token hết hạn)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Có thể dispatch event đăng xuất hoặc redirect về /login ở đây
      console.warn("Unauthorized, token may be expired.");
    }
    return Promise.reject(error);
  }
);
