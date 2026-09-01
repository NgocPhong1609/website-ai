"use client";

import React, { useEffect, useState } from "react";
import { QuizSummary } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { useRouter, useSearchParams } from "next/navigation";

interface Step5SaveAndAttachModalProps {
  quiz: QuizSummary;
  onClose: () => void;
  onSuccessComplete?: (savedQuiz?: any) => void;
}

export function Step5SaveAndAttachModal({ quiz, onClose, onSuccessComplete }: Step5SaveAndAttachModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramModuleId = searchParams ? (searchParams.get("module_id") || searchParams.get("moduleId")) : null;
  const paramAfterLessonId = searchParams ? (searchParams.get("after_lesson_id") || searchParams.get("afterLessonId")) : null;
  const paramPosition = searchParams ? searchParams.get("position") : null;

  const [courses, setCourses] = useState<any[]>([]);
  const [targetCourse, setTargetCourse] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [position, setPosition] = useState<"capability_assessment" | "end_of_course" | "in_module" | "after_lesson">(
    (paramPosition as any) || "capability_assessment"
  );
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(paramModuleId ? Number(paramModuleId) : null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(paramAfterLessonId ? Number(paramAfterLessonId) : null);
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachedSuccess, setAttachedSuccess] = useState(false);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);
  const [isLoadingCourseDetails, setIsLoadingCourseDetails] = useState(false);
  const [errorInfo, setErrorInfo] = useState<{ message: string; errorCode: string } | null>(null);

  // Initial course ID attached or pre-selected
  const initialCourseId =
    quiz.course_id ||
    (quiz.attachments && quiz.attachments.length > 0 ? quiz.attachments[0].course_id : null);

  // 1. Fetch instructor courses on mount
  useEffect(() => {
    let isMounted = true;
    setIsLoadingCourses(true);

    quizGeneratorApi
      .getInstructorCourses()
      .then((res) => {
        if (!isMounted) return;
        const courseList = res?.data || [];
        setCourses(courseList);

        // Pre-select initial course ONLY
        if (initialCourseId) {
          setSelectedCourseId(initialCourseId);
        } else {
          setSelectedCourseId(null);
        }
      })
      .catch((err) => {
        console.warn("Failed to load instructor courses:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCourses(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialCourseId]);

  // 2. Fetch target course details (modules & lessons) whenever selectedCourseId changes
  useEffect(() => {
    if (!selectedCourseId) {
      setTargetCourse(null);
      setSelectedModuleId(null);
      setSelectedLessonId(null);
      return;
    }

    let isMounted = true;
    setIsLoadingCourseDetails(true);
    setSelectedModuleId(null);
    setSelectedLessonId(null);

    quizGeneratorApi
      .getCourseDetails(selectedCourseId)
      .then((detailRes) => {
        if (!isMounted) return;
        const detail = detailRes?.data || detailRes;
        setTargetCourse(detail);
      })
      .catch((err) => {
        console.warn("Failed to load target course details:", err);
        if (isMounted) setTargetCourse(null);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCourseDetails(false);
      });

    return () => {
      isMounted = false;
    };
  }, [selectedCourseId]);

  // Handle position change
  const handlePositionChange = (newPos: "capability_assessment" | "end_of_course" | "in_module" | "after_lesson") => {
    setPosition(newPos);
    setSelectedModuleId(null);
    setSelectedLessonId(null);
    setErrorInfo(null);
  };

  // Handle course selection change
  const handleCourseChange = (courseId: number) => {
    setSelectedCourseId(courseId);
    setErrorInfo(null);
  };

  // Extract modules and lessons from target course
  const modules: any[] = targetCourse?.modules || [];
  const lessons: any[] = [];
  if (Array.isArray(modules)) {
    modules.forEach((m: any) => {
      if (Array.isArray(m.lessons)) {
        m.lessons.forEach((l: any) => {
          lessons.push({ ...l, module_title: m.title });
        });
      }
    });
  }

  // Fallback for direct lessons if course has lessons array at root level
  if (lessons.length === 0 && Array.isArray(targetCourse?.lessons)) {
    targetCourse.lessons.forEach((l: any) => {
      lessons.push(l);
    });
  }

  // Validation logic
  const isPositionValid = () => {
    if (!selectedCourseId || isLoadingCourseDetails) return false;
    if (position === "in_module") {
      return Boolean(selectedModuleId && selectedModuleId > 0 && modules.length > 0);
    }
    if (position === "after_lesson") {
      return Boolean(selectedLessonId && selectedLessonId > 0 && lessons.length > 0);
    }
    return true;
  };

  const handleAttach = async () => {
    if (!selectedCourseId || !isPositionValid()) return;

    setIsAttaching(true);
    setErrorInfo(null);
    try {
      await quizGeneratorApi.attachQuiz(quiz.id, {
        course_id: selectedCourseId,
        position,
        module_id: position === "in_module" ? selectedModuleId : undefined,
        after_lesson_id: position === "after_lesson" ? selectedLessonId : undefined,
      });
      setAttachedSuccess(true);
    } catch (err: any) {
      const resp = err.response?.data;
      const msg = resp?.message || err.message || "Không thể gắn bài kiểm tra vào khóa học.";
      const code = resp?.error_code || resp?.errorCode || "ATTACH_QUIZ_FAILED";
      setErrorInfo({ message: msg, errorCode: code });
    } finally {
      setIsAttaching(false);
    }
  };

  const courseTitle = targetCourse?.title || quiz.course_title || "Khóa học đã chọn";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col gap-6 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-2xl font-black border border-emerald-100">
            🎯
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Lưu Thành Công</span>
            <h2 className="text-xl font-black text-[#2C3039]">{quiz.title}</h2>
            <p className="text-xs text-[#8A8478] font-medium mt-0.5">
              Đề kiểm tra đã được lưu vào thư viện. Vui lòng chọn Khóa học và Vị trí xuất hiện bên dưới.
            </p>
          </div>
        </div>

        {errorInfo && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-900 flex items-start justify-between gap-3 animate-fadeIn">
            <div className="flex items-start gap-3">
              <span className="text-xl">⚠️</span>
              <div>
                <h4 className="text-xs font-bold text-rose-800">Không thể gắn bài kiểm tra vào khóa học</h4>
                <p className="text-xs font-medium text-rose-700 mt-0.5">{errorInfo.message}</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-rose-100 text-rose-800 font-mono font-bold text-[10px] rounded-md">
                  Mã lỗi: {errorInfo.errorCode}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setErrorInfo(null)}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {attachedSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col items-center justify-center text-center gap-3 animate-fadeIn">
            <span className="text-4xl">🎉</span>
            <h3 className="text-base font-extrabold text-emerald-900">Đã Gắn Bài Kiểm Tra Vào Khóa Học Thành Công!</h3>
            <p className="text-xs font-medium text-emerald-700">
              Học viên trong khóa học "{courseTitle}" hiện có thể tham gia làm bài kiểm tra theo đúng vị trí bạn đã thiết lập.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Step 1: Course Selection */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                1. Khóa Học Gắn Kết
              </label>

              {isLoadingCourses ? (
                <div className="p-3.5 rounded-2xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-400 animate-pulse">
                  Đang nạp danh sách khóa học...
                </div>
              ) : courses.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex flex-col gap-1">
                  <span>⚠️ Bạn chưa có khóa học nào trong tài khoản.</span>
                  <span className="text-[11px] font-medium text-amber-700">
                    Hãy tạo khóa học trước khi gắn bài kiểm tra.
                  </span>
                </div>
              ) : initialCourseId ? (
                <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-[#C0392B] uppercase tracking-wider">
                        Khóa học được chọn
                      </span>
                      <span className="px-2 py-0.5 bg-white text-[#C0392B] font-black text-[10px] rounded-md border border-indigo-100 shadow-sm">
                        Cố định từ bước tạo
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-[#2C3039] mt-0.5">{courseTitle}</h3>
                  </div>
                  <div className="text-right flex flex-col items-end">
                    <span className="text-xs font-mono font-extrabold text-[#C0392B] block">
                      ID: #{selectedCourseId}
                    </span>
                    {isLoadingCourseDetails ? (
                      <span className="text-[10px] font-bold text-indigo-600 animate-pulse">Đang nạp Modules...</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-semibold">{modules.length} Modules</span>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <select
                    value={selectedCourseId || ""}
                    onChange={(e) => handleCourseChange(Number(e.target.value))}
                    className="w-full p-3.5 rounded-2xl border-2 border-[#E8E2D9] bg-white text-xs font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] shadow-sm cursor-pointer"
                  >
                    <option value="" disabled>-- Bắt buộc chọn khóa học để gắn bài kiểm tra --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.title} (ID: #{c.id})
                      </option>
                    ))}
                  </select>

                  {selectedCourseId && (
                    <div className="flex items-center justify-between px-2 text-[11px]">
                      <span className="font-semibold text-gray-500">
                        {isLoadingCourseDetails ? (
                          <span className="text-indigo-600 font-bold animate-pulse">⏳ Đang nạp Modules & Lessons...</span>
                        ) : (
                          <span className="text-emerald-700 font-bold">
                            ✓ {modules.length} Modules, {lessons.length} Lessons đã nạp
                          </span>
                        )}
                      </span>
                      <span className="font-mono font-bold text-[#C0392B]">ID: #{selectedCourseId}</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Step 2: Position Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                2. Chọn vị trí xuất hiện bài kiểm tra trong khóa học
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: "capability_assessment", label: "Kiểm tra tổng quát", icon: "🏆" },
                  { key: "end_of_course", label: "Cuối khóa học", icon: "🏁" },
                ].map((pos) => (
                  <button
                    key={pos.key}
                    type="button"
                    onClick={() => handlePositionChange(pos.key as any)}
                    className={`p-3.5 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1.5 transition-all cursor-pointer text-center ${
                      position === pos.key
                        ? "border-[#C0392B] bg-indigo-50 text-[#C0392B] shadow-xs ring-1 ring-[#C0392B]/30"
                        : "border-[#E8E2D9] text-[#8A8478] hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-xl">{pos.icon}</span>
                    <span className="leading-tight">{pos.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
          <button
            type="button"
            onClick={() => router.push(selectedCourseId ? `/instructor/quiz-generator?course_id=${selectedCourseId}` : "/instructor/quiz-generator")}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            Quay Về Danh Sách Quiz
          </button>

          {attachedSuccess ? (
            <button
              type="button"
              onClick={() => router.push(`/instructor/courses/${selectedCourseId}/edit`)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
            >
              <span>🚀 Xem Trong Quản Lý Khóa Học</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAttach}
              disabled={isAttaching || !isPositionValid()}
              className="px-6 py-2.5 bg-[#C0392B] hover:bg-[#a02c20] text-white text-xs font-black rounded-xl shadow-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
            >
              <span>{isAttaching ? "Đang gắn..." : "Gắn Bài Kiểm Tra Vào Khóa Học"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
