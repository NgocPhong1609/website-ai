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
    <header className="flex h-24 shrink-0 items-center gap-4 border-b border-slate-200 bg-white/80 px-5 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          Online sync
        </div>

        <div className="relative max-w-xl flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
          <input
            type="search"
            placeholder="Tìm nhanh người dùng, khóa học, doanh thu..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/90 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-cyan-300 focus:bg-white focus:ring-4 focus:ring-cyan-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:border-cyan-200 hover:bg-cyan-50 hover:text-cyan-700">
          Xuất báo cáo
        </button>
        <button className="rounded-2xl bg-gradient-to-r from-sky-500 via-cyan-500 to-indigo-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_18px_32px_-16px_rgba(14,165,233,0.9)] transition hover:brightness-110">
          Làm mới dữ liệu
        </button>

        <button
          type="button"
          aria-label="Notifications"
          className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg text-slate-600 transition hover:border-cyan-200 hover:text-cyan-700"
        >
          🔔
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-rose-500 ring-2 ring-white" />
        </button>

        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Đăng xuất
        </button>

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-2 py-1.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-sky-500 to-indigo-500 text-sm font-bold text-white">
            A
          </div>
          <div className="pr-1 text-left leading-tight">
            <p className="text-sm font-semibold text-slate-900">Admin</p>
            <p className="text-[11px] text-slate-500">Operations</p>
          </div>
        </div>
      </div>
    </header>
  );
}
