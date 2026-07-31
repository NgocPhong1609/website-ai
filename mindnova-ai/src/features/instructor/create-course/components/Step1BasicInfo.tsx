"use client";

import { useRef } from "react";
import { twMerge } from "tailwind-merge";
import type { CourseBasicInfo, DifficultyLevel } from "../types";

// ─── Props ────────────────────────────────────────────────────────────────────

interface Step1BasicInfoProps {
  data: CourseBasicInfo;
  onChange: <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onChange("thumbnailFile", file);
    const url = URL.createObjectURL(file);
    onChange("thumbnailPreview", url);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[18px] font-bold text-[#1A1A2E] mb-1">Thông tin cơ bản</h2>
        <p className="text-[13px] text-[#7878A0]">Nhập thông tin cơ bản về khóa học của bạn.</p>
      </div>

      {/* Title */}
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#3C3C5A]">
          Tên khóa học <span className="text-red-500">*</span>
        </span>
        <input
          id="course-title"
          type="text"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="VD: React từ cơ bản đến nâng cao"
          required
          className="h-11 rounded-xl border border-[#EAEAF4] bg-[#F8F8FC] px-4 text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] outline-none transition focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 focus:bg-white"
        />
      </label>

      {/* Description */}
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#3C3C5A]">Mô tả khóa học</span>
        <textarea
          id="course-description"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
          placeholder="Mô tả ngắn gọn về nội dung và mục tiêu của khóa học..."
          rows={4}
          className="rounded-xl border border-[#EAEAF4] bg-[#F8F8FC] px-4 py-3 text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] outline-none transition focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 focus:bg-white resize-none"
        />
      </label>

      {/* Field */}
      <label className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#3C3C5A]">Lĩnh vực</span>
        <input
          id="course-field"
          type="text"
          value={data.field}
          onChange={(e) => onChange("field", e.target.value)}
          placeholder="VD: Lập trình Web, Thiết kế UI/UX..."
          className="h-11 rounded-xl border border-[#EAEAF4] bg-[#F8F8FC] px-4 text-sm text-[#1A1A2E] placeholder:text-[#B0B0C8] outline-none transition focus:border-[#6B6BFF] focus:ring-2 focus:ring-[#6B6BFF]/10 focus:bg-white"
        />
      </label>

      {/* Difficulty */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#3C3C5A]">Cấp độ</span>
        <div className="flex gap-3">
          {(["beginner", "advanced"] as DifficultyLevel[]).map((level) => (
            <button
              key={level}
              type="button"
              onClick={() => onChange("difficulty", level)}
              className={twMerge(
                "flex-1 h-11 rounded-xl border text-sm font-semibold transition-all duration-150",
                data.difficulty === level
                  ? "border-[#6B6BFF] bg-[#EEF0FF] text-[#4648D4]"
                  : "border-[#EAEAF4] bg-[#F8F8FC] text-[#7878A0] hover:border-[#C0C0E8]"
              )}
            >
              {level === "beginner" ? "Cơ bản" : "Nâng cao"}
            </button>
          ))}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[13px] font-semibold text-[#3C3C5A]">
          Ảnh bìa khóa học <span className="text-red-500">*</span>
        </span>
        <div
          onClick={() => fileInputRef.current?.click()}
          className={twMerge(
            "relative flex flex-col items-center justify-center w-full h-44 rounded-2xl border-2 border-dashed cursor-pointer transition-colors duration-150",
            data.thumbnailPreview
              ? "border-[#6B6BFF] bg-[#F4F4FA]"
              : "border-[#D0D0E8] bg-[#F8F8FC] hover:border-[#6B6BFF] hover:bg-[#F4F4FA]"
          )}
        >
          {data.thumbnailPreview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={data.thumbnailPreview}
              alt="Thumbnail preview"
              className="absolute inset-0 w-full h-full object-cover rounded-2xl"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-[#B0B0C8]">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-[13px] font-medium">Nhấn để tải ảnh lên</span>
              <span className="text-[11px]">PNG, JPG · Tối đa 5MB</span>
            </div>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleThumbnailChange}
        />
      </div>
    </div>
  );
}
