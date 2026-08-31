"use client";

import React, { useEffect, useState } from "react";
import { QuizConfig } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";

interface ManualConfigFormProps {
  config: QuizConfig;
  onChangeConfig: (fields: Partial<QuizConfig>) => void;
  onNext: () => void;
  embeddedMode?: boolean;
}

export function ManualConfigForm({
  config,
  onChangeConfig,
  onNext,
  embeddedMode = false,
}: ManualConfigFormProps) {
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoadingCourses, setIsLoadingCourses] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setIsLoadingCourses(true);
    quizGeneratorApi
      .getInstructorCourses()
      .then((res) => {
        if (isMounted && res?.data && Array.isArray(res.data)) {
          setCourses(res.data);

          if (config.course_id) {
            const matched = res.data.find((c: any) => c.id === config.course_id);
            if (matched) {
              onChangeConfig({ course_title: matched.title });
            }
          }
        }
      })
      .catch((err) => {
        console.warn("Failed to load courses:", err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingCourses(false);
      });
    return () => {
      isMounted = false;
    };
  }, [config.course_id]);

  const isFormValid = config.title.trim().length > 0 && config.time_limit_minutes > 0;

  return (
    <div className="p-8 bg-white rounded-3xl border border-[#E8E2D9] shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-gray-100 pb-5">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl font-black text-[#C0392B] border border-indigo-100">
          ⚙️
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black text-[#C0392B] tracking-wider uppercase">Cấu hình thông số</span>
          <h2 className="text-xl font-black text-[#2C3039]">Thông Tin Bài Kiểm Tra Thủ Công</h2>
          <p className="text-xs text-[#8A8478] font-medium mt-1 max-w-2xl">
            Thiết lập tên đề thi, thời gian làm bài và điểm đạt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: General Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-extrabold text-[#1A1A2E] flex items-center gap-2">
              <span>📋</span> Thông tin chung
            </h3>
            <div className="p-5 rounded-2xl bg-[#FAF8FF] border border-indigo-50 flex flex-col gap-4">
              {!embeddedMode && !config.course_id && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Khóa học gắn kết <span className="text-rose-500">*</span></label>
                  {isLoadingCourses ? (
                    <div className="p-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-500 animate-pulse bg-white">
                      Đang tải danh sách khóa học...
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
                      Bạn chưa tạo khóa học nào. Vui lòng tạo khóa học trước khi thiết lập bài kiểm tra.
                    </div>
                  ) : (
                    <select
                      value={config.course_id || ""}
                      onChange={(e) => {
                        const cId = Number(e.target.value);
                        const course = courses.find((c) => c.id === cId);
                        onChangeConfig({
                          course_id: cId,
                          course_title: course?.title,
                        });
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] transition-all bg-white"
                    >
                      <option value="" disabled>-- Chọn khóa học --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.title} (ID: #{c.id})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">Tên bài kiểm tra <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => onChangeConfig({ title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-bold text-[#2C3039] focus:outline-none focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] transition-all bg-white"
                  placeholder="VD: Kiểm tra cuối khóa HTML/CSS"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">Mô tả ngắn</label>
                <textarea
                  value={config.description}
                  onChange={(e) => onChangeConfig({ description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-[#2C3039] focus:outline-none focus:border-[#C0392B] focus:ring-1 focus:ring-[#C0392B] transition-all bg-white resize-none"
                  placeholder="Đề kiểm tra đánh giá năng lực..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Settings */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-extrabold text-[#1A1A2E] flex items-center gap-2">
              <span>⚖️</span> Thông số bài thi
            </h3>
            <div className="p-5 rounded-2xl bg-amber-50/50 border border-amber-100/50 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Thời gian (phút)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={config.time_limit_minutes}
                      onChange={(e) => onChangeConfig({ time_limit_minutes: Number(e.target.value) })}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-[#2C3039] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      phút
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-extrabold text-gray-700">Điểm đạt (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={config.passing_score}
                      onChange={(e) => onChangeConfig({ passing_score: Number(e.target.value) })}
                      className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-gray-200 text-sm font-black text-[#2C3039] focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-extrabold text-gray-700">Mức độ khó chung</label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { val: "easy", label: "Dễ" },
                    { val: "medium", label: "TB" },
                    { val: "hard", label: "Khó" },
                    { val: "mixed", label: "Hỗn hợp" },
                  ].map((level) => (
                    <button
                      key={level.val}
                      type="button"
                      onClick={() => onChangeConfig({ difficulty: level.val as any })}
                      className={`py-2 rounded-xl text-[11px] font-black transition-all border cursor-pointer ${
                        config.difficulty === level.val
                          ? "bg-[#2C3039] text-white border-[#2C3039] shadow-sm"
                          : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {level.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end border-t border-gray-100 pt-5 mt-2">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className="px-8 py-3.5 bg-[#C0392B] hover:bg-[#a02c20] text-white font-black text-sm rounded-2xl shadow-xl hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>Tiếp tục soạn câu hỏi ➔</span>
        </button>
      </div>
    </div>
  );
}
