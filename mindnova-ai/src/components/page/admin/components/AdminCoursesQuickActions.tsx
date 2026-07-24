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

export function AdminCoursesQuickActions() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "draft",
  });

  const handleCreateCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          ...form,
          is_published: form.status === "published",
          published_at: form.status === "published" ? new Date().toISOString() : null,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403 || response.redirected) {
          throw new Error("Bạn chưa đăng nhập hoặc không có quyền admin để tạo khóa học.");
        }

        throw new Error(payload?.message ?? "Unable to create course");
      }

      setStatus("Tạo khóa học thành công.");
      setIsFormOpen(false);
      setForm({ title: "", description: "", status: "draft" });
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Tạo khóa học thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => setIsFormOpen((current) => !current)}
        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-slate-100"
      >
        + Create course
      </button>

      {isFormOpen && (
        <form
          onSubmit={handleCreateCourse}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
        >
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">Tạo khóa học mới</p>
            <p className="text-xs text-slate-500">Nhập tên khóa học, trạng thái xuất bản và mô tả chi tiết để bắt đầu nội dung.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Tên khóa học</span>
              <input
                value={form.title}
                onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                placeholder="VD: React cơ bản"
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Trạng thái</span>
              <select
                value={form.status}
                onChange={(event) => setForm((current) => ({ ...current, status: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
              <span className="font-medium">Mô tả khóa học</span>
              <textarea
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                placeholder="Mô tả mục tiêu, đối tượng và nội dung khóa học"
                required
                className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-violet-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-violet-600"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo khóa học"}
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

      {status && <p className="w-full rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700">{status}</p>}
    </div>
  );
}
