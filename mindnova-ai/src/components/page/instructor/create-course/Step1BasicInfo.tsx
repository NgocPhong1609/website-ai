"use client";

import React, { useCallback, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ThumbnailUploader } from "./ThumbnailUploader";
import { AITipCard } from "./AITipCard";
import { ChevronDownIcon } from "./icons";
import {
  COURSE_FIELDS,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "./constants";
import type { CourseBasicInfo, DifficultyLevel } from "./types";

interface CharCountProps {
  current: number;
  max: number;
}

function CharCount({ current, max }: CharCountProps) {
  const isNearLimit = current > max * 0.8;
  return (
    <span
      className={twMerge(
        "text-xs font-mono transition-colors duration-150",
        isNearLimit ? "text-amber-600 font-bold" : "text-gray-400 font-medium",
        current >= max && "text-rose-600 font-bold"
      )}
    >
      {current}/{max}
    </span>
  );
}

interface DifficultyToggleProps {
  value: DifficultyLevel;
  onChange: (v: DifficultyLevel) => void;
}

function DifficultyToggle({ value, onChange }: DifficultyToggleProps) {
  const options: { key: DifficultyLevel; label: string }[] = [
    { key: "beginner", label: "Cơ bản" },
    { key: "advanced", label: "Nâng cao" },
  ];

  return (
    <div className="flex gap-2" role="group" aria-label="Trình độ khóa học">
      {options.map(({ key, label }) => (
        <button
          key={key}
          id={`difficulty-${key}`}
          type="button"
          aria-pressed={value === key}
          onClick={() => onChange(key)}
          className={twMerge(
            "px-4 py-2.5 rounded-xl text-xs font-bold border transition-all cursor-pointer",
            value === key
              ? "border-[#4F46E5] bg-[#4F46E5] text-white shadow-2xs"
              : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:text-gray-900 hover:bg-gray-50/70"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

interface Step1BasicInfoProps {
  data: CourseBasicInfo;
  onChange: <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const [aiTip, setAiTip] = useState<string | null>(null);

  const handleThumbnail = useCallback(
    (file: File, preview: string) => {
      onChange("thumbnailFile", file);
      onChange("thumbnailPreview", preview);
    },
    [onChange]
  );

  const handleThumbnailRemove = useCallback(() => {
    onChange("thumbnailFile", null);
    onChange("thumbnailPreview", null);
  }, [onChange]);

  const handleAIOptimize = () => {
    setAiTip(
      "AI gợi ý: Thêm từ khóa 'Agentic Workflow' và 'RAG' vào tiêu đề phụ để gia tăng 35% lưu lượng tìm kiếm tự nhiên (SEO)."
    );
  };

  return (
    <div className="flex flex-col gap-6 animate-fadeIn">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 bg-white p-5 rounded-2xl shadow-2xs">
        <div>
          <h2 className="text-base font-black text-gray-900">Thông tin cơ bản khóa học</h2>
          <p className="text-xs text-gray-500 mt-0.5">Cập nhật tiêu đề và mô tả chính hiển thị trên danh mục học viện MindNova.</p>
        </div>
        <button
          type="button"
          onClick={handleAIOptimize}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#EEF2FF] hover:bg-indigo-100 text-[#4F46E5] text-xs font-black transition-all border border-indigo-200 shadow-2xs cursor-pointer"
        >
          <span>✨</span>
          <span>AI Tối ưu hóa</span>
        </button>
      </div>

      {aiTip && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 text-indigo-950 text-xs font-bold flex items-start justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <span className="text-base">🤖</span>
            <span>{aiTip}</span>
          </div>
          <button type="button" onClick={() => setAiTip(null)} className="text-gray-400 hover:text-gray-700 font-extrabold cursor-pointer">✕</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
        {/* Left column: Thumbnail + AI tip */}
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-xs font-black text-gray-900 uppercase tracking-wider">Ảnh bìa khóa học</p>
            <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">
              Tải lên hình ảnh đại diện tỷ lệ 4:3 hấp dẫn để thu hút học viên trên sàn MindNova.
            </p>
          </div>

          <ThumbnailUploader
            preview={data.thumbnailPreview}
            onChange={handleThumbnail}
            onRemove={handleThumbnailRemove}
          />

          <AITipCard />
        </div>

        {/* Right column: Text fields */}
        <div className="flex flex-col gap-5 bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs">
          {/* Course title */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="course-title" className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Tên khóa học <span className="text-rose-500">*</span>
              </label>
              <CharCount current={data.title.length} max={MAX_TITLE_LENGTH} />
            </div>
            <input
              id="course-title"
              type="text"
              value={data.title}
              maxLength={MAX_TITLE_LENGTH}
              placeholder="Ví dụ: Lập trình Trí tuệ Nhân tạo AI Mastery với LLM & RAG 2026..."
              onChange={(e) => onChange("title", e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl text-xs font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all shadow-2xs"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="course-description" className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Mô tả ngắn <span className="text-rose-500">*</span>
              </label>
              <CharCount current={data.description.length} max={MAX_DESCRIPTION_LENGTH} />
            </div>
            <textarea
              id="course-description"
              value={data.description}
              maxLength={MAX_DESCRIPTION_LENGTH}
              rows={4}
              placeholder="Nhập tóm tắt khóa học giúp học viên nhanh chóng nắm bắt được giá trị kiến thức, cơ hội việc làm và mục tiêu đạt được sau tốt nghiệp..."
              onChange={(e) => onChange("description", e.target.value)}
              className="w-full px-4 py-3 rounded-xl text-xs font-medium text-gray-900 placeholder:text-gray-400 placeholder:font-normal bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all resize-none leading-relaxed shadow-2xs"
            />
          </div>

          {/* Field + Difficulty row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
            {/* Field select */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="course-field" className="text-xs font-black text-gray-900 uppercase tracking-wider">
                Lĩnh vực Chuyên môn
              </label>
              <div className="relative">
                <select
                  id="course-field"
                  value={data.field}
                  onChange={(e) => onChange("field", e.target.value)}
                  className="w-full appearance-none px-4 py-2.5 pr-10 rounded-xl text-xs font-bold text-gray-900 bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:bg-white transition-all cursor-pointer shadow-2xs"
                >
                  <option value="" disabled className="text-gray-400 font-normal">
                    -- Chọn lĩnh vực --
                  </option>
                  {COURSE_FIELDS.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-gray-500">
                  <ChevronDownIcon size={14} />
                </div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-black text-gray-900 uppercase tracking-wider">Trình độ Khóa học</span>
              <DifficultyToggle
                value={data.difficulty}
                onChange={(v) => onChange("difficulty", v)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
