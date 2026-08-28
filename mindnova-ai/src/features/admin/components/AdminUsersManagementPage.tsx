"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/src/features/admin/lib/admin-api";

type UserRow = {
 id: number;
 name: string;
 email: string;
 role: "teacher" | "student" | "guest" | string;
 status: string;
 is_locked: boolean;
 last_login_at?: string | null;
 teacher_verification_status?: string;
 created_at?: string;
};

type UserListResponse = {
 data: UserRow[];
 summary: {
 teachers: number;
 students: number;
 guests: number;
 locked: number;
 };
};

type TeacherReviewRow = {
 id: number;
 name: string;
 email: string;
 status: string;
 note?: string | null;
 bio?: string | null;
};

type UserActivityResponse = {
 user: {
 id: number;
 name: string;
 email: string;
 role: string;
 };
 login_logs: Array<{ time: string; ip_address?: string | null }>;
 study_time_seconds: number;
 history: Array<{ action: string; time: string }>;
};

export function AdminUsersManagementPage() {
 const [users, setUsers] = useState<UserRow[]>([]);
 const [summary, setSummary] = useState<UserListResponse["summary"]>({
 teachers: 0,
 students: 0,
 guests: 0,
 locked: 0,
 });
 const [teacherQueue, setTeacherQueue] = useState<TeacherReviewRow[]>([]);
 const [activity, setActivity] = useState<UserActivityResponse | null>(null);
 const [search, setSearch] = useState("");
 const [role, setRole] = useState("");
 const [status, setStatus] = useState("");
 const [loading, setLoading] = useState(false);
 const [message, setMessage] = useState<string | null>(null);

 const loadAll = async () => {
 setLoading(true);
 setMessage(null);

 try {
 const params = new URLSearchParams();
 if (search) params.set("search", search);
 if (role) params.set("role", role);
 if (status) params.set("status", status);

 const [usersRes, teachersRes] = await Promise.all([
 adminApi<UserListResponse>(`/admin/users?${params.toString()}`),
 adminApi<{ data: TeacherReviewRow[] }>("/admin/teachers/review-queue"),
 ]);

 setUsers(usersRes.data);
 setSummary(usersRes.summary);
 setTeacherQueue(teachersRes.data);
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu.");
 } finally {
 setLoading(false);
 }
 };

 useEffect(() => {
 void loadAll();
 }, []);

 useEffect(() => {
 const handleRefresh = () => {
 void loadAll();
 };

 window.addEventListener("admin:refresh-data", handleRefresh);
 return () => window.removeEventListener("admin:refresh-data", handleRefresh);
 }, [search, role, status]);

 const lockToggle = async (user: UserRow) => {
 try {
 const path = user.is_locked ? `/admin/users/${user.id}/unlock` : `/admin/users/${user.id}/lock`;
 await adminApi<{ message: string }>(path, { method: "POST" });
 await loadAll();
 setMessage(user.is_locked ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.");
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Cập nhật trạng thái thất bại.");
 }
 };

 const removeUser = async (userId: number) => {
 if (!window.confirm("Xóa tài khoản này?")) return;

 try {
 await adminApi<{ message: string }>(`/admin/users/${userId}`, { method: "DELETE" });
 await loadAll();
 setMessage("Đã xóa tài khoản.");
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Xóa tài khoản thất bại.");
 }
 };

 const reviewTeacher = async (teacherId: number, reviewStatus: "approved" | "rejected") => {
 try {
 await adminApi(`/admin/teachers/${teacherId}/verify`, {
 method: "PATCH",
 body: JSON.stringify({
 status: reviewStatus,
 note: reviewStatus === "approved" ? "Hồ sơ hợp lệ." : "Cần bổ sung thông tin/bằng cấp.",
 }),
 });
 await loadAll();
 setMessage("Đã cập nhật duyệt hồ sơ giáo viên.");
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Duyệt hồ sơ thất bại.");
 }
 };

 const viewActivity = async (userId: number) => {
 try {
 const payload = await adminApi<UserActivityResponse>(`/admin/users/${userId}/activity`);
 setActivity(payload);
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Không thể tải lịch sử người dùng.");
 }
 };

 return (
 <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
 <section className="rounded-2xl border -[#FAF7F2]/20 bg-[linear-gradient(120deg,#0b1d40_0%,#155e75_45%,#134e4a_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(7,18,45,0.8)]">
 <p className="text-[10px] uppercase tracking-[0.34em] -[#FAF7F2]/70">User Management</p>
 <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Quản lý người dùng và phân quyền</h1>
 <p className="mt-1 max-w-3xl text-xs text-slate-100/90">Cấp quyền, khóa/xóa tài khoản Teacher, Student, Guest; theo dõi đăng nhập, thời gian học, lịch sử thao tác; duyệt hồ sơ giáo viên.</p>
 </section>

 <section className="grid gap-4 md:grid-cols-4">
 <StatCard label="Teacher" value={summary.teachers} />
 <StatCard label="Student" value={summary.students} />
 <StatCard label="Guest" value={summary.guests} />
 <StatCard label="Đang bị khóa" value={summary.locked} />
 </section>

 <section className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <div className="grid gap-3 md:grid-cols-4">
 <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm theo tên/email" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
 <select value={role} onChange={(e) => setRole(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
 <option value="">Tất cả vai trò</option>
 <option value="teacher">Teacher</option>
 <option value="student">Student</option>
 <option value="guest">Guest</option>
 </select>
 <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
 <option value="">Tất cả trạng thái</option>
 <option value="active">Active</option>
 <option value="inactive">Inactive</option>
 <option value="banned">Banned</option>
 </select>
 <button onClick={() => void loadAll()} className="rounded-xl -[#C0392B] px-4 py-2 text-sm font-semibold text-white">Lọc dữ liệu</button>
 </div>
 </section>

 <section className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <h2 className="mb-3 text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Danh sách tài khoản</h2>
 <div className="overflow-x-auto">
 <table className="min-w-full text-sm">
 <thead className="bg-slate-50 text-slate-600">
 <tr>
 <th className="px-3 py-2 text-left">Người dùng</th>
 <th className="px-3 py-2 text-left">Vai trò</th>
 <th className="px-3 py-2 text-left">Trạng thái</th>
 <th className="px-3 py-2 text-left">Đăng nhập cuối</th>
 <th className="px-3 py-2 text-left">Thao tác</th>
 </tr>
 </thead>
 <tbody>
 {users.map((user) => (
 <tr key={user.id} className="border-t border-slate-200">
 <td className="px-3 py-2">
 <p className="font-medium text-slate-900">{user.name}</p>
 <p className="text-xs text-slate-500">{user.email}</p>
 </td>
 <td className="px-3 py-2">{user.role}</td>
 <td className="px-3 py-2">{user.status}{user.is_locked ? " (đã khóa)" : ""}</td>
 <td className="px-3 py-2">{user.last_login_at ?? "-"}</td>
 <td className="px-3 py-2">
 <div className="flex flex-wrap gap-2">
 <button onClick={() => void lockToggle(user)} className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">{user.is_locked ? "Mở khóa" : "Khóa"}</button>
 <button onClick={() => void viewActivity(user.id)} className="rounded-lg bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800">Lịch sử</button>
 <button onClick={() => void removeUser(user.id)} className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800">Xóa</button>
 </div>
 </td>
 </tr>
 ))}

 {users.length === 0 && (
 <tr>
 <td colSpan={5} className="px-4 py-6 text-center text-slate-500">{loading ? "Đang tải..." : "Không có dữ liệu"}</td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </section>

 <section className="grid gap-4 xl:grid-cols-2">
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <h3 className="text-base font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Duyệt hồ sơ giáo viên</h3>
 <div className="mt-3 space-y-3">
 {teacherQueue.map((teacher) => (
 <div key={teacher.id} className="rounded-xl border border-slate-200 p-3">
 <p className="font-medium text-slate-900">{teacher.name} ({teacher.email})</p>
 <p className="mt-1 text-xs text-slate-500">{teacher.bio || "Chưa có mô tả kinh nghiệm/bằng cấp"}</p>
 <p className="mt-1 text-xs text-slate-600">Trạng thái: {teacher.status}</p>
 <div className="mt-2 flex gap-2">
 <button onClick={() => void reviewTeacher(teacher.id, "approved")} className="rounded-lg -[#FAF7F2] px-2 py-1 text-xs font-semibold -[#2C3039]">Duyệt</button>
 <button onClick={() => void reviewTeacher(teacher.id, "rejected")} className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800">Từ chối</button>
 </div>
 </div>
 ))}

 {teacherQueue.length === 0 && <p className="text-sm text-slate-500">Không có hồ sơ chờ duyệt.</p>}
 </div>
 </div>

 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <h3 className="text-base font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Theo dõi hoạt động người dùng</h3>
 {!activity && <p className="mt-3 text-sm text-slate-500">Chọn "Lịch sử" ở bảng bên trái để xem chi tiết.</p>}

 {activity && (
 <div className="mt-3 space-y-3 text-sm text-slate-700">
 <p><span className="font-semibold">Người dùng:</span> {activity.user.name} ({activity.user.role})</p>
 <p><span className="font-semibold">Tổng thời gian học:</span> {(activity.study_time_seconds / 3600).toFixed(2)} giờ</p>
 <div>
 <p className="mb-1 font-semibold">Nhật ký đăng nhập:</p>
 <ul className="space-y-1 text-xs text-slate-600">
 {activity.login_logs.slice(0, 5).map((item, index) => (
 <li key={`${item.time}-${index}`}>{item.time} · {item.ip_address || "N/A"}</li>
 ))}
 </ul>
 </div>
 <div>
 <p className="mb-1 font-semibold">Lịch sử thao tác:</p>
 <ul className="space-y-1 text-xs text-slate-600">
 {activity.history.slice(0, 6).map((item, index) => (
 <li key={`${item.action}-${index}`}>{item.time} · {item.action}</li>
 ))}
 </ul>
 </div>
 </div>
 )}
 </div>
 </section>

 {message && <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
 </div>
 );
}

function StatCard({ label, value }: { label: string; value: number }) {
 return (
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4 shadow-[0_14px_32px_-25px_rgba(10,18,40,0.4)]">
 <p className="text-sm text-slate-500">{label}</p>
 <p className="mt-2 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{value.toLocaleString()}</p>
 </div>
 );
}
