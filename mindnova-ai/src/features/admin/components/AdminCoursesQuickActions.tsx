"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import type { AdminCourseRow } from "@/src/features/admin/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type CategoryOption = {
  id: number;
  name: string;
};

type CourseStatus = "draft" | "published" | "archived";

type CourseFormState = {
  title: string;
  description: string;
  category_id: string;
  price: string;
  level: "beginner" | "intermediate" | "advanced";
  status: CourseStatus;
};

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

interface AdminCoursesQuickActionsProps {
  categories: CategoryOption[];
  courses: AdminCourseRow[];
}

function toLevelLabel(level: string): string {
  const value = level.toLowerCase();
  if (value.includes("beginner")) return "Cơ bản";
  if (value.includes("intermediate")) return "Trung cấp";
  if (value.includes("advanced")) return "Nâng cao";
  return level;
}

function toStatusLabel(status: string): string {
  const value = status.toLowerCase();
  if (value.includes("publish")) return "Đã duyệt";
  if (value.includes("draft")) return "Chờ duyệt";
  if (value.includes("archive")) return "Từ chối";
  return status;
}

function statusPillClass(status: string): string {
  const value = status.toLowerCase();
  if (value.includes("publish")) return "bg-emerald-100 text-emerald-700";
  if (value.includes("draft")) return "bg-amber-100 text-amber-700";
  if (value.includes("archive")) return "bg-rose-100 text-rose-700";
  return "bg-slate-100 text-slate-700";
}

async function readErrorMessage(response: Response, fallback: string): Promise<string> {
  const payload = await response.json().catch(() => null);
  return payload?.message ?? fallback;
}

