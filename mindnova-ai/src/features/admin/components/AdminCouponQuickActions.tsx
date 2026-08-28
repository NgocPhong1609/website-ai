"use client";

import { useEffect, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type CourseOption = {
 id: number;
 title: string;
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

export function AdminCouponQuickActions() {
 const [isOpen, setIsOpen] = useState(false);
 const [isSubmitting, setIsSubmitting] = useState(false);
 const [status, setStatus] = useState<string | null>(null);
 const [courses, setCourses] = useState<CourseOption[]>([]);
 const [form, setForm] = useState({
 code: "",
 title: "",
 description: "",
 discount_type: "percent",
 value: "10",
 min_order_amount: "0",
 max_discount_amount: "",
 course_scope: "all",
 course_id: "",
 is_active: "true",
 });

 useEffect(() => {
 if (!isOpen) return;

 const fetchCourses = async () => {
 try {
 const response = await fetch(`${API_BASE_URL}/admin/courses`, {
 headers: getAuthHeaders(),
 credentials: "include",
 });

 const payload = await response.json().catch(() => null);

 if (!response.ok) {
 return;
 }

 const list = Array.isArray(payload?.data) ? payload.data : [];
 setCourses(
 list.map((course: Record<string, unknown>) => ({
 id: Number(course.id ?? 0),
 title: String(course.title ?? "Khóa học"),
 }))
 );
 } catch {
 setCourses([]);
 }
 };

 fetchCourses();
 }, [isOpen]);

 const handleCreate = async (event: React.FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 setIsSubmitting(true);
 setStatus(null);

 try {
 const courseId = form.course_scope === "course" && form.course_id ? Number(form.course_id) : null;

 const response = await fetch(`${API_BASE_URL}/admin/coupons`, {
 method: "POST",
 headers: getAuthHeaders(),
 credentials: "include",
 body: JSON.stringify({
 ...form,
 course_id: courseId,
 value: Number(form.value || 0),
 min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : null,
 max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
 is_active: form.is_active === "true",
 }),
 });

 const payload = await response.json().catch(() => null);

 if (!response.ok) {
 throw new Error(payload?.message ?? "Tạo mã giảm giá thất bại.");
 }

 setStatus("Tạo mã giảm giá thành công. Hãy tải lại trang để thấy dữ liệu mới.");
 setForm({
 code: "",
 title: "",
 description: "",
 discount_type: "percent",
 value: "10",
 min_order_amount: "0",
 max_discount_amount: "",
 course_scope: "all",
 course_id: "",
 is_active: "true",
 });
 setIsOpen(false);
 } catch (error) {
 setStatus(error instanceof Error ? error.message : "Tạo mã giảm giá thất bại.");
 } finally {
 setIsSubmitting(false);
 }
 };

 return (
 <div className="flex flex-wrap items-center gap-3">
 <button
 type="button"
 onClick={() => setIsOpen((current) => !current)}
 className="rounded-2xl -[#2C3039] px-4 py-2 text-sm font-semibold text-white transition hover:-[#2C3039]"
 >
 + Tạo mã giảm giá
 </button>

 {isOpen && (
 <form onSubmit={handleCreate} className="w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
 <div className="grid gap-3 md:grid-cols-2">
 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Mã giảm giá</span>
 <input
 value={form.code}
 onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))}
 placeholder="VD: SAVE10"
 required
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Tiêu đề</span>
 <input
 value={form.title}
 onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
 placeholder="Khuyến mãi mùa hè"
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Loại giảm</span>
 <select
 value={form.discount_type}
 onChange={(event) => setForm((current) => ({ ...current, discount_type: event.target.value }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 >
 <option value="percent">Phần trăm</option>
 <option value="fixed">Số tiền cố định</option>
 </select>
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Giá trị</span>
 <input
 type="number"
 min="0"
 value={form.value}
 onChange={(event) => setForm((current) => ({ ...current, value: event.target.value }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Áp dụng</span>
 <select
 value={form.course_scope}
 onChange={(event) => setForm((current) => ({ ...current, course_scope: event.target.value, course_id: event.target.value === "course" ? current.course_id : "" }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 >
 <option value="all">Cho toàn bộ đơn hàng</option>
 <option value="course">Chỉ cho một khóa học</option>
 </select>
 </label>

 {form.course_scope === "course" && (
 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Chọn khóa học</span>
 <select
 value={form.course_id}
 onChange={(event) => setForm((current) => ({ ...current, course_id: event.target.value }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 required={form.course_scope === "course"}
 >
 <option value="">-- Chọn khóa học --</option>
 {courses.map((course) => (
 <option key={course.id} value={course.id}>
 {course.title}
 </option>
 ))}
 </select>
 </label>
 )}

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Đơn tối thiểu</span>
 <input
 type="number"
 min="0"
 value={form.min_order_amount}
 onChange={(event) => setForm((current) => ({ ...current, min_order_amount: event.target.value }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Giảm tối đa</span>
 <input
 type="number"
 min="0"
 value={form.max_discount_amount}
 onChange={(event) => setForm((current) => ({ ...current, max_discount_amount: event.target.value }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 />
 </label>

 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Trạng thái</span>
 <select
 value={form.is_active}
 onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.value }))}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 >
 <option value="true">Hoạt động</option>
 <option value="false">Tạm dừng</option>
 </select>
 </label>

 <label className="space-y-1 text-sm text-slate-700 md:col-span-2">
 <span className="font-medium">Mô tả</span>
 <textarea
 value={form.description}
 onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
 rows={3}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#2C3039]"
 />
 </label>
 </div>

 <div className="mt-3 flex items-center gap-3">
 <button type="submit" disabled={isSubmitting} className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
 {isSubmitting ? "Đang tạo..." : "Tạo mã"}
 </button>
 <button type="button" onClick={() => setIsOpen(false)} className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100">
 Đóng
 </button>
 </div>
 </form>
 )}

 {status && <p className="w-full rounded-xl bg-emerald-50 px-3 py-2 text-sm -[#2C3039]">{status}</p>}
 </div>
 );
}
