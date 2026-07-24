"use client";

import { useState } from "react";

const DEFAULT_API_BASE_URL = "http://127.0.0.1:8000/api";
const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || DEFAULT_API_BASE_URL).replace(/\/$/, "");

function readStoredToken(): string {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  const cookieToken = cookieValue ? decodeURIComponent(cookieValue) : "";
  const localToken = window.localStorage.getItem("accessToken") ?? "";

  return cookieToken || localToken;
}

function getAuthHeaders(): Record<string, string> {
  const token = readStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function toCsv(rows: Array<Record<string, string | number>>) {
  const headers = Object.keys(rows[0] ?? {});
  const escapeCell = (value: string | number) =>
    `"${String(value).replace(/"/g, '""')}"`;

  return [headers.join(","), ...rows.map((row) => headers.map((key) => escapeCell(row[key] ?? "")).join(","))].join("\n");
}

export function AdminUsersQuickActions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleExportCsv = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "GET",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Không thể export CSV. Hãy đăng nhập lại bằng tài khoản admin.");
      }

      const payload = await response.json();
      const rows = Array.isArray(payload.data) ? payload.data : [];
      const csv = toCsv(
        rows.map((row: Record<string, unknown>) => ({
          name: String(row.name ?? ""),
          email: String(row.email ?? ""),
          role: String((row.role as string | undefined) ?? ""),
          status: String((row.status as string | undefined) ?? ""),
        }))
      );

      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "mindnova-admin-users.csv";
      link.click();
      URL.revokeObjectURL(url);
      setStatus("Export CSV thành công.");
    } catch {
      setStatus("Không thể export CSV. Hãy kiểm tra token hoặc API URL.");
    }
  };

  const handleCreateUser = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          ...form,
          status: "active",
          is_locked: false,
        }),
      });

      let payload: { message?: string; errors?: Record<string, string[] | string> } | null = null;

      try {
        payload = (await response.json()) as {
          message?: string;
          errors?: Record<string, string[] | string>;
        };
      } catch {
        payload = null;
      }

      if (!response.ok) {
        const validationMessage = payload?.errors
          ? Object.values(payload.errors)
              .flatMap((value) => (Array.isArray(value) ? value : [value]))
              .join(" ")
          : payload?.message;

        if (response.status === 401 || response.status === 403 || response.redirected) {
          throw new Error("Bạn chưa đăng nhập hoặc không có quyền admin để tạo người dùng.");
        }

        throw new Error(validationMessage ?? "Tạo người dùng thất bại.");
      }

      setStatus("Tạo người dùng thành công.");
      setIsFormOpen(false);
      setForm({ name: "", email: "", password: "", role: "student" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Tạo người dùng thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap gap-3">
      <button
        type="button"
        onClick={handleExportCsv}
        className="rounded-2xl border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:bg-white/10"
      >
        Export CSV
      </button>

      <button
        type="button"
        onClick={() => setIsFormOpen((current) => !current)}
        className="rounded-2xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        + Add user
      </button>

      {isFormOpen && (
        <form
          onSubmit={handleCreateUser}
          className="mt-4 w-full rounded-[24px] border border-cyan-200 bg-white p-5 shadow-[0_18px_45px_-25px_rgba(8,145,178,0.55)]"
        >
          <div className="mb-4 flex flex-col gap-1">
            <p className="text-sm font-semibold text-slate-900">Thêm người dùng mới</p>
            <p className="text-xs text-slate-500">
              Điền từng trường bên dưới để tạo tài khoản cho học viên, giảng viên hoặc quản trị viên.
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Họ và tên</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                placeholder="VD: Nguyễn Văn A"
                autoComplete="name"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-cyan-500"
              />
              <span className="block text-xs text-slate-500">Tên hiển thị trong hệ thống.</span>
            </label>

            <label className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Email</span>
              <input
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="VD: admin@mindnova.ai"
                type="email"
                autoComplete="email"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-cyan-500"
              />
              <span className="block text-xs text-slate-500">Dùng để đăng nhập và nhận thông báo.</span>
            </label>

            <label className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Mật khẩu</span>
              <input
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                placeholder="Nhập mật khẩu"
                type="password"
                autoComplete="new-password"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none ring-0 transition focus:border-cyan-500"
              />
              <span className="block text-xs text-slate-500">Ít nhất 8 ký tự và dễ nhớ cho người dùng.</span>
            </label>

            <label className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
              <span className="block text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">Vai trò</span>
              <select
                value={form.role}
                onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-500"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
              <span className="block text-xs text-slate-500">Chọn quyền truy cập phù hợp cho tài khoản.</span>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo người dùng"}
            </button>
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>
        </form>
      )}

      {status && <p className="w-full rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{status}</p>}
    </div>
  );
}
