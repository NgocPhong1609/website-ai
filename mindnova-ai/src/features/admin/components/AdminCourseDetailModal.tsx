"use client";

import { useState } from "react";

export type CourseLevelQuizDetail = {
  attachment_id: number | string;
  quiz_id: number | string;
  title: string;
  description?: string | null;
  position: string;
  is_active: boolean;
  time_limit_minutes: number;
  passing_score: number;
  total_questions: number;
  questions: Array<{
    id: number | string;
    type: "multiple_choice" | "essay" | string;
    question?: string;
    content?: string;
    explanation?: string;
    sample_answer?: string;
    rubric?: string;
    points?: number;
    difficulty?: string;
    options?: string[];
    correct_answer_index?: number;
    answers?: Array<{
      id?: number | string;
      content: string;
      is_correct: boolean;
    }>;
  }>;
};

export type FullAdminCourseDetail = {
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
  course_level_quizzes?: {
    capability_assessment?: CourseLevelQuizDetail | null;
    end_of_course?: CourseLevelQuizDetail | null;
  };
  structured_modules?: Array<{
    id: string | number;
    title: string;
    order: number;
    is_final_module?: boolean;
    lessons?: Array<{
      id: string | number;
      item_type?: "lesson" | "quiz";
      title: string;
      type?: string;
      duration?: string;
      duration_seconds?: number;
      status?: string;
      content?: string | null;
      video_url?: string | null;
      quizData?: {
        id: number | string;
        title: string;
        description?: string;
        time_limit_minutes?: number;
        passing_score?: number;
        total_questions?: number;
        questions?: Array<{
          id: number | string;
          type: "multiple_choice" | "essay" | string;
          question?: string;
          content?: string;
          explanation?: string;
          sample_answer?: string;
          rubric?: string;
          points?: number;
          difficulty?: string;
          options?: string[];
          correct_answer_index?: number;
          answers?: Array<{
            id?: number | string;
            content: string;
            is_correct: boolean;
          }>;
        }>;
      };
    }>;
    items?: any[];
  }>;
  modules?: Array<{
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

interface AdminCourseDetailModalProps {
  course: FullAdminCourseDetail;
  onClose: () => void;
  onModerate: (courseId: number, status: "published" | "archived") => Promise<void>;
  pendingAction: string | null;
}

export function AdminCourseDetailModal({
  course,
  onClose,
  onModerate,
  pendingAction,
}: AdminCourseDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "lessons" | "general_quizzes" | "final_quiz">("overview");
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);

  const structuredModules = (course.structured_modules || []).filter((m) => !m.is_final_module);
  const capabilityQuiz = course.course_level_quizzes?.capability_assessment;
  const endOfCourseQuiz = course.course_level_quizzes?.end_of_course;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm animate-fadeIn [font-family:var(--font-admin-body)]">
      <div className="flex flex-col w-full max-w-5xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-900 text-white border-b border-slate-800">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-sky-500/20 text-sky-300 border border-sky-500/30">
              🔍 KIỂM DUYỆT KHÓA HỌC (READ-ONLY)
            </span>
            <h2 className="text-lg font-bold truncate max-w-lg">{course.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center text-sm transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 border-b border-slate-200 overflow-x-auto">
          <button
            onClick={() => setActiveTab("overview")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "overview"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            📌 Tổng quan & Giảng viên
          </button>

          <button
            onClick={() => setActiveTab("lessons")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
              activeTab === "lessons"
                ? "bg-slate-900 text-white shadow-sm"
                : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
            }`}
          >
            📚 Nội dung bài học ({structuredModules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)})
          </button>

          <button
            onClick={() => setActiveTab("general_quizzes")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "general_quizzes"
                ? "bg-amber-600 text-white shadow-sm"
                : "bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            <span>🏆</span>
            <span>A. Kiểm tra tổng quát</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${capabilityQuiz ? "bg-emerald-700 text-white" : "bg-amber-200 text-amber-900"}`}>
              {capabilityQuiz ? "Có bài thi" : "Trống"}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("final_quiz")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === "final_quiz"
                ? "bg-indigo-600 text-white shadow-sm"
                : "bg-indigo-50 text-indigo-900 hover:bg-indigo-100 border border-indigo-200"
            }`}
          >
            <span>🏁</span>
            <span>B. Kiểm tra cuối khóa học</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-extrabold ${endOfCourseQuiz ? "bg-emerald-700 text-white" : "bg-indigo-200 text-indigo-900"}`}>
              {endOfCourseQuiz ? "Có bài thi" : "Trống"}
            </span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3">
                  <h3 className="text-base font-bold text-slate-900">Mô tả khóa học</h3>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {course.description || "Chưa có mô tả chi tiết cho khóa học này."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <span className="text-xs text-slate-500 font-medium">Danh mục & Cấp độ</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {course.category || "Chưa phân loại"} • <span className="uppercase text-sky-700">{course.level || "Tất cả"}</span>
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl border border-slate-200 bg-white">
                    <span className="text-xs text-slate-500 font-medium">Giá bán & Doanh thu</span>
                    <p className="text-sm font-bold text-slate-900 mt-1">
                      {formatCurrency(course.price)} • Doanh thu: {formatCurrency(course.revenue)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Sidebar Instructor Info */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl border border-slate-200 bg-white shadow-xs space-y-4">
                  <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">Thông tin Giảng viên</h3>
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-base">
                      {course.teacher?.name?.[0]?.toUpperCase() || "G"}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{course.teacher?.name || "Chưa gán"}</p>
                      <p className="text-xs text-slate-500">{course.teacher?.email || "Chưa có email"}</p>
                    </div>
                  </div>
                </div>

                <div className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-3">
                  <h3 className="text-sm font-bold text-slate-900">Trạng thái khóa học</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Trạng thái hiện tại:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClassName(course.status)}`}>
                      {statusLabel(course.status)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Học viên đã ghi danh:</span>
                    <span className="text-xs font-bold text-slate-800">{course.enrollments} học viên</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: LESSONS */}
          {activeTab === "lessons" && (
            <div className="space-y-4">
              {structuredModules.length === 0 ? (
                <div className="p-8 text-center text-sm text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                  Khóa học này chưa có chương bài học nào.
                </div>
              ) : (
                structuredModules.map((mod, mIdx) => {
                  const lessons = mod.lessons || mod.items || [];
                  return (
                    <div key={mod.id || mIdx} className="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-2xs">
                      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                        <h3 className="text-sm font-bold text-slate-900">
                          Chương {mIdx + 1}: {mod.title}
                        </h3>
                        <span className="text-xs font-semibold text-slate-500">{lessons.length} bài học</span>
                      </div>

                      <div className="p-3 divide-y divide-slate-100">
                        {lessons.map((les, lIdx) => (
                          <div key={les.id || lIdx} className="py-2.5 px-3 hover:bg-slate-50/80 rounded-xl transition-colors">
                            <div className="flex items-center justify-between gap-3">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-bold text-slate-400 w-6">#{lIdx + 1}</span>
                                <div>
                                  <span className="text-sm font-semibold text-slate-800">{les.title}</span>
                                  <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                                    <span className="capitalize font-medium text-sky-700">{les.type || les.item_type || "video"}</span>
                                    <span>•</span>
                                    <span>{les.duration || formatDuration(les.duration_seconds)}</span>
                                  </div>
                                </div>
                              </div>

                              <button
                                onClick={() => setSelectedLesson(selectedLesson?.id === les.id ? null : les)}
                                className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer transition-colors"
                              >
                                {selectedLesson?.id === les.id ? "Ẩn chi tiết" : "Xem chi tiết"}
                              </button>
                            </div>

                            {/* Expanded Lesson Detail Preview */}
                            {selectedLesson?.id === les.id && (
                              <div className="mt-3 p-4 bg-slate-900 text-slate-100 rounded-xl text-xs space-y-3 animate-fadeIn">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                  <span className="font-bold text-sky-400">📄 Chi tiết bài học #{les.title}</span>
                                  <span className="text-[10px] text-slate-400 uppercase">{les.type || "Nội dung"}</span>
                                </div>

                                {les.video_url && (
                                  <div>
                                    <span className="font-semibold text-slate-400 block mb-1">Link Video / Bài giảng:</span>
                                    <a
                                      href={les.video_url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-sky-300 underline break-all hover:text-sky-200"
                                    >
                                      {les.video_url}
                                    </a>
                                  </div>
                                )}

                                {les.content && (
                                  <div>
                                    <span className="font-semibold text-slate-400 block mb-1">Nội dung bài đọc (Article):</span>
                                    <div className="p-3 bg-slate-800 rounded-lg whitespace-pre-line text-slate-200 text-xs leading-relaxed max-h-48 overflow-y-auto">
                                      {les.content}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}

          {/* TAB 3: A. KIỂM TRA TỔNG QUÁT (Course-Level General Assessment Exam) */}
          {activeTab === "general_quizzes" && (
            <div className="space-y-6">
              {!capabilityQuiz ? (
                /* Empty State matching Instructor UI */
                <div className="p-12 text-center bg-amber-50/40 rounded-3xl border-2 border-dashed border-amber-200/80 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-700 flex items-center justify-center text-2xl font-bold">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">A. KIỂM TRA TỔNG QUÁT</h3>
                    <p className="text-sm font-semibold text-amber-800 mt-1">
                      Chưa có bài kiểm tra tổng quát nào được chọn.
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Giảng viên chưa chọn bài kiểm tra Đánh giá năng lực tổng quát chính cho khóa học này.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-amber-300 bg-white overflow-hidden shadow-sm">
                  {/* Header Banner */}
                  <div className="p-6 bg-gradient-to-r from-amber-500/15 via-amber-100/60 to-orange-50 border-b border-amber-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-amber-600 text-white shadow-2xs">
                          🏆 A. KIỂM TRA TỔNG QUÁT CẤP KHÓA HỌC
                        </span>
                        {capabilityQuiz.is_active && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ ĐANG CHỌN LÀM BÀI THI CHÍNH
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">{capabilityQuiz.title}</h3>
                      {capabilityQuiz.description && (
                        <p className="text-xs text-slate-600 italic">{capabilityQuiz.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-800 bg-white px-4 py-2.5 rounded-2xl border border-amber-200 shadow-2xs">
                      <div>⏱ Thời gian: <span className="text-amber-700 font-extrabold">{capabilityQuiz.time_limit_minutes} phút</span></div>
                      <div>•</div>
                      <div>🎯 Điểm đạt: <span className="text-amber-700 font-extrabold">{capabilityQuiz.passing_score}%</span></div>
                      <div>•</div>
                      <div>❓ Số câu: <span className="text-amber-700 font-extrabold">{capabilityQuiz.total_questions} câu</span></div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                      📋 Danh sách câu hỏi trong bài kiểm tra tổng quát ({capabilityQuiz.questions?.length || 0} câu)
                    </h4>

                    {(!capabilityQuiz.questions || capabilityQuiz.questions.length === 0) ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                        Bài kiểm tra này chưa được thêm nội dung câu hỏi.
                      </p>
                    ) : (
                      capabilityQuiz.questions.map((q, idx) => (
                        <RenderQuestionDetail key={q.id || idx} question={q} index={idx} />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: B. KIỂM TRA CUỐI KHÓA HỌC (Course-Level Final Exam Quiz) */}
          {activeTab === "final_quiz" && (
            <div className="space-y-6">
              {!endOfCourseQuiz ? (
                /* Empty State matching Instructor UI */
                <div className="p-12 text-center bg-indigo-50/40 rounded-3xl border-2 border-dashed border-indigo-200/80 space-y-4">
                  <div className="w-16 h-16 mx-auto rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-2xl font-bold">
                    🏁
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">B. KIỂM TRA CUỐI KHÓA HỌC</h3>
                    <p className="text-sm font-semibold text-indigo-800 mt-1">
                      Chưa có bài kiểm tra cuối khóa nào được chọn.
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Giảng viên chưa chọn bài kiểm tra Cuối khóa học chính cho khóa học này.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-3xl border-2 border-indigo-300 bg-white overflow-hidden shadow-sm">
                  {/* Header Banner */}
                  <div className="p-6 bg-gradient-to-r from-indigo-500/15 via-indigo-100/60 to-purple-50 border-b border-indigo-200 flex flex-wrap items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-indigo-700 text-white shadow-2xs">
                          🏁 B. KIỂM TRA CUỐI KHÓA HỌC
                        </span>
                        {endOfCourseQuiz.is_active && (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                            ✓ ĐANG CHỌN LÀM BÀI THI CHÍNH
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900">{endOfCourseQuiz.title}</h3>
                      {endOfCourseQuiz.description && (
                        <p className="text-xs text-slate-600 italic">{endOfCourseQuiz.description}</p>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs font-bold text-slate-800 bg-white px-4 py-2.5 rounded-2xl border border-indigo-200 shadow-2xs">
                      <div>⏱ Thời gian: <span className="text-indigo-700 font-extrabold">{endOfCourseQuiz.time_limit_minutes} phút</span></div>
                      <div>•</div>
                      <div>🎯 Điểm đạt: <span className="text-indigo-700 font-extrabold">{endOfCourseQuiz.passing_score}%</span></div>
                      <div>•</div>
                      <div>❓ Số câu: <span className="text-indigo-700 font-extrabold">{endOfCourseQuiz.total_questions} câu</span></div>
                    </div>
                  </div>

                  {/* Questions List */}
                  <div className="p-6 space-y-4">
                    <h4 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                      📋 Danh sách câu hỏi trong bài kiểm tra cuối khóa ({endOfCourseQuiz.questions?.length || 0} câu)
                    </h4>

                    {(!endOfCourseQuiz.questions || endOfCourseQuiz.questions.length === 0) ? (
                      <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl">
                        Bài kiểm tra này chưa được thêm nội dung câu hỏi.
                      </p>
                    ) : (
                      endOfCourseQuiz.questions.map((q, idx) => (
                        <RenderQuestionDetail key={q.id || idx} question={q} index={idx} />
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Modal Footer Admin Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 bg-slate-50 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Trạng thái khóa học:</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusClassName(course.status)}`}>
              {statusLabel(course.status)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {course.status === "pending_review" && (
              <button
                type="button"
                onClick={() => void onModerate(course.id, "published")}
                disabled={pendingAction !== null}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-colors cursor-pointer disabled:opacity-50"
              >
                {pendingAction === `published-${course.id}` ? "Đang duyệt..." : "✓ Duyệt công khai khóa học"}
              </button>
            )}

            {course.status !== "archived" && (
              <button
                type="button"
                onClick={() => void onModerate(course.id, "archived")}
                disabled={pendingAction !== null}
                className="px-4 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {pendingAction === `archived-${course.id}` ? "Đang gỡ..." : "Gỡ bỏ khóa học"}
              </button>
            )}

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Đóng popup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent to render MCQ options or Essay Sample Answers/Rubrics
function RenderQuestionDetail({ question, index }: { question: any; index: number }) {
  const isEssay = question.type === "essay" || question.type === "tu_luan";
  const content = question.content || question.question || `Câu hỏi #${index + 1}`;

  return (
    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
            Câu {index + 1}
          </span>
          <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded uppercase ${
            isEssay ? "bg-amber-100 text-amber-900" : "bg-sky-100 text-sky-900"
          }`}>
            {isEssay ? "✍️ Tự luận" : "🔘 Trắc nghiệm"}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">({question.points || (isEssay ? 2.5 : 0.5)} điểm)</span>
        </div>
        {question.difficulty && (
          <span className="text-[10px] font-semibold text-slate-500 capitalize">Độ khó: {question.difficulty}</span>
        )}
      </div>

      <p className="text-sm font-bold text-slate-900 leading-relaxed">{content}</p>

      {/* MCQ Options Rendering */}
      {!isEssay && (
        <div className="space-y-1.5 pl-2">
          {Array.isArray(question.answers) && question.answers.length > 0 ? (
            question.answers.map((ans: any, aIdx: number) => (
              <div
                key={ans.id || aIdx}
                className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs font-medium ${
                  ans.is_correct
                    ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                    : "bg-slate-50 border-slate-200 text-slate-700"
                }`}
              >
                <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border bg-white">
                  {String.fromCharCode(65 + aIdx)}
                </span>
                <span className="flex-1">{ans.content}</span>
                {ans.is_correct && (
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                    Đáp án đúng
                  </span>
                )}
              </div>
            ))
          ) : Array.isArray(question.options) && question.options.length > 0 ? (
            question.options.map((opt: string, aIdx: number) => {
              const isCorrect = aIdx === question.correct_answer_index;
              return (
                <div
                  key={aIdx}
                  className={`flex items-center gap-3 p-2.5 rounded-lg border text-xs font-medium ${
                    isCorrect
                      ? "bg-emerald-50 border-emerald-300 text-emerald-950 font-bold"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <span className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 border bg-white">
                    {String.fromCharCode(65 + aIdx)}
                  </span>
                  <span className="flex-1">{opt}</span>
                  {isCorrect && (
                    <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px] font-extrabold uppercase">
                      Đáp án đúng
                    </span>
                  )}
                </div>
              );
            })
          ) : null}
        </div>
      )}

      {/* Essay Sample Answer & Rubric Rendering */}
      {isEssay && (
        <div className="space-y-2 p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 text-xs">
          {question.sample_answer && (
            <div>
              <span className="font-extrabold text-amber-900 block mb-0.5">💡 Đáp án tham khảo mẫu:</span>
              <p className="text-amber-950 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-amber-200/50">
                {question.sample_answer}
              </p>
            </div>
          )}
          {question.rubric && (
            <div>
              <span className="font-extrabold text-amber-900 block mb-0.5">📋 Gợi ý Rubric chấm điểm:</span>
              <p className="text-amber-950 whitespace-pre-line leading-relaxed bg-white p-2.5 rounded-lg border border-amber-200/50">
                {question.rubric}
              </p>
            </div>
          )}
        </div>
      )}

      {question.explanation && (
        <p className="text-[11px] text-slate-500 italic bg-slate-50 p-2 rounded-lg">
          💡 Giải thích: {question.explanation}
        </p>
      )}
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
  if (status === "published") return "bg-emerald-100 text-emerald-800 border border-emerald-300";
  if (status === "archived") return "bg-amber-100 text-amber-800 border border-amber-300";
  if (status === "pending_review") return "bg-sky-100 text-sky-800 border border-sky-300";
  return "bg-slate-100 text-slate-700 border border-slate-200";
}

function formatDuration(seconds?: number | null): string {
  if (!seconds || seconds <= 0) return "0 phút";
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
