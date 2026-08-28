"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { NoData } from "@/src/shared/components/ui/NoData";

import type { AdminCategoryRow } from "@/src/features/admin/types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type CategoryStatus = "pending" | "active" | "inactive";

type CategoryFormState = {
 name: string;
 description: string;
 status: CategoryStatus;
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

interface AdminCategoriesQuickActionsProps {
 rows: AdminCategoryRow[];
}

const statusOptions: Array<{ value: CategoryStatus; label: string }> = [
 { value: "pending", label: "Chờ duyệt" },
 { value: "active", label: "Đã duyệt" },
 { value: "inactive", label: "Từ chối" },
];

function toStatusLabel(status: string): string {
 const value = status.toLowerCase();
 if (value.includes("pending")) return "Chờ duyệt";
 if (value.includes("active")) return "Đã duyệt";
 if (value.includes("inactive")) return "Từ chối";
 return status;
}

function statusPillClass(status: string): string {
 const value = status.toLowerCase();
 if (value.includes("pending")) return "bg-amber-100 text-amber-700";
 if (value.includes("active")) return "-[#FAF7F2] -[#2C3039]";
 if (value.includes("inactive")) return "bg-rose-100 text-rose-700";
 return "bg-slate-100 text-slate-700";
}

export function AdminCategoriesQuickActions({ rows }: AdminCategoriesQuickActionsProps) {
 const router = useRouter();
 const [isOpen, setIsOpen] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [isUpdating, setIsUpdating] = useState<number | null>(null);
 const [isDeleting, setIsDeleting] = useState<number | null>(null);
 const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
 const [status, setStatus] = useState<string | null>(null);
 const [form, setForm] = useState<CategoryFormState>({
 name: "",
 description: "",
 status: "pending",
 });

 const editingCategory = useMemo(
 () => rows.find((row) => row.id === editingCategoryId) ?? null,
 [rows, editingCategoryId],
 );

 const [editForm, setEditForm] = useState<CategoryFormState>({
 name: "",
 description: "",
 status: "pending",
 });

 const handleOpenEdit = (category: AdminCategoryRow) => {
 setEditingCategoryId(category.id);
 setEditForm({
 name: category.name,
 description: category.description,
 status: (category.status as CategoryStatus) || "pending",
 });
 setStatus(null);
 };

 const handleApiError = async (response: Response, fallbackMessage: string): Promise<never> => {
 const payload = await response.json().catch(() => null);
 throw new Error(payload?.message ?? fallbackMessage);
 };

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

 setStatus("Tạo danh mục thành công.");
 setForm({ name: "", description: "", status: "pending" });
 setIsOpen(false);
 router.refresh();
 } catch (error) {
 setStatus(error instanceof Error ? error.message : "Tạo danh mục thất bại.");
 } finally {
 setIsSubmitting(false);
 }
 };

 const handleUpdate = async (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();

 if (!editingCategory) {
 setStatus("Không tìm thấy danh mục cần cập nhật.");
 return;
 }

 setIsUpdating(editingCategory.id);
 setStatus(null);

 try {
 const response = await fetch(`${API_BASE_URL}/admin/categories/${editingCategory.id}`, {
 method: "PUT",
 headers: getAuthHeaders(),
 credentials: "include",
 body: JSON.stringify(editForm),
 });

 if (!response.ok) {
 await handleApiError(response, "Cập nhật danh mục thất bại.");
 }

 setStatus("Cập nhật danh mục thành công.");
 setEditingCategoryId(null);
 router.refresh();
 } catch (error) {
 setStatus(error instanceof Error ? error.message : "Cập nhật danh mục thất bại.");
 } finally {
 setIsUpdating(null);
 }
 };

 const handleDelete = async (categoryId: number) => {
 if (!window.confirm("Bạn có chắc muốn xóa danh mục này?")) {
 return;
 }

 setIsDeleting(categoryId);
 setStatus(null);

 try {
 const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
 method: "DELETE",
 headers: getAuthHeaders(),
 credentials: "include",
 });

 if (!response.ok) {
 await handleApiError(response, "Xóa danh mục thất bại.");
 }

 setStatus("Xóa danh mục thành công.");
 router.refresh();
 } catch (error) {
 setStatus(error instanceof Error ? error.message : "Xóa danh mục thất bại.");
 } finally {
 setIsDeleting(null);
 }
 };

 const handleModerate = async (categoryId: number, nextStatus: CategoryStatus, message: string) => {
 setIsUpdating(categoryId);
 setStatus(null);

 try {
 const response = await fetch(`${API_BASE_URL}/admin/categories/${categoryId}`, {
 method: "PUT",
 headers: getAuthHeaders(),
 credentials: "include",
 body: JSON.stringify({ status: nextStatus }),
 });

 if (!response.ok) {
 await handleApiError(response, "Cập nhật kiểm duyệt thất bại.");
 }

 setStatus(message);
 router.refresh();
 } catch (error) {
 setStatus(error instanceof Error ? error.message : "Cập nhật kiểm duyệt thất bại.");
 } finally {
 setIsUpdating(null);
 }
 };

 return (
 <div className="space-y-4">
 <div className="flex flex-wrap items-center gap-3">
 <button
 type="button"
 onClick={() => setIsOpen((current) => !current)}
 className="rounded-2xl -[#C0392B] px-4 py-2 text-sm font-semibold text-white transition hover:-[#C0392B]"
 >
 + Thêm danh mục
 </button>
 </div>

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
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Trạng thái</span>
 <select
 value={form.status}
 onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as CategoryStatus }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 >
 {statusOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </label>

 <label className="space-y-1 text-sm text-slate-700 md:col-span-3">
 <span className="font-medium">Mô tả</span>
 <textarea
 value={form.description}
 onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
 rows={3}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 />
 </label>
 </div>

 <div className="mt-3 flex items-center gap-3">
 <button
 type="submit"
 disabled={isSubmitting}
 className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
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

 {editingCategory && (
 <form onSubmit={handleUpdate} className="rounded-2xl border -[#FAF7F2] bg-cyan-50/60 p-4 shadow-sm">
 <div className="mb-3 text-sm font-semibold text-slate-900">Chỉnh sửa danh mục: {editingCategory.name}</div>
 <div className="grid gap-3 md:grid-cols-3">
 <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
 <span className="font-medium">Tên danh mục</span>
 <input
 value={editForm.name}
 onChange={(event) => setEditForm((current) => ({ ...current, name: event.target.value }))}
 required
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Trạng thái</span>
 <select
 value={editForm.status}
 onChange={(event) => setEditForm((current) => ({ ...current, status: event.target.value as CategoryStatus }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 >
 {statusOptions.map((option) => (
 <option key={option.value} value={option.value}>
 {option.label}
 </option>
 ))}
 </select>
 </label>

 <label className="space-y-1 text-sm text-slate-700 md:col-span-3">
 <span className="font-medium">Mô tả</span>
 <textarea
 value={editForm.description}
 onChange={(event) => setEditForm((current) => ({ ...current, description: event.target.value }))}
 rows={3}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 />
 </label>
 </div>

 <div className="mt-3 flex items-center gap-3">
 <button
 type="submit"
 disabled={isUpdating === editingCategory.id}
 className="rounded-xl -[#C0392B] px-4 py-2 text-sm font-semibold text-white transition hover:-[#C0392B] disabled:cursor-not-allowed disabled:opacity-60"
 >
 {isUpdating === editingCategory.id ? "Đang lưu..." : "Lưu thay đổi"}
 </button>
 <button
 type="button"
 onClick={() => setEditingCategoryId(null)}
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
 <th className="px-4 py-3 font-medium">Tên</th>
 <th className="px-4 py-3 font-medium">Định danh</th>
 <th className="px-4 py-3 font-medium">Trạng thái</th>
 <th className="px-4 py-3 font-medium">Kiểm duyệt</th>
 <th className="px-4 py-3 font-medium">Thao tác</th>
 </tr>
 </thead>
 <tbody>
 {rows.map((row) => (
 <tr key={row.id} className="border-t border-slate-200 bg-white hover:bg-cyan-50/35">
 <td className="px-4 py-3 font-medium text-slate-900">{row.name}</td>
 <td className="px-4 py-3 text-slate-600">{row.slug}</td>
 <td className="px-4 py-3">
 <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusPillClass(row.status)}`}>
 {toStatusLabel(row.status)}
 </span>
 </td>
 <td className="px-4 py-3">
 <div className="flex flex-wrap gap-2">
 <button
 type="button"
 disabled={isUpdating === row.id}
 onClick={() => handleModerate(row.id, "active", "Đã duyệt danh mục thành công.")}
 className="rounded-lg -[#2C3039] px-2.5 py-1 text-xs font-semibold text-white hover:-[#2C3039] disabled:cursor-not-allowed disabled:opacity-60"
 >
 Duyệt
 </button>
 <button
 type="button"
 disabled={isUpdating === row.id}
 onClick={() => handleModerate(row.id, "inactive", "Đã từ chối danh mục.")}
 className="rounded-lg bg-rose-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
 >
 Từ chối
 </button>
 <button
 type="button"
 disabled={isUpdating === row.id}
 onClick={() => handleModerate(row.id, "pending", "Đã chuyển danh mục về chờ duyệt.")}
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
 onClick={() => handleOpenEdit(row)}
 className="rounded-lg border -[#FAF7F2] bg-cyan-50 px-2.5 py-1 text-xs font-semibold -[#C0392B] hover:-[#FAF7F2]"
 >
 Sửa
 </button>
 <button
 type="button"
 disabled={isDeleting === row.id}
 onClick={() => handleDelete(row.id)}
 className="rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {isDeleting === row.id ? "Đang xóa..." : "Xóa"}
 </button>
 </div>
 </td>
 </tr>
 ))}

 {rows.length === 0 && (
 <tr>
 <td colSpan={5} className="p-0">
 <NoData title="Không có dữ liệu" description="Chưa có dữ liệu danh mục." className="py-6" />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {status && <p className="w-full rounded-xl bg-teal-50 px-3 py-2 text-sm -[#C0392B]">{status}</p>}
 </div>
 );
}
