"use client";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api";
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

function getStoredToken() {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  const cookieToken = cookieValue ? decodeURIComponent(cookieValue) : "";
  const localToken = window.localStorage.getItem("accessToken") ?? "";

  return cookieToken || localToken;
}

export function AdminTopbar() {
  const handleLogout = async () => {
    const token = getStoredToken();

    try {
      await fetch(`${API_BASE_URL}/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        credentials: "include",
      });
    } catch {
      // Ignore backend logout errors and continue local cleanup.
    } finally {
      window.localStorage.removeItem("accessToken");
      document.cookie = "accessToken=; Max-Age=0; path=/";
      window.location.replace("/login");
    }
  };

  return (
    <header className="flex h-20 shrink-0 items-center gap-4 border-b border-cyan-100/70 bg-white/75 px-5 backdrop-blur-2xl">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Đồng bộ trực tiếp
        </div>

        <div className="relative max-w-lg flex-1">
          <input
            type="search"
            placeholder="Tìm người dùng, doanh thu, khóa học..."
            className="w-full rounded-2xl border border-cyan-100 bg-white/90 px-4 py-3 text-sm text-slate-700 shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-cyan-300 hover:bg-cyan-50 hover:text-cyan-700">
          Xuất dữ liệu
        </button>
        <button className="rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_30px_-15px_rgba(79,70,229,0.9)] transition hover:from-cyan-400 hover:to-indigo-400">
          Làm mới dữ liệu
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Đăng xuất
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 text-sm font-bold text-white shadow-[0_14px_24px_-14px_rgba(37,99,235,0.9)]">
          A
        </div>
      </div>
    </header>
  );
}
