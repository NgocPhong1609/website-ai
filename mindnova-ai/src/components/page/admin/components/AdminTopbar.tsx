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
    <header className="flex h-20 shrink-0 items-center gap-4 border-b border-slate-200/70 bg-white/85 px-5 backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-3">
        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          Live sync
        </div>

        <div className="relative max-w-lg flex-1">
          <input
            type="search"
            placeholder="Search users, revenue, courses..."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-400 focus:bg-white focus:ring-4 focus:ring-violet-100"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-violet-300 hover:bg-violet-50 hover:text-violet-700">
          Export
        </button>
        <button className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          + New item
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
        >
          Logout
        </button>
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-cyan-400 text-sm font-bold text-white shadow-lg shadow-violet-500/20">
          A
        </div>
      </div>
    </header>
  );
}
