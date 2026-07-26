"use client";

import { useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

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

export function AdminCategoriesQuickActions() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    status: "active",
  });

  const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/categories`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Tạo danh mục thất bại.");
      }

      setStatus("Tạo danh mục thành công. Hãy tải lại trang để thấy dữ liệu mới.");
      setForm({ name: "", description: "", status: "active" });
      setIsOpen(false);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Tạo danh mục thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((current) => !current)}
        className="rounded-2xl bg-teal-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-teal-400"
      >
        + Thêm danh mục
      </button>

      {isOpen && (
        <form
          onSubmit={handleCreate}
          className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          <div className="grid gap-3 md:grid-cols-3">
            <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
              <span className="font-medium">Tên danh mục</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500"
              >
                <option value="active">Đang hoạt động</option>
                <option value="inactive">Ngưng hoạt động</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700 md:col-span-3">
              <span className="font-medium">Mô tả</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                rows={3}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-teal-500"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo danh mục"}
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Đóng
            </button>
          </div>
        </form>
      )}

      {status && <p className="w-full rounded-xl bg-teal-50 px-3 py-2 text-sm text-teal-700">{status}</p>}
    </div>
  );
}
