"use client";

// ─── Step1BasicInfo ────────────────────────────────────────────────────────────
// Form fields for Step 1: Course title, description, field, and difficulty.

import { useCallback } from "react";
import { twMerge } from "tailwind-merge";
import { ThumbnailUploader } from "./ThumbnailUploader";
import { AITipCard } from "./AITipCard";
import { ChevronDownIcon } from "./icons";
import {
  COURSE_FIELDS,
  MAX_TITLE_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../constants";
import type { CourseBasicInfo, DifficultyLevel } from "../types";

// ─── Sub-components ───────────────────────────────────────────────────────────

interface CharCountProps {
  current: number;
  max: number;
}

function CharCount({ current, max }: CharCountProps) {
  const isNearLimit = current > max * 0.8;
  return (
    <span
      className={twMerge(
        "text-xs tabular-nums transition-colors duration-150",
        isNearLimit ? "text-amber-500 font-medium" : "text-[#B0B0C8]",
        current >= max && "text-red-500 font-semibold",
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
            "flex-1 py-2.5 px-4 rounded-xl text-sm font-medium border transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#6B6BFF]/30",
            value === key
              ? "border-[#4648D4] bg-[#4648D4] text-white shadow-[0_2px_10px_rgba(70,72,212,0.3)]"
              : "border-[#EAEAF4] bg-white text-[#64647A] hover:border-[#C5C6FF] hover:text-[#4648D4]",
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

// ─── Main form component ──────────────────────────────────────────────────────

interface Step1BasicInfoProps {
  data: CourseBasicInfo;
  onChange: <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1BasicInfoProps) {
  const handleThumbnail = useCallback(
    (file: File, preview: string) => {
      onChange("thumbnailFile", file);
      onChange("thumbnailPreview", preview);
    },
    [onChange],
  );

  const handleThumbnailRemove = useCallback(() => {
    onChange("thumbnailFile", null);
    onChange("thumbnailPreview", null);
  }, [onChange]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
      {/* ── Left column: Thumbnail + AI tip ───────────────────────────── */}
      <div className="flex flex-col gap-4">
        {/* Label */}
        <div>
          <p className="text-sm font-semibold text-[#1A1A2E]">Ảnh bìa khóa học</p>
          <p className="text-[12px] text-[#9090B0] mt-0.5 leading-relaxed">
            Tải lên hình ảnh đại diện hấp dẫn để thu hút học viên.
          </p>
        </div>

        <ThumbnailUploader
          preview={data.thumbnailPreview}
          onChange={handleThumbnail}
          onRemove={handleThumbnailRemove}
        />

        <AITipCard />
      </div>

      {/* ── Right column: Text fields ─────────────────────────────────── */}
      <div className="flex flex-col gap-5">
        {/* Course title */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="course-title"
              className="text-sm font-semibold text-[#1A1A2E]"
            >
              Tên khóa học <span className="text-red-500">*</span>
            </label>
            <CharCount current={data.title.length} max={MAX_TITLE_LENGTH} />
          </div>
          <input
            id="course-title"
            type="text"
            value={data.title}
            maxLength={MAX_TITLE_LENGTH}
            placeholder="Nhập tên khóa học"
            onChange={(e) => onChange("title", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all duration-200"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="course-description"
              className="text-sm font-semibold text-[#1A1A2E]"
            >
              Mô tả ngắn <span className="text-red-500">*</span>
            </label>
            <CharCount
              current={data.description.length}
              max={MAX_DESCRIPTION_LENGTH}
            />
          </div>
          <textarea
            id="course-description"
            value={data.description}
            maxLength={MAX_DESCRIPTION_LENGTH}
            rows={4}
            placeholder="Nhập mô tả ngắn cho khóa học này để học viên nắm bắt được giá trị cốt lõi..."
            onChange={(e) => onChange("description", e.target.value)}
            className="w-full px-4 py-3 rounded-xl text-sm text-[#1A1A2E] placeholder-[#B0B0C8] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

        {/* Field + Difficulty row */}
        <div className="grid grid-cols-[1fr_auto] gap-4 items-start">
          {/* Field select */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="course-field"
              className="text-sm font-semibold text-[#1A1A2E]"
            >
              Lĩnh vực
            </label>
            <div className="relative">
              <select
                id="course-field"
                value={data.field}
                onChange={(e) => onChange("field", e.target.value)}
                className="w-full appearance-none px-4 py-3 pr-10 rounded-xl text-sm text-[#1A1A2E] bg-white border border-[#EAEAF4] focus:outline-none focus:border-[#6B6BFF] focus:ring-4 focus:ring-[#6B6BFF]/10 transition-all duration-200 cursor-pointer"
              >
                <option value="" disabled>
                  Chọn lĩnh vực
                </option>
                {COURSE_FIELDS.map((f) => (
                  <option key={f} value={f}>
                    {f}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[#9090B0]">
                <ChevronDownIcon size={16} />
              </div>
            </div>
          </div>

          {/* Difficulty */}
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-semibold text-[#1A1A2E]">Trình độ</p>
            <DifficultyToggle
              value={data.difficulty}
              onChange={(v) => onChange("difficulty", v)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
