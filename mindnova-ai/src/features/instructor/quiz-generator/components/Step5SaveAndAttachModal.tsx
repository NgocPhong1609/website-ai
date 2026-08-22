"use client";

import React, { useEffect, useState } from "react";
import { QuizSummary } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { useRouter } from "next/navigation";

interface Step5SaveAndAttachModalProps {
  quiz: QuizSummary;
  onClose: () => void;
}

export function Step5SaveAndAttachModal({ quiz, onClose }: Step5SaveAndAttachModalProps) {
  const router = useRouter();
  const [courses, setCourses] = useState<any[]>([]);
  const [targetCourse, setTargetCourse] = useState<any>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [position, setPosition] = useState<"end_of_course" | "in_module" | "after_lesson">("end_of_course");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachedSuccess, setAttachedSuccess] = useState(false);
  const [isLoadingCourseDetails, setIsLoadingCourseDetails] = useState(true);

  // Determine attached or pre-selected course ID
  const initialCourseId =
    quiz.course_id ||
    (quiz.attachments && quiz.attachments.length > 0 ? quiz.attachments[0].course_id : null);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCourseDetails(true);

    quizGeneratorApi
      .getInstructorCourses()
      .then((res) => {
        if (!isMounted) return;
        const courseList = res?.data || [];
        setCourses(courseList);

        // Find initial locked course or default to first course
        const activeCourseId = initialCourseId || (courseList.length > 0 ? courseList[0].id : null);
        if (activeCourseId) {
          setSelectedCourseId(activeCourseId);
          // Fetch full course details (modules & lessons)
          quizGeneratorApi
            .getCourseDetails(activeCourseId)
            .then((detailRes) => {
              if (isMounted && detailRes?.data) {
                setTargetCourse(detailRes.data);
              }
            })
            .catch((err) => console.warn("Failed to load target course details:", err))
            .finally(() => {
              if (isMounted) setIsLoadingCourseDetails(false);
            });
        } else {
          setIsLoadingCourseDetails(false);
        }
      })
      .catch((err) => {
        console.warn("Failed to load instructor courses:", err);
        if (isMounted) setIsLoadingCourseDetails(false);
      });

    return () => {
      isMounted = false;
    };
  }, [initialCourseId]);

  // Extract modules and lessons from target course
  const modules: any[] = targetCourse?.modules || [];
  const lessons: any[] = [];
  modules.forEach((m: any) => {
    if (Array.isArray(m.lessons)) {
      m.lessons.forEach((l: any) => {
        lessons.push({ ...l, module_title: m.title });
      });
    }
  });

  const handleAttach = async () => {
    if (!selectedCourseId) return;

    setIsAttaching(true);
    try {
      await quizGeneratorApi.attachQuiz(quiz.id, {
        course_id: selectedCourseId,
        position,
        module_id: position === "in_module" ? selectedModuleId : undefined,
        after_lesson_id: position === "after_lesson" ? selectedLessonId : undefined,
      });
      setAttachedSuccess(true);
    } catch (err: any) {
      alert("Không thể gắn bài kiểm tra vào khóa học: " + (err.message || "Lỗi server"));
    } finally {
      setIsAttaching(false);
    }
  };

  const courseTitle = targetCourse?.title || quiz.course_title || "Khóa học đã chọn";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col gap-6 p-8">
        {/* Header */}
        <div className="flex items-center gap-4 border-b border-gray-100 pb-5">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center text-2xl font-black shadow-sm">
            🎉
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Lưu Thành Công</span>
            <h2 className="text-xl font-black text-[#1A1A2E]">{quiz.title}</h2>
            <p className="text-xs text-gray-500 font-medium mt-0.5">
              Đề kiểm tra đã được lưu trữ thành công. Vui lòng xác nhận vị trí gắn vào khóa học bên dưới.
            </p>
          </div>
        </div>

        {/* Attachment Options */}
        {attachedSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-4xl">✅</span>
            <h3 className="text-base font-extrabold">Đã Gắn Bài Kiểm Tra Vào Khóa Học Thành Công!</h3>
            <p className="text-xs font-medium text-emerald-700">
              Học viên trong khóa học "{courseTitle}" hiện có thể tham gia làm bài kiểm tra theo đúng vị trí bạn chọn.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-5">
            {/* Step 1: Locked Course Display */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                1. Khóa học của bạn (Khóa học gắn kết)
              </label>

              <div className="p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4F46E5] text-white flex items-center justify-center text-xl font-bold shadow-md">
                    📚
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-black text-indigo-600 uppercase tracking-wider">
                        Khóa học được chọn
                      </span>
                      <span className="px-2 py-0.5 bg-white text-indigo-700 font-black text-[10px] rounded-md border border-indigo-100 shadow-2xs">
                        🔒 Khóa học cố định từ bước 1
                      </span>
                    </div>
                    <h3 className="text-sm font-black text-[#1A1A2E] mt-0.5">{courseTitle}</h3>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-extrabold text-indigo-600 block">
                    ID: #{selectedCourseId}
                  </span>
                  <span className="text-[10px] text-gray-400 font-semibold">Khóa học này không thể thay đổi</span>
                </div>
              </div>
            </div>

            {/* Step 2: Position Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
                2. Chọn vị trí xuất hiện bài kiểm tra trong khóa học
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { key: "end_of_course", label: "Cuối khóa học", icon: "🏁" },
                  { key: "in_module", label: "Trong một Module", icon: "📂" },
                  { key: "after_lesson", label: "Sau bài học cụ thể", icon: "📖" },
                ].map((pos) => (
                  <button
                    key={pos.key}
                    type="button"
                    onClick={() => setPosition(pos.key as any)}
                    className={`p-3.5 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      position === pos.key
                        ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5] shadow-xs"
                        : "border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <span className="text-lg">{pos.icon}</span>
                    <span>{pos.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Position Options Dropdowns */}
            {position === "in_module" && (
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="block text-xs font-extrabold text-gray-700">
                  Chọn Module thuộc khóa học "{courseTitle}":
                </label>
                {modules.length === 0 ? (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-500">
                    Khóa học chưa tạo Module nào. Bài kiểm tra sẽ được gắn ở cuối khóa học.
                  </div>
                ) : (
                  <select
                    value={selectedModuleId || ""}
                    onChange={(e) => setSelectedModuleId(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="">-- Chọn Module trong khóa học --</option>
                    {modules.map((m: any) => (
                      <option key={m.id} value={m.id}>
                        📂 Module: {m.title}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}

            {position === "after_lesson" && (
              <div className="flex flex-col gap-1.5 animate-fadeIn">
                <label className="block text-xs font-extrabold text-gray-700">
                  Chọn Bài học đứng trước thuộc khóa học "{courseTitle}":
                </label>
                {lessons.length === 0 ? (
                  <div className="p-3 rounded-xl bg-gray-50 border border-gray-200 text-xs font-bold text-gray-500">
                    Khóa học chưa có bài học nào. Bài kiểm tra sẽ được gắn ở cuối khóa học.
                  </div>
                ) : (
                  <select
                    value={selectedLessonId || ""}
                    onChange={(e) => setSelectedLessonId(Number(e.target.value))}
                    className="w-full p-3 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4F46E5]"
                  >
                    <option value="">-- Chọn Bài học trong khóa học --</option>
                    {lessons.map((l: any) => (
                      <option key={l.id} value={l.id}>
                        📖 {l.title} ({l.module_title})
                      </option>
                    ))}
                  </select>
                )}
              </div>
            )}
          </div>
        )}

        {/* Modal Footer Actions */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-2">
          <button
            type="button"
            onClick={() => router.push("/instructor/quiz-generator")}
            className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-extrabold transition-all cursor-pointer"
          >
            Quay Về Danh Sách Quiz
          </button>

          {!attachedSuccess && (
            <button
              type="button"
              onClick={handleAttach}
              disabled={isAttaching || !selectedCourseId || isLoadingCourseDetails}
              className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-black rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer flex items-center gap-2"
            >
              <span>{isAttaching ? "Đang gắn..." : "🔗 Gắn Bài Kiểm Tra Vào Khóa Học"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