export function AdminCoursesQuickActions({ categories, courses }: AdminCoursesQuickActionsProps) {
  const router = useRouter();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [form, setForm] = useState<CourseFormState>({
    title: "",
    description: "",
    category_id: "",
    price: "0",
    level: "beginner",
    status: "draft",
  });

  const [editForm, setEditForm] = useState<CourseFormState>({
    title: "",
    description: "",
    category_id: "",
    price: "0",
    level: "beginner",
    status: "draft",
  });

  const editingCourse = courses.find((course) => course.id === editingCourseId) ?? null;

  const openEdit = (course: AdminCourseRow) => {
    setEditingCourseId(course.id);
    setEditForm({
      title: course.title,
      description: course.description,
      category_id: course.categoryId ? String(course.categoryId) : "",
      price: String(course.price),
      level: (course.level as "beginner" | "intermediate" | "advanced") || "beginner",
      status: (course.status as CourseStatus) || "draft",
    });
    setStatus(null);
  };

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
          category_id: form.category_id ? Number(form.category_id) : null,
          price: Number(form.price || 0),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403 || response.redirected) {
          throw new Error("Bạn chưa đăng nhập hoặc không có quyền admin để tạo khóa học.");
        }

        throw new Error(payload?.message ?? "Không thể tạo khóa học.");
      }

      setStatus("Tạo khóa học thành công.");
      setIsFormOpen(false);
      setForm({
        title: "",
        description: "",
        category_id: "",
        price: "0",
        level: "beginner",
        status: "draft",
      });
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Tạo khóa học thất bại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateCourse = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!editingCourse) {
      setStatus("Không tìm thấy khóa học cần cập nhật.");
      return;
    }

    setIsUpdating(editingCourse.id);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses/${editingCourse.id}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          ...editForm,
          category_id: editForm.category_id ? Number(editForm.category_id) : null,
          price: Number(editForm.price || 0),
        }),
      });

      if (!response.ok) {
        const message = await readErrorMessage(response, "Cập nhật khóa học thất bại.");
        throw new Error(message);
      }

      setStatus("Cập nhật khóa học thành công.");
      setEditingCourseId(null);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Cập nhật khóa học thất bại.");
    } finally {
      setIsUpdating(null);
    }
  };

  const handleDeleteCourse = async (courseId: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa khóa học này?")) {
      return;
    }

    setIsDeleting(courseId);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses/${courseId}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
        credentials: "include",
      });

      if (!response.ok) {
        const message = await readErrorMessage(response, "Xóa khóa học thất bại.");
        throw new Error(message);
      }

      setStatus("Xóa khóa học thành công.");
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Xóa khóa học thất bại.");
    } finally {
      setIsDeleting(null);
    }
  };

  const handleModerate = async (courseId: number, nextStatus: CourseStatus, message: string) => {
    setIsUpdating(courseId);
    setStatus(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/courses/${courseId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({ status: nextStatus }),
      });

      if (!response.ok) {
        const errorMessage = await readErrorMessage(response, "Cập nhật kiểm duyệt khóa học thất bại.");
        throw new Error(errorMessage);
      }

      setStatus(message);
      router.refresh();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Cập nhật kiểm duyệt khóa học thất bại.");
    } finally {
      setIsUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => setIsFormOpen((current) => !current)}
        className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-violet-700 transition hover:bg-slate-100"
      >
        + Tạo khóa học
      </button>
      </div>

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
                <option value="draft">Bản nháp</option>
                <option value="published">Đã xuất bản</option>
                <option value="archived">Đã lưu trữ</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Danh mục</span>
              <select
                value={form.category_id}
                onChange={(event) => setForm((current) => ({ ...current, category_id: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500"
              >
                <option value="">Chưa phân loại</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Cấp độ</span>
              <select
                value={form.level}
                onChange={(event) => setForm((current) => ({ ...current, level: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500"
              >
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Giá</span>
              <input
                value={form.price}
                onChange={(event) => setForm((current) => ({ ...current, price: event.target.value }))}
                placeholder="0"
                type="number"
                min="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-violet-500"
              />
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

      {editingCourse && (
        <form onSubmit={handleUpdateCourse} className="rounded-2xl border border-indigo-200 bg-indigo-50/60 p-4 shadow-sm">
          <div className="mb-3">
            <p className="text-sm font-semibold text-slate-900">Chỉnh sửa khóa học: {editingCourse.title}</p>
            <p className="text-xs text-slate-500">Cập nhật thông tin và trạng thái kiểm duyệt khóa học.</p>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Tên khóa học</span>
              <input
                value={editForm.title}
                onChange={(event) => setEditForm((current) => ({ ...current, title: event.target.value }))}
                required
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Trạng thái</span>
              <select
                value={editForm.status}
                onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value as CourseStatus }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
              >
                <option value="draft">Chờ duyệt</option>
                <option value="published">Đã duyệt</option>
                <option value="archived">Từ chối</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Danh mục</span>
              <select
                value={editForm.category_id}
                onChange={(event) => setEditForm((current) => ({ ...current, category_id: event.target.value }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
              >
                <option value="">Chưa phân loại</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Cấp độ</span>
              <select
                value={editForm.level}
                onChange={(event) => setEditForm((current) => ({ ...current, level: event.target.value as CourseFormState["level"] }))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
              >
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Giá</span>
              <input
                value={editForm.price}
                onChange={(event) => setEditForm((current) => ({ ...current, price: event.target.value }))}
                type="number"
                min="0"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
              <span className="font-medium">Mô tả khóa học</span>
              <textarea
                value={editForm.description}
                onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
                className="min-h-24 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-indigo-500"
              />
            </label>
          </div>

          <div className="mt-3 flex items-center gap-3">
            <button
              type="submit"
              disabled={isUpdating === editingCourse.id}
              className="rounded-xl bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isUpdating === editingCourse.id ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
            <button
              type="button"
              onClick={() => setEditingCourseId(null)}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100"
            >
              Hủy
            </button>
          </div>
        </form>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200/80">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-slate-50/80 text-slate-600">
            <tr>
              <th className="px-4 py-3 font-medium">Khóa học</th>
              <th className="px-4 py-3 font-medium">Danh mục</th>
              <th className="px-4 py-3 font-medium">Cấp độ</th>
              <th className="px-4 py-3 font-medium">Giá</th>
              <th className="px-4 py-3 font-medium">Trạng thái</th>
              <th className="px-4 py-3 font-medium">Kiểm duyệt</th>
              <th className="px-4 py-3 font-medium">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {courses.map((course) => (
              <tr key={`${course.id}-${course.title}`} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
                <td className="px-4 py-3 font-medium text-slate-900">{course.title}</td>
                <td className="px-4 py-3 text-slate-600">{course.category}</td>
                <td className="px-4 py-3 text-slate-600">{toLevelLabel(course.level)}</td>
                <td className="px-4 py-3 text-slate-600">{course.price.toFixed(2)} USD</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClass(course.status)}`}>
                    {toStatusLabel(course.status)}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      disabled={isUpdating === course.id}
                      onClick={() => handleModerate(course.id, "published", "Khóa học đã được duyệt.")}
                      className="rounded-lg bg-emerald-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Duyệt
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating === course.id}
                      onClick={() => handleModerate(course.id, "archived", "Khóa học đã bị từ chối.")}
                      className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Từ chối
                    </button>
                    <button
                      type="button"
                      disabled={isUpdating === course.id}
                      onClick={() => handleModerate(course.id, "draft", "Khóa học đã chuyển về chờ duyệt.")}
                      className="rounded-lg bg-amber-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      Chờ duyệt
                    </button>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(course)}
                      className="rounded-lg border border-cyan-200 bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 hover:bg-cyan-100"
                    >
                      Sửa
                    </button>
                    <button
                      type="button"
                      disabled={isDeleting === course.id}
                      onClick={() => handleDeleteCourse(course.id)}
                      className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {isDeleting === course.id ? "Đang xóa..." : "Xóa"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {courses.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-6 text-center text-slate-500">
                  Chưa có dữ liệu khóa học.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {status && <p className="w-full rounded-xl bg-violet-50 px-3 py-2 text-sm text-violet-700">{status}</p>}
    </div>
  );
}
