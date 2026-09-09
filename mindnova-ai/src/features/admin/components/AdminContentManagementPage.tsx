"use client";

import { type FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/src/features/admin/lib/admin-api";
import { AdminCourseDetailModal, type FullAdminCourseDetail } from "./AdminCourseDetailModal";

type CourseRow = {
 id: number;
 title: string;
 status: string;
 admin_hidden_at?: string | null;
 teacher?: { name?: string | null } | null;
};

type CourseDetail = FullAdminCourseDetail;

type InstructorOption = {
 id: number;
 name: string;
 email?: string | null;
};

type CourseListResponse = {
 data: CourseRow[];
 meta: {
 current_page: number;
 last_page: number;
 per_page: number;
 total: number;
 };
 summary: {
 total: number;
 pending_review: number;
 };
 filters: {
 instructors: InstructorOption[];
 };
};

type ResourceRow = {
 id: number;
 title: string;
 type: string;
 url: string;
 status: string;
};

type QuestionRow = {
 id: number;
 content: string;
 question_category?: string | null;
 course_title?: string | null;
};

export function AdminContentManagementPage() {
 const [courses, setCourses] = useState<CourseRow[]>([]);
 const [resources, setResources] = useState<ResourceRow[]>([]);
 const [questions, setQuestions] = useState<QuestionRow[]>([]);
 const [message, setMessage] = useState<string | null>(null);
 const [isLoadingCourses, setIsLoadingCourses] = useState(true);
 const [pendingAction, setPendingAction] = useState<string | null>(null);
 const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
 const [detailCourseId, setDetailCourseId] = useState<number | null>(null);
 const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
 const [instructors, setInstructors] = useState<InstructorOption[]>([]);
 const [searchInput, setSearchInput] = useState("");
 const [appliedSearch, setAppliedSearch] = useState("");
 const [teacherId, setTeacherId] = useState("");
 const [page, setPage] = useState(1);
 const [courseMeta, setCourseMeta] = useState({ current_page: 1, last_page: 1, per_page: 20, total: 0 });
 const [courseSummary, setCourseSummary] = useState({ total: 0, pending_review: 0 });
 const [resourceForm, setResourceForm] = useState({ title: "", type: "ebook", url: "", description: "" });
 const courseRequestIdRef = useRef(0);

 const loadCourses = useCallback(async () => {
 const requestId = ++courseRequestIdRef.current;
 setMessage(null);
 setIsLoadingCourses(true);

 const query = new URLSearchParams({ visibility: "all" });
 if (activeTab === "pending") query.set("status", "pending_review");
 if (appliedSearch) query.set("search", appliedSearch);
 if (teacherId) query.set("teacher_id", teacherId);
 query.set("page", String(page));
 query.set("per_page", "20");

 try {
 const coursesRes = await adminApi<CourseListResponse>(`/admin/content/courses?${query.toString()}`);

 if (requestId !== courseRequestIdRef.current) return;
 if (coursesRes.meta.current_page > coursesRes.meta.last_page) {
 setPage(Math.max(1, coursesRes.meta.last_page));
 return;
 }

 setCourses(coursesRes.data);
 setCourseMeta(coursesRes.meta);
 setCourseSummary(coursesRes.summary);
 setInstructors(coursesRes.filters.instructors);
 } catch (error) {
 if (requestId !== courseRequestIdRef.current) return;
 setMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu nội dung.");
 } finally {
 if (requestId !== courseRequestIdRef.current) return;
 setIsLoadingCourses(false);
 }
 }, [activeTab, appliedSearch, page, teacherId]);
 const latestLoadCoursesRef = useRef(loadCourses);
 latestLoadCoursesRef.current = loadCourses;

 const loadAncillaryData = useCallback(async () => {
 try {
 const [resourcesRes, questionsRes] = await Promise.all([
 adminApi<{ data: ResourceRow[] }>("/admin/content/resources"),
 adminApi<{ data: QuestionRow[] }>("/admin/content/question-bank"),
 ]);
 setResources(resourcesRes.data);
 setQuestions(questionsRes.data);
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Không thể tải kho tài liệu hoặc ngân hàng câu hỏi.");
 }
 }, []);

 useEffect(() => {
 void loadCourses();
 }, [loadCourses]);

 useEffect(() => {
 void loadAncillaryData();
 }, [loadAncillaryData]);

 useEffect(() => {
 const handleRefresh = () => {
 void loadCourses();
 void loadAncillaryData();
 };

 window.addEventListener("admin:refresh-data", handleRefresh);
 return () => window.removeEventListener("admin:refresh-data", handleRefresh);
 }, [loadAncillaryData, loadCourses]);

 const applySearch = (event: FormEvent<HTMLFormElement>) => {
 event.preventDefault();
 setPage(1);
 setAppliedSearch(searchInput.trim());
 };

 const fetchCourseDetail = async (courseId: number) => {
 const payload = await adminApi<{ data: CourseDetail }>(`/admin/content/courses/${courseId}`);
 setCourseDetail(payload.data);
 setDetailCourseId(courseId);
 };

 const openCourseDetail = async (courseId: number) => {
 setPendingAction(`detail-${courseId}`);
 setMessage(null);

 try {
 await fetchCourseDetail(courseId);
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Không thể tải chi tiết khóa học.");
 } finally {
 setPendingAction(null);
 }
 };

 const moderateCourse = async (courseId: number, status: "published" | "archived") => {
 setPendingAction(`${status}-${courseId}`);

 try {
 await adminApi(`/admin/content/courses/${courseId}/moderate`, {
 method: "PATCH",
 body: JSON.stringify({ status }),
 });
 setMessage("Đã cập nhật kiểm duyệt khóa học.");
 await latestLoadCoursesRef.current();

 if (detailCourseId === courseId) {
 await fetchCourseDetail(courseId);
 }
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Kiểm duyệt khóa học thất bại.");
 } finally {
 setPendingAction(null);
 }
 };

 const deleteCourse = async (courseId: number, courseStatus: string) => {
 const confirmMessage = courseStatus === "archived"
 ? "Xóa khóa học này khỏi danh sách quản trị?"
 : "Xóa vĩnh viễn khóa học này?";

 if (!window.confirm(confirmMessage)) return;

 setPendingAction(`delete-${courseId}`);

 try {
 const payload = await adminApi<{ message?: string }>(`/admin/content/courses/${courseId}`, { method: "DELETE" });
 setMessage(payload.message ?? "Đã cập nhật khóa học.");
 if (detailCourseId === courseId) {
 setCourseDetail(null);
 setDetailCourseId(null);
 }
 await latestLoadCoursesRef.current();
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Gỡ bỏ khóa học thất bại.");
 } finally {
 setPendingAction(null);
 }
 };

 const restoreCourse = async (courseId: number) => {
 setPendingAction(`restore-${courseId}`);
 setMessage(null);

 try {
 const payload = await adminApi<{ message?: string }>(`/admin/content/courses/${courseId}/restore-admin`, {
 method: "PATCH",
 });

 setMessage(payload.message ?? "Đã khôi phục khóa học.");

 if (detailCourseId === courseId) {
 await fetchCourseDetail(courseId);
 }

 await latestLoadCoursesRef.current();
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Khôi phục khóa học thất bại.");
 } finally {
 setPendingAction(null);
 }
 };

 const addResource = async () => {
 try {
 await adminApi("/admin/content/resources", {
 method: "POST",
 body: JSON.stringify(resourceForm),
 });
 setResourceForm({ title: "", type: "ebook", url: "", description: "" });
 setMessage("Đã thêm tài liệu mẫu.");
 await loadAncillaryData();
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Thêm tài liệu thất bại.");
 }
 };

 const classifyQuestion = async (questionId: number, questionCategory: string) => {
 try {
 await adminApi(`/admin/content/question-bank/${questionId}`, {
 method: "PATCH",
 body: JSON.stringify({ question_category: questionCategory }),
 });
 await loadAncillaryData();
 } catch (error) {
 setMessage(error instanceof Error ? error.message : "Phân loại câu hỏi thất bại.");
 }
 };

 return (
 <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
 <section className="rounded-2xl border -[#FAF7F2]/20 bg-[linear-gradient(120deg,#0f172a_0%,#155e75_50%,#0f766e_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(7,18,45,0.8)]">
 <p className="text-[10px] uppercase tracking-[0.34em] -[#FAF7F2]/70">Content Management</p>
 <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Quản lý khóa học</h1>
 <p className="mt-1 text-xs text-slate-100/90">Duyệt/gỡ bài giảng, quản lý kho tài liệu mẫu, và phân loại ngân hàng câu hỏi cho AI tạo đề.</p>
 </section>

 <section className="grid gap-4 md:grid-cols-3">
 <SmallCard label="Tổng khóa học" value={courseSummary.total} />
 <SmallCard label="Chờ duyệt" value={courseSummary.pending_review} />
 <SmallCard label="Kho tài liệu mẫu" value={resources.length} />
 </section>

 <section className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
 <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Quản lý khóa học</h2>
 <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
 <button
 type="button"
 onClick={() => {
 setPage(1);
 setActiveTab("pending");
 }}
 className={`rounded-lg px-3 py-2 font-medium transition ${activeTab === "pending" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
 >
 Khóa học chờ duyệt
 </button>
 <button
 type="button"
 onClick={() => {
 setPage(1);
 setActiveTab("all");
 }}
 className={`rounded-lg px-3 py-2 font-medium transition ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
 >
 Tất cả khóa học
 </button>
 </div>
 </div>
 <form onSubmit={applySearch} className="mb-4 grid gap-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_auto] md:items-end">
 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Tìm khóa học</span>
 <input
 type="search"
 value={searchInput}
 onChange={(event) => setSearchInput(event.target.value)}
 placeholder="Nhập tên khóa học"
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 />
 </label>
 <label className="space-y-1 text-sm text-slate-700">
 <span className="font-medium">Lọc theo giảng viên</span>
 <select
 value={teacherId}
 onChange={(event) => {
 setPage(1);
 setTeacherId(event.target.value);
 }}
 className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:-[#C0392B]"
 >
 <option value="">Tất cả giảng viên</option>
 {instructors.map((instructor) => (
 <option key={instructor.id} value={instructor.id}>{instructor.name}</option>
 ))}
 </select>
 </label>
 <button type="submit" className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
 Tìm kiếm
 </button>
 </form>
 <div className="overflow-x-auto">
 <table className="min-w-full text-sm">
 <thead className="bg-slate-50 text-slate-600">
 <tr>
 <th className="px-3 py-2 text-left">Khóa học</th>
 <th className="px-3 py-2 text-left">Giảng viên</th>
 <th className="px-3 py-2 text-left">Trạng thái</th>
 <th className="px-3 py-2 text-left">Hành động</th>
 </tr>
 </thead>
 <tbody>
 {isLoadingCourses ? (
 <tr>
 <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">Đang tải khóa học...</td>
 </tr>
 ) : courses.length === 0 ? (
 <tr>
 <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
 {appliedSearch || teacherId
 ? "Không tìm thấy khóa học phù hợp."
 : activeTab === "pending"
 ? "Không có khóa học nào đang chờ duyệt."
 : "Chưa có khóa học nào trong hệ thống."}
 </td>
 </tr>
 ) : (
 courses.map((course) => (
 <tr key={course.id} className="border-t border-slate-200">
 <td className="px-3 py-2">{course.title}</td>
 <td className="px-3 py-2">{course.teacher?.name || "-"}</td>
 <td className="px-3 py-2">
 <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusClassName(course.status)}`}>
 {statusLabel(course.status)}
 </span>
 </td>
 <td className="px-3 py-2">
 <div className="flex flex-wrap gap-2">
 <button
 type="button"
 onClick={() => void openCourseDetail(course.id)}
 disabled={pendingAction === `detail-${course.id}`}
 className="rounded-lg bg-sky-100 px-2 py-1 text-xs font-semibold text-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {pendingAction === `detail-${course.id}` ? "Đang tải..." : "Xem chi tiết"}
 </button>

 {course.admin_hidden_at ? (
 <button
 type="button"
 onClick={() => void restoreCourse(course.id)}
 disabled={pendingAction !== null}
 className="rounded-lg -[#FAF7F2] px-2 py-1 text-xs font-semibold -[#2C3039] disabled:cursor-not-allowed disabled:opacity-60"
 >
 {pendingAction === `restore-${course.id}` ? "Đang khôi phục..." : "Khôi phục"}
 </button>
 ) : (
 <>
 {activeTab === "pending" && (
 <button
 type="button"
 onClick={() => void moderateCourse(course.id, "published")}
 disabled={pendingAction !== null}
 className="rounded-lg -[#FAF7F2] px-2 py-1 text-xs font-semibold -[#2C3039] disabled:cursor-not-allowed disabled:opacity-60"
 >
 {pendingAction === `published-${course.id}` ? "Đang duyệt..." : "Duyệt"}
 </button>
 )}
 <button
 type="button"
 onClick={() => void moderateCourse(course.id, "archived")}
 disabled={pendingAction !== null}
 className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {pendingAction === `archived-${course.id}` ? "Đang gỡ..." : "Gỡ bỏ"}
 </button>
 {course.status === "archived" && (
 <button
 type="button"
 onClick={() => void deleteCourse(course.id, course.status)}
 disabled={pendingAction !== null}
 className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
 >
 {pendingAction === `delete-${course.id}` ? "Đang xóa..." : "Xóa"}
 </button>
 )}
 </>
 )}
 </div>
 </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
 <span>{courseMeta.total} kết quả</span>
 <div className="flex items-center gap-2">
 <button
 type="button"
 aria-label="Trang trước"
 disabled={isLoadingCourses || courseMeta.current_page <= 1}
 onClick={() => setPage((current) => Math.max(1, current - 1))}
 className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
 >
 Trước
 </button>
 <span>Trang {courseMeta.current_page} / {courseMeta.last_page}</span>
 <button
 type="button"
 aria-label="Trang sau"
 disabled={isLoadingCourses || courseMeta.current_page >= courseMeta.last_page}
 onClick={() => setPage((current) => current + 1)}
 className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 disabled:cursor-not-allowed disabled:opacity-50"
 >
 Sau
 </button>
 </div>
 </div>
 </section>

 {courseDetail && (
 <AdminCourseDetailModal
 course={courseDetail}
 onClose={() => {
 setCourseDetail(null);
 setDetailCourseId(null);
 }}
 onModerate={moderateCourse}
 pendingAction={pendingAction}
 />
 )}

 <section className="grid gap-4 xl:grid-cols-2">
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <h3 className="text-base font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Kho tài liệu mẫu</h3>
 <div className="mt-3 grid gap-2">
 <input placeholder="Tiêu đề" value={resourceForm.title} onChange={(e) => setResourceForm((s) => ({ ...s, title: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
 <select value={resourceForm.type} onChange={(e) => setResourceForm((s) => ({ ...s, type: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
 <option value="ebook">ebook</option>
 <option value="document">document</option>
 <option value="video">video</option>
 <option value="link">link</option>
 </select>
 <input placeholder="URL" value={resourceForm.url} onChange={(e) => setResourceForm((s) => ({ ...s, url: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
 <input placeholder="Mô tả" value={resourceForm.description} onChange={(e) => setResourceForm((s) => ({ ...s, description: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
 <button onClick={() => void addResource()} className="rounded-xl -[#C0392B] px-4 py-2 text-sm font-semibold text-white">Thêm tài liệu</button>
 </div>

 <ul className="mt-4 space-y-2 text-sm text-slate-700">
 {resources.slice(0, 8).map((resource) => (
 <li key={resource.id} className="rounded-lg border border-slate-200 px-3 py-2">
 <p className="font-medium">{resource.title}</p>
 <p className="text-xs text-slate-500">{resource.type} · {resource.status}</p>
 </li>
 ))}
 </ul>
 </div>

 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <h3 className="text-base font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Ngân hàng câu hỏi</h3>
 <div className="mt-3 space-y-2">
 {questions.slice(0, 12).map((question) => (
 <div key={question.id} className="rounded-lg border border-slate-200 p-3">
 <p className="text-sm text-slate-800">{question.content}</p>
 <p className="mt-1 text-xs text-slate-500">{question.course_title || "Chưa gắn khóa học"}</p>
 <div className="mt-2 flex gap-2">
 {["de", "trung_binh", "kho"].map((category) => (
 <button key={category} onClick={() => void classifyQuestion(question.id, category)} className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-700">{category}</button>
 ))}
 <span className="ml-auto text-xs -[#C0392B]">{question.question_category || "chưa phân loại"}</span>
 </div>
 </div>
 ))}
 </div>
 </div>
 </section>

 {message && <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
 </div>
 );
}

function SmallCard({ label, value }: { label: string; value: number }) {
 return (
 <div className="rounded-2xl border -[#FAF7F2]/80 bg-white/95 p-4">
 <p className="text-sm text-slate-500">{label}</p>
 <p className="mt-2 text-2xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{value}</p>
 </div>
 );
}

function statusLabel(status: string): string {
 if (status === "published") return "Đã công khai";
 if (status === "archived") return "Đã gỡ bỏ";
 if (status === "pending_review") return "Chờ duyệt";
 if (status === "draft") return "Bản nháp";
 return status;
}

function statusClassName(status: string): string {
 if (status === "published") return "-[#FAF7F2] -[#2C3039]";
 if (status === "archived") return "bg-amber-100 text-amber-800";
 if (status === "pending_review") return "bg-sky-100 text-sky-800";
 if (status === "draft") return "bg-slate-100 text-slate-700";
 return "bg-slate-100 text-slate-700";
}

function formatDuration(seconds?: number | null): string {
 if (!seconds || seconds <= 0) {
 return "0 phút";
 }

 const totalMinutes = Math.max(1, Math.round(seconds / 60));
 return `${totalMinutes} phút`;
}

function formatCurrency(value: number): string {
  const rounded = Math.round(value || 0);
  return `${new Intl.NumberFormat("vi-VN").format(rounded)} VNĐ`;
}
