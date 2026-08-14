"use client";

import { useEffect, useMemo, useState } from "react";
import { adminApi } from "@/src/features/admin/lib/admin-api";

type CourseRow = {
  id: number;
  title: string;
  status: string;
  admin_hidden_at?: string | null;
  teacher?: { name?: string | null } | null;
};

type CourseDetail = {
  id: number;
  title: string;
  description: string;
  status: string;
  level: string;
  price: number;
  category?: string | null;
  enrollments: number;
  revenue: number;
  admin_hidden_at?: string | null;
  teacher?: { name?: string | null; email?: string | null } | null;
  modules: Array<{
    id: number;
    title: string;
    order: number;
    lessons: Array<{
      id: number;
      title: string;
      type?: string | null;
      status?: string | null;
      duration_seconds?: number | null;
      order: number;
    }>;
  }>;
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
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [courseDetail, setCourseDetail] = useState<CourseDetail | null>(null);
  const [detailCourseId, setDetailCourseId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [resourceForm, setResourceForm] = useState({ title: "", type: "ebook", url: "", description: "" });

  const loadData = async () => {
    setMessage(null);

    try {
      const [coursesRes, resourcesRes, questionsRes] = await Promise.all([
        adminApi<{ data: CourseRow[] }>("/admin/content/courses?visibility=all"),
        adminApi<{ data: ResourceRow[] }>("/admin/content/resources"),
        adminApi<{ data: QuestionRow[] }>("/admin/content/question-bank"),
      ]);

      setCourses(coursesRes.data);
      setResources(resourcesRes.data);
      setQuestions(questionsRes.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể tải dữ liệu nội dung.");
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      void loadData();
    };

    window.addEventListener("admin:refresh-data", handleRefresh);
    return () => window.removeEventListener("admin:refresh-data", handleRefresh);
  }, []);

  const pendingCourses = useMemo(() => courses.filter((course) => course.status === "pending_review").length, [courses]);

  const allCoursesCount = courses.length;

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
      await loadData();

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
      await loadData();
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

      await loadData();
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
      await loadData();
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
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Phân loại câu hỏi thất bại.");
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[28px] border border-cyan-200/20 bg-[linear-gradient(120deg,#0f172a_0%,#155e75_50%,#0f766e_100%)] p-6 text-white shadow-[0_30px_70px_-35px_rgba(7,18,45,0.8)]">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/70">Content Management</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Quản lý khóa học</h1>
        <p className="mt-2 text-sm text-slate-100/90">Duyệt/gỡ bài giảng, quản lý kho tài liệu mẫu, và phân loại ngân hàng câu hỏi cho AI tạo đề.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <SmallCard label="Tổng khóa học" value={allCoursesCount} />
        <SmallCard label="Chờ duyệt" value={pendingCourses} />
        <SmallCard label="Kho tài liệu mẫu" value={resources.length} />
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Kiểm duyệt khóa học</h2>
          <div className="inline-flex rounded-xl bg-slate-100 p-1 text-sm">
            <button
              type="button"
              onClick={() => setActiveTab("pending")}
              className={`rounded-lg px-3 py-2 font-medium transition ${activeTab === "pending" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              Khóa học chờ duyệt
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`rounded-lg px-3 py-2 font-medium transition ${activeTab === "all" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"}`}
            >
              Tất cả khóa học
            </button>
          </div>
        </div>
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
              {(() => {
                const displayedCourses = activeTab === "pending"
                  ? courses.filter((c) => c.status === "pending_review")
                  : courses;

                if (displayedCourses.length === 0) {
                  return (
                    <tr>
                      <td colSpan={4} className="px-3 py-6 text-center text-sm text-slate-500">
                        {activeTab === "pending" ? "Không có khóa học nào đang chờ duyệt." : "Chưa có khóa học nào trong hệ thống."}
                      </td>
                    </tr>
                  );
                }

                return displayedCourses.map((course) => (
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
                            className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                                 className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
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
                ));
              })()}
            </tbody>
          </table>
        </div>
      </section>

      {courseDetail && (
        <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_14px_32px_-25px_rgba(10,18,40,0.4)]">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Chi tiết khóa học</h2>
              <p className="text-sm text-slate-500">Xem nội dung bên trong khóa học trước khi duyệt hoặc gỡ bỏ.</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setCourseDetail(null);
                setDetailCourseId(null);
              }}
              className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-medium text-slate-700"
            >
              Đóng
            </button>
          </div>

          <div className="mt-4 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-900">{courseDetail.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{courseDetail.description || "Chưa có mô tả khóa học."}</p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClassName(courseDetail.status)}`}>
                    {statusLabel(courseDetail.status)}
                  </span>
                </div>
              </div>

              <div className="space-y-3">
                {courseDetail.modules.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 px-4 py-6 text-sm text-slate-500">
                    Khóa học này chưa có module hoặc bài học nào.
                  </div>
                ) : (
                  courseDetail.modules.map((module, moduleIndex) => (
                    <div key={module.id} className="rounded-2xl border border-slate-200 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="font-semibold text-slate-900">{`Phần ${moduleIndex + 1}: ${module.title}`}</h4>
                        <span className="text-xs text-slate-500">{module.lessons.length} bài học</span>
                      </div>
                      <div className="mt-3 space-y-2">
                        {module.lessons.length === 0 ? (
                          <p className="text-sm text-slate-500">Chưa có bài học trong module này.</p>
                        ) : (
                          module.lessons.map((lesson, lessonIndex) => (
                            <div key={lesson.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <span className="font-medium">{`Bài ${lessonIndex + 1}: ${lesson.title}`}</span>
                                <span className="text-xs text-slate-500">
                                  {lesson.type || "Nội dung"} · {lesson.status || "draft"} · {formatDuration(lesson.duration_seconds)}
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <aside className="space-y-4">
              <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="text-base font-semibold text-slate-900">Thông tin tổng quan</h3>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  <li>Giảng viên: {courseDetail.teacher?.name || "Chưa gán"}</li>
                  <li>Email: {courseDetail.teacher?.email || "Chưa có"}</li>
                  <li>Danh mục: {courseDetail.category || "Chưa phân loại"}</li>
                  <li>Cấp độ: {courseDetail.level || "Chưa xác định"}</li>
                  <li>Giá bán: {formatCurrency(courseDetail.price)}</li>
                  <li>Học viên đã ghi danh: {courseDetail.enrollments}</li>
                  <li>Doanh thu: {formatCurrency(courseDetail.revenue)}</li>
                </ul>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4">
                <h3 className="text-base font-semibold text-slate-900">Hành động nhanh</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {courseDetail.admin_hidden_at ? (
                    <button
                      type="button"
                      onClick={() => void restoreCourse(courseDetail.id)}
                      disabled={pendingAction !== null}
                      className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {pendingAction === `restore-${courseDetail.id}` ? "Đang khôi phục..." : "Khôi phục vào admin"}
                    </button>
                  ) : (
                    <>
                      <button
                        type="button"
                        onClick={() => void moderateCourse(courseDetail.id, "published")}
                        disabled={pendingAction !== null}
                        className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-semibold text-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingAction === `published-${courseDetail.id}` ? "Đang duyệt..." : "Duyệt khóa học"}
                      </button>
                      <button
                        type="button"
                        onClick={() => void moderateCourse(courseDetail.id, "archived")}
                        disabled={pendingAction !== null}
                        className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-semibold text-amber-800 disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {pendingAction === `archived-${courseDetail.id}` ? "Đang gỡ..." : "Gỡ bỏ"}
                      </button>
                      {courseDetail.status === "archived" && (
                        <button
                          type="button"
                          onClick={() => void deleteCourse(courseDetail.id, courseDetail.status)}
                          disabled={pendingAction !== null}
                          className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-semibold text-rose-800 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {pendingAction === `delete-${courseDetail.id}` ? "Đang xóa..." : "Xóa khóa học"}
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </section>
      )}

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
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
            <button onClick={() => void addResource()} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Thêm tài liệu</button>
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

        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
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
                  <span className="ml-auto text-xs text-cyan-700">{question.question_category || "chưa phân loại"}</span>
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
    <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
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
  if (status === "published") return "bg-emerald-100 text-emerald-800";
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
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}
