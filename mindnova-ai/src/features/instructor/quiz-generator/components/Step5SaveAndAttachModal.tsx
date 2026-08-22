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
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [position, setPosition] = useState<"end_of_course" | "in_module" | "after_lesson">("end_of_course");
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [selectedLessonId, setSelectedLessonId] = useState<number | null>(null);
  const [isAttaching, setIsAttaching] = useState(false);
  const [attachedSuccess, setAttachedSuccess] = useState(false);

  useEffect(() => {
    // Fetch instructor courses
    quizGeneratorApi.getInstructorCourses().then((res) => {
      if (res?.data && Array.isArray(res.data)) {
        setCourses(res.data);
        if (res.data.length > 0) {
          setSelectedCourseId(res.data[0].id);
        }
      }
    }).catch((err) => {
      console.warn("Failed to load instructor courses:", err);
    });
  }, []);

  const selectedCourse = courses.find((c) => c.id === selectedCourseId);
  const modules = selectedCourse?.modules || [];
  const lessons = selectedCourse?.lessons || [];

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
            <p className="text-xs text-gray-500 font-medium">
              Đề kiểm tra đã được lưu vào hệ thống. Bây giờ bạn có thể gắn trực tiếp vào khóa học của mình.
            </p>
          </div>
        </div>

        {/* Course Attachment Form */}
        {attachedSuccess ? (
          <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col items-center justify-center text-center gap-3">
            <span className="text-4xl">✅</span>
            <h3 className="text-base font-extrabold">Đã Gắn Bài Kiểm Tra Vào Khóa Học Thành Công!</h3>
            <p className="text-xs font-medium text-emerald-700">
              Học viên enrolled trong khóa học hiện có thể làm bài kiểm tra này theo đúng vị trí bạn đã cấu hình.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {/* Step 1: Select Course */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">1. Chọn khóa học của bạn</label>
              <select
                value={selectedCourseId || ""}
                onChange={(e) => setSelectedCourseId(Number(e.target.value))}
                className="w-full p-3.5 rounded-xl border border-gray-200 bg-[#FAF8FF] text-xs font-bold text-gray-800 focus:outline-none focus:border-[#4F46E5]"
              >
                {courses.length === 0 ? (
                  <option value="">Chưa có khóa học nào</option>
                ) : (
                  courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Step 2: Select Position */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">2. Chọn vị trí gắn bài kiểm tra</label>
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
                    className={`p-3 rounded-xl border text-xs font-extrabold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                      position === pos.key
                        ? "border-[#4F46E5] bg-indigo-50 text-[#4F46E5]"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    <span className="text-base">{pos.icon}</span>
                    <span>{pos.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-selectors */}
            {position === "in_module" && modules.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Chọn Module / Section</label>
                <select
                  value={selectedModuleId || ""}
                  onChange={(e) => setSelectedModuleId(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs font-bold"
                >
                  <option value="">-- Chọn Module --</option>
                  {modules.map((m: any) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {position === "after_lesson" && lessons.length > 0 && (
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Chọn Bài Học Đứng Trước</label>
                <select
                  value={selectedLessonId || ""}
                  onChange={(e) => setSelectedLessonId(Number(e.target.value))}
                  className="w-full p-3 rounded-xl border border-gray-200 text-xs font-bold"
                >
                  <option value="">-- Chọn Bài Học --</option>
                  {lessons.map((l: any) => (
                    <option key={l.id} value={l.id}>
                      {l.title}
                    </option>
                  ))}
                </select>
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
              disabled={isAttaching || !selectedCourseId}
              className="px-6 py-2.5 bg-[#4F46E5] hover:bg-[#4338CA] text-white text-xs font-black rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer"
            >
              {isAttaching ? "Đang gắn..." : "🔗 Gắn Bài Kiểm Tra Vào Khóa Học"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
