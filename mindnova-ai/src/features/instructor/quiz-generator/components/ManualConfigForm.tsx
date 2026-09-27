"use client";

import React, { useEffect, useState } from "react";
import { QuizConfig } from "../types/quizGenerator.types";
import { quizGeneratorApi } from "../api/quizGeneratorApi";
import { QuizImageField } from "./QuizImageField";

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
    <div className="p-8 bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col gap-6 animate-fadeIn">
      {/* Header */}
      <div className="flex items-start gap-4 border-b border-slate-100 pb-5">
        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-2xl font-bold text-blue-500 border border-blue-100">
          ⚙️
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-bold text-blue-500 tracking-wider uppercase">Cấu hình thông số</span>
          <h2 className="text-xl font-bold text-slate-900">Thông Tin Bài Kiểm Tra Thủ Công</h2>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl">
            Thiết lập tên đề thi, thời gian làm bài và điểm đạt.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: General Info */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>📋</span> Thông tin chung
            </h3>
            <div className="p-5 rounded-lg bg-slate-50 border border-blue-50 flex flex-col gap-4">
              {!embeddedMode && !config.course_id && (
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Khóa học gắn kết <span className="text-rose-500">*</span></label>
                  {isLoadingCourses ? (
                    <div className="p-2.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-500 animate-pulse bg-white">
                      Đang tải danh sách khóa học...
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold">
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
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
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
                <label className="text-xs font-semibold text-slate-700">Tên bài kiểm tra <span className="text-rose-500">*</span></label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => onChangeConfig({ title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white"
                  placeholder="VD: Kiểm tra cuối khóa HTML/CSS"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Mô tả ngắn</label>
                <textarea
                  value={config.description}
                  onChange={(e) => onChangeConfig({ description: e.target.value })}
                  rows={2}
                  className="w-full px-4 py-2.5 rounded-lg border border-slate-200 text-sm font-medium text-slate-900 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all bg-white resize-none"
                  placeholder="Đề kiểm tra đánh giá năng lực..."
                />
              </div>
              <QuizImageField
                label="Ảnh đại diện Quiz"
                purpose="thumbnail"
                value={{ url: config.thumbnail_url || null, r2_key: config.thumbnail_r2_key || null }}
                onChange={(image) => onChangeConfig({ thumbnail_url: image.url, thumbnail_r2_key: image.r2_key })}
              />
            </div>
          </div>
        </div>

        {/* Right Column: Quiz Settings */}
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <span>⚖️</span> Thông số bài thi
            </h3>
            <div className="p-5 rounded-lg bg-amber-50/50 border border-amber-100/50 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Thời gian (phút)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      value={config.time_limit_minutes}
                      onChange={(e) => onChangeConfig({ time_limit_minutes: Number(e.target.value) })}
                      className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      phút
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-slate-700">Điểm đạt (%)</label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={config.passing_score}
                      onChange={(e) => onChangeConfig({ passing_score: Number(e.target.value) })}
                      className="w-full pl-4 pr-10 py-2.5 rounded-lg border border-slate-200 text-sm font-bold text-slate-900 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all bg-white"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      %
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">Mức độ khó chung</label>
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
                      className={`py-2 rounded-lg text-[11px] font-bold transition-all border cursor-pointer ${
                        config.difficulty === level.val
                          ? "bg-slate-900 text-white border-slate-900 shadow-sm"
                          : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
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

      <div className="flex items-center justify-end border-t border-slate-100 pt-5 mt-2">
        <button
          type="button"
          disabled={!isFormValid}
          onClick={onNext}
          className="px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-bold text-sm rounded-lg shadow-xl hover:scale-105 transition-all disabled:opacity-40 disabled:scale-100 cursor-pointer disabled:cursor-not-allowed flex items-center gap-2"
        >
          <span>Tiếp tục soạn câu hỏi ➔</span>
        </button>
      </div>
    </div>
  );
}
