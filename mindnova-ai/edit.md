# 1. Thông tin tổng quan & SEO (Step1BasicInfo.tsx)
**File path:** `src/features/instructor/create-course/components/Step1BasicInfo.tsx`

```tsx
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
} from "../constants";
import type { CourseBasicInfo, DifficultyLevel } from "../types";

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
                  className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-xl text-xs bg-gray-50/50 border border-gray-200 focus:outline-none focus:border-[#4F46E5] focus:ring-2 focus:ring-[#4F46E5]/20 focus:bg-white transition-all cursor-pointer shadow-2xs ${
                    !data.field ? "text-gray-400 font-normal" : "text-gray-900 font-bold"
                  }`}
                >
                  <option value="" disabled className="text-gray-400 font-normal">
                    -- Chọn lĩnh vực --
                  </option>
                  {COURSE_FIELDS.map((f) => (
                    <option key={f} value={f} className="text-gray-900 font-bold">
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
```

---

# 2. Giá bán & Khuyến mãi (Step3SettingsPrice.tsx)
**File path:** `src/features/instructor/create-course/components/Step3SettingsPrice.tsx`

```tsx
"use client";

import React, { useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { useInstructorPricing } from "@/src/hooks/instructor/useInstructorPricing";
import { useCreateCourseStore } from "../stores/createCourseStore";

export interface Step3SettingsPriceProps {
  courseTitle?: string;
  thumbnailPreview?: string | null;
  onSaveConfig?: () => void;
}

export function Step3SettingsPrice({ courseTitle = "Khóa học AI mới", thumbnailPreview, onSaveConfig }: Step3SettingsPriceProps) {
  const setSettings = useCreateCourseStore((s) => s.setSettings);
  
  const {
    isFree,
    basePrice,
    tier,
    discount,
    validationError,
    revenue,
    setIsFree,
    setBasePrice,
    setTier,
    toggleDiscount,
    updateDiscount,
  } = useInstructorPricing(50);

  useEffect(() => {
    setSettings("basePrice", basePrice);
  }, [basePrice, setSettings]);

  return (
    <div className="w-full flex flex-col gap-6 animate-fadeIn">
      {/* Top Title Banner */}
      <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs">
        <h3 className="text-base font-black text-gray-900">Cấu hình Giá bán &amp; Doanh thu</h3>
        <p className="text-xs text-gray-500 mt-1">
          Thiết lập khoảng giá tiêu chuẩn cho khóa học ($10–$500 USD), lên lịch chương trình ưu đãi khuyến mãi và dự toán thu nhập thực tế theo thời gian thực.
        </p>
      </div>

      {/* Main Grid Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column - Form Config */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          
          {/* Free vs Paid Toggle */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h4 className="text-sm font-black text-gray-900">Hình Thức Phát Hành Khóa Học</h4>
                <p className="text-xs text-gray-500">Lựa chọn giữa miễn phí cống hiến cho cộng đồng hoặc thu phí chuyên nghiệp.</p>
              </div>
              <div className="flex items-center gap-1 p-1 rounded-xl bg-gray-100 border border-gray-200 w-fit shrink-0">
                <button
                  type="button"
                  onClick={() => setIsFree(false)}
                  className={twMerge(
                    "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                    !isFree ? "bg-[#4F46E5] text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  💰 Khóa Thu Phí
                </button>
                <button
                  type="button"
                  onClick={() => setIsFree(true)}
                  className={twMerge(
                    "px-3.5 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer",
                    isFree ? "bg-emerald-600 text-white shadow-2xs" : "text-gray-600 hover:text-gray-900"
                  )}
                >
                  🎁 Miễn Phí
                </button>
              </div>
            </div>

            {!isFree && (
              <div className="pt-4 border-t border-gray-100 flex flex-col gap-4 animate-fadeIn">
                <div>
                  <label htmlFor="course-price-input" className="block text-xs font-black text-gray-700 uppercase tracking-wider mb-1.5">
                    Giá Bán Nêm Yết ($10.00 – $500.00 USD)
                  </label>
                  <div className="relative rounded-xl shadow-2xs">
                    <span className="absolute left-3.5 top-3 text-base font-extrabold text-gray-400">$</span>
                    <input
                      id="course-price-input"
                      type="number"
                      min={10}
                      max={500}
                      value={basePrice}
                      onChange={(e) => setBasePrice(e.target.value)}
                      className={twMerge(
                        "w-full pl-8 pr-12 py-3 rounded-xl font-black font-mono text-sm border transition-all focus:outline-none",
                        validationError
                          ? "border-rose-300 text-rose-600 bg-rose-50/20"
                          : "border-gray-200 bg-gray-50/50 text-gray-900 focus:border-[#4F46E5] focus:bg-white"
                      )}
                      placeholder="50.00"
                    />
                    <span className="absolute right-3.5 top-3 text-xs font-extrabold text-gray-500">USD</span>
                  </div>
                </div>

                {validationError && (
                  <p className="text-xs font-bold text-rose-600 bg-rose-50 p-3 rounded-xl border border-rose-200 flex items-center gap-2">
                    ⚠️ {validationError}
                  </p>
                )}

                <div className="flex flex-col gap-2 pt-1">
                  <label className="text-xs font-black text-gray-700 uppercase tracking-wider">Cấp Độ Hợp Tác Giảng Viên:</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setTier("standard")}
                      className={twMerge(
                        "p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        tier === "standard"
                          ? "border-[#4F46E5] bg-indigo-50/50 shadow-2xs"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs font-extrabold text-gray-900">Đối Tác Tiêu Chuẩn</p>
                      <p className="text-[11px] text-indigo-700 font-bold mt-0.5">30% phí hệ thống (Nhận 70%)</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setTier("exclusive")}
                      className={twMerge(
                        "p-3.5 rounded-xl border text-left transition-all cursor-pointer",
                        tier === "exclusive"
                          ? "border-emerald-500 bg-emerald-50/50 shadow-2xs"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      )}
                    >
                      <p className="text-xs font-extrabold text-gray-900">⭐ Hợp Tác Độc Quyền MindNova</p>
                      <p className="text-[11px] text-emerald-700 font-bold mt-0.5">Ưu đãi chỉ 15% phí (Nhận 85%)</p>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Promotional Discount Scheduler */}
          {!isFree && (
            <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-black text-gray-900">⚡ Lên Lịch Giảm Giá &amp; Khuyến Mãi Flash Sale</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Tăng tỷ lệ chuyển đổi học viên bằng các đợt giảm giá ngắn hạn hấp dẫn.</p>
                </div>
                <input
                  type="checkbox"
                  checked={discount.isEnabled}
                  onChange={(e) => toggleDiscount(e.target.checked)}
                  className="w-5 h-5 rounded-md text-[#4F46E5] focus:ring-[#4F46E5] border-gray-300 cursor-pointer"
                  aria-label="Kích hoạt giảm giá"
                />
              </div>

              {discount.isEnabled && (
                <div className="pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-3 gap-3 animate-fadeIn">
                  <div>
                    <label htmlFor="discount-price-input" className="block text-xs font-bold text-gray-700 uppercase mb-1">Giá Khuyến Mãi ($)</label>
                    <input
                      id="discount-price-input"
                      type="number"
                      min={10}
                      max={basePrice}
                      value={discount.discountPrice}
                      onChange={(e) => updateDiscount("discountPrice", parseFloat(e.target.value) || 10)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-black font-mono text-xs text-emerald-600 focus:outline-none focus:border-emerald-500 bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="discount-start-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày Bắt Đầu</label>
                    <input
                      id="discount-start-date"
                      type="date"
                      value={discount.startDate}
                      onChange={(e) => updateDiscount("startDate", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 focus:outline-none bg-gray-50/50"
                    />
                  </div>
                  <div>
                    <label htmlFor="discount-end-date" className="block text-xs font-bold text-gray-700 uppercase mb-1">Ngày Kết Thúc (7 ngày)</label>
                    <input
                      id="discount-end-date"
                      type="date"
                      value={discount.endDate}
                      onChange={(e) => updateDiscount("endDate", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-gray-200 font-bold text-xs text-gray-700 focus:outline-none bg-gray-50/50"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Dynamic Revenue Calculator & Preview */}
        <div className="lg:col-span-5 flex flex-col gap-5 sticky top-20">
          
          {/* Dynamic Revenue Calculator Panel */}
          <div className="p-6 rounded-2xl bg-[#4F46E5] text-white border border-indigo-400 shadow-sm flex flex-col gap-5">
            <div className="flex items-center gap-3 border-b border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white font-black text-xl border border-white/20 shrink-0">
                💵
              </div>
              <div>
                <h4 className="text-sm font-black text-white">Bảng Dự Toán Doanh Thu AI</h4>
                <p className="text-xs text-indigo-100 mt-0.5">Phân tích dòng tiền lợi nhuận sau chiết khấu</p>
              </div>
            </div>

            <div className="flex flex-col gap-3 font-mono text-xs">
              <div className="flex items-center justify-between text-indigo-100">
                <span>Giá Bán Nêm Yết (Active):</span>
                <span className="font-extrabold text-white text-sm">${revenue.listPrice.toFixed(2)} USD</span>
              </div>
              {!isFree && (
                <div className="flex items-center justify-between text-rose-200">
                  <span>Phí Hạ Tầng Nền Tang ({revenue.commissionRate}%):</span>
                  <span>-${revenue.platformFee.toFixed(2)} USD</span>
                </div>
              )}
              <div className="h-px bg-white/10 w-full my-0.5" />
              <div className="flex items-center justify-between text-indigo-100">
                <span>Tỷ lệ phân chia Giảng viên (PRO Tier):</span>
                <span className="font-extrabold text-white text-sm">80.0%</span>
              </div>
              <div className="flex items-center justify-between text-sm font-black text-emerald-300">
                <span>Thu Nháp Ròng Tích Lũy:</span>
                <span>${revenue.instructorEarnings.toFixed(2)} USD / học viên</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/10 border border-white/20 text-xs font-bold leading-relaxed text-white">
              💡 {revenue.earningsText}
            </div>
          </div>

          {/* Quick Preview Badge & Save Action */}
          <div className="p-5 rounded-2xl bg-white border border-gray-200 shadow-2xs flex flex-col gap-4">
            <h5 className="text-xs font-black text-gray-900 uppercase tracking-wider">Danh Sách Tiêu Chuẩn Phê Duyệt</h5>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-700">
                <span>✓ Giá niêm yết tuân thủ khung tiêu chuẩn $10–$500 USD</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-extrabold text-indigo-700">
                <span>✓ Lịch trình khuyến mãi được đồng bộ hóa thời gian AI</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                if (onSaveConfig) onSaveConfig();
                else alert("Cấu hình chiến lược định giá đã được lưu!");
              }}
              className="w-full py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-2xs transition-all cursor-pointer uppercase tracking-wider mt-1"
            >
              Lưu Thiết Lập Giá ➔
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

# 3. Cài đặt nâng cao (EditCourseContainer.tsx)
**File path:** `src/features/instructor/create-course/components/EditCourseContainer.tsx`

> Đây là thành phần gốc quản lý trang "Chỉnh sửa khóa học". Hiện tại trong mã nguồn, phần cài đặt nâng cao và trạng thái khóa học, khu vực nguy hiểm được code tĩnh trực tiếp tại file này chứ chưa tách tab riêng.

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useInstructorCourse } from "../../management/api/courses";
import { useUpdateCourse, useUploadCourseThumbnail, useDeleteCourse, useUpdateCourseStatus } from "../api";
import { Step1BasicInfo } from "./Step1BasicInfo";
import type { CourseBasicInfo, DifficultyLevel } from "../types";
import {
  SaveIcon,
  EyeIcon,
  TrashIcon,
  ArrowLeftIcon,
  CheckIcon,
} from "./icons";

import { COURSE_FIELDS } from "../constants";

export function EditCourseContainer({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { data: course, isLoading } = useInstructorCourse(courseId);
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutateAsync: uploadThumbnail, isPending: isUploading } = useUploadCourseThumbnail();
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatus();

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [basicInfo, setBasicInfo] = useState<CourseBasicInfo>({
    title: "",
    description: "",
    field: "",
    difficulty: "beginner",
    thumbnailFile: null,
    thumbnailPreview: null,
  });

  const handleBasicInfoChange = <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
    setBasicInfo(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    if (course) {
      setBasicInfo(prev => ({
        ...prev,
        title: course.title,
        description: course.description || "",
        field: course.category_id ? COURSE_FIELDS[Number(course.category_id) - 1] || "" : "",
        difficulty: (course.level as DifficultyLevel) || "beginner",
        thumbnailPreview: course.thumbnail || null,
      }));
    }
  }, [course]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500 font-medium">Đang tải dữ liệu...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-rose-500 font-bold">Không tìm thấy khóa học</div>;
  }

  const handleSave = async () => {
    try {
      const categoryId = Math.max(1, COURSE_FIELDS.indexOf(basicInfo.field as any) + 1);
      
      await updateCourse({
        courseId,
        payload: {
          title: basicInfo.title,
          description: basicInfo.description,
          level: basicInfo.difficulty,
          category_id: categoryId,
        },
      });

      if (basicInfo.thumbnailFile) {
        await uploadThumbnail({ courseId, file: basicInfo.thumbnailFile });
      }

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi lưu thông tin");
    }
  };

  const handleDelete = async () => {
    if (confirm("Bạn có chắc chắn muốn xóa khóa học này? Toàn bộ module, bài học và dữ liệu liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác!")) {
      try {
        await deleteCourse(courseId);
        alert("Đã xóa khóa học thành công!");
        router.push("/instructor/courses");
      } catch (error: any) {
        console.error(error);
        alert(error?.response?.data?.message || "Lỗi khi xóa khóa học");
      }
    }
  };

  const handleToggleStatus = async () => {
    const newStatus = course.status === "published" ? "draft" : "published";
    try {
      await updateStatus({ courseId, status: newStatus });
      alert(`Đã chuyển trạng thái khóa học sang ${newStatus === "published" ? "Công khai (Published)" : "Bản nháp (Draft)"}`);
    } catch (error) {
      alert("Cập nhật trạng thái thất bại!");
    }
  };

  const isPending = isUpdating || isUploading || isDeleting || isUpdatingStatus;

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex flex-col font-sans pb-16">
      {/* ── Header Bar ──────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link
                href="/instructor/courses"
                className="w-10 h-10 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center transition-colors shadow-2xs"
                title="Quay lại danh sách khóa học"
              >
                <ArrowLeftIcon size={18} />
              </Link>
              <div>
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-500 mb-0.5 font-semibold">
                  <Link href="/instructor/courses" className="hover:text-[#4F46E5] transition-colors">
                    Khóa học của tôi
                  </Link>
                  <span>/</span>
                  <span className="text-[#4F46E5] font-extrabold">
                    Chỉnh sửa khóa học #{courseId}
                  </span>
                </nav>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-md md:max-w-xl">
                    {basicInfo.title || course.title}
                  </h1>
                  <span
                    className={twMerge(
                      "px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase border",
                      course.status === "published"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                    )}
                  >
                    {course.status === "published" ? "Published" : "Draft Mode"}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href={`/courses/${courseId}`}
                target="_blank"
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-gray-700 bg-gray-50 border border-gray-200 hover:bg-white hover:border-[#4F46E5] transition-all shadow-2xs"
              >
                <EyeIcon size={14} />
                <span className="hidden sm:inline">Xem trước</span>
              </Link>

              <button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className={twMerge(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-sm cursor-pointer",
                  saveSuccess
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95 disabled:bg-gray-400"
                )}
              >
                {isUpdating || isUploading ? (
                  <span>⏳ Đang lưu...</span>
                ) : saveSuccess ? (
                  <>
                    <CheckIcon size={14} />
                    <span>Đã lưu thay đổi</span>
                  </>
                ) : (
                  <>
                    <SaveIcon size={14} />
                    <span>Lưu & Cập nhật</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Studio Workspace Content ────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          <Step1BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-6 w-full animate-fadeIn mt-4">
          <div>
            <h2 className="text-base font-black text-gray-900">Cấu hình & Quản lý</h2>
            <p className="text-xs text-gray-500 mt-0.5">Quản lý trạng thái khóa học và cài đặt nâng cao.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50 gap-4">
            <div>
              <span className="block text-sm font-bold text-gray-900">Trạng thái khóa học</span>
              <span className="text-[12px] text-gray-500 mt-1 block">
                Chuyển khóa học sang trạng thái <strong>{course.status === "published" ? "Bản nháp" : "Công khai"}</strong>. Khóa học dạng nháp sẽ không hiển thị trên cửa hàng.
              </span>
            </div>
            <button
              type="button"
              onClick={handleToggleStatus}
              disabled={isPending}
              className={twMerge(
                "px-5 py-2.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer disabled:opacity-50",
                course.status === "published"
                  ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                  : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
              )}
            >
              {isUpdatingStatus ? "Đang xử lý..." : course.status === "published" ? "Chuyển về Nháp" : "Công khai khóa học"}
            </button>
          </div>

          <div className="mt-4 pt-6 border-t border-rose-100 flex flex-col gap-4">
            <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <TrashIcon size={14} />
              <span>Khu Vực Nguy Hiểm (Danger Zone)</span>
            </h3>
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="block text-xs font-bold text-rose-950">Xóa vĩnh viễn khóa học này</span>
                <span className="text-[11px] text-rose-800 block mt-1">
                  Hành động này sẽ xóa vĩnh viễn khóa học cùng toàn bộ module và bài học liên quan. Không thể khôi phục!
                </span>
                {course.status === "published" && (
                  <span className="block mt-1 text-[11px] font-black text-rose-900">
                    * Vui lòng chuyển khóa học về trạng thái Nháp để có thể xóa.
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || course.status === "published"}
                className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 cursor-pointer disabled:bg-rose-300 disabled:cursor-not-allowed"
              >
                {isDeleting ? "Đang xóa..." : "Xóa bài giảng"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
```
# 4. Thanh điều hướng Tabs và Header cập nhật

Dưới đây là phần code cho khu vực Header và thanh Tab điều hướng (Tabs navigation) được bóc tách và tinh chỉnh chính xác theo ảnh thiết kế bạn gửi.

### 4.1 Component `CourseEditTabs.tsx` (Thanh điều hướng)

```tsx
"use client";

import React from "react";
import { twMerge } from "tailwind-merge";
import { FileEditIcon, BookOpenIcon, TagIcon, SettingsIcon } from "./icons"; // Cần import hoặc tạo icon tương ứng

export type EditCourseTab = "overview" | "curriculum" | "pricing" | "advanced";

interface CourseEditTabsProps {
  activeTab: EditCourseTab;
  onChangeTab: (tab: EditCourseTab) => void;
}

export function CourseEditTabs({ activeTab, onChangeTab }: CourseEditTabsProps) {
  const tabs = [
    {
      id: "overview",
      label: "Thông tin tổng quan & SEO",
      icon: <FileEditIcon size={16} />,
    },
    {
      id: "curriculum",
      label: "Chương trình & Nội dung AI",
      icon: <BookOpenIcon size={16} />,
    },
    {
      id: "pricing",
      label: "Giá bán & Khuyến mãi",
      icon: <TagIcon size={16} />,
    },
    {
      id: "advanced",
      label: "Cài đặt nâng cao",
      icon: <SettingsIcon size={16} />,
    },
  ] as const;

  return (
    <div className="w-full bg-gray-50/80 border border-gray-100 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto hide-scrollbar shadow-sm mb-6 mt-4">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => onChangeTab(tab.id as EditCourseTab)}
            className={twMerge(
              "flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap",
              isActive
                ? "bg-[#4F46E5] text-white shadow-2xs"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100/80"
            )}
          >
            <span className={twMerge(isActive ? "text-white" : "text-gray-500")}>
              {tab.icon}
            </span>
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
```

### 4.2 Cấu trúc Header cập nhật (áp dụng vào `EditCourseContainer.tsx`)

Dưới đây là phần code layout để ráp thanh Tabs cùng phần Header (có nút "Xem trước", "Lưu & Cập nhật") sao cho khớp hoàn toàn với ảnh.

```tsx
"use client";

import { useState } from "react";
// import các UI icons, API hooks, Tabs component và các sub-components (Step1, Step3...)

export function EditCourseContainer({ courseId }: { courseId: string }) {
  const [activeTab, setActiveTab] = useState<EditCourseTab>("overview");
  
  // ... (Khai báo state, useEffect, handler lưu dữ liệu tương tự code gốc)

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex flex-col font-sans pb-16">
      {/* ── HEADER CẬP NHẬT ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 py-4 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* Left Header - Breadcrumb & Title */}
            <div className="flex items-center gap-3">
              <Link
                href="/instructor/courses"
                className="w-10 h-10 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 flex items-center justify-center transition-colors shadow-2xs border border-gray-100"
              >
                <ArrowLeftIcon size={18} />
              </Link>
              <div>
                <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-gray-500 mb-0.5">
                  <Link href="/instructor/courses" className="hover:text-gray-800 transition-colors">
                    Khóa học của tôi
                  </Link>
                  <span>/</span>
                  <span className="text-[#4F46E5]">
                    Chỉnh sửa khóa học #{courseId}
                  </span>
                </nav>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-md md:max-w-2xl">
                    {basicInfo.title || "Tên khóa học"}
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black tracking-wider uppercase border bg-emerald-50 text-emerald-600 border-emerald-200">
                    PUBLISHED
                  </span>
                </div>
              </div>
            </div>

            {/* Right Header - Buttons */}
            <div className="flex items-center gap-2.5">
              <Link
                href={`/courses/${courseId}`}
                target="_blank"
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all shadow-2xs"
              >
                <EyeIcon size={14} />
                <span className="hidden sm:inline">Xem trước</span>
              </Link>

              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#4F46E5] hover:bg-[#4338CA] transition-all shadow-sm cursor-pointer"
              >
                <SaveIcon size={14} />
                <span>Lưu & Cập nhật</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* ── THÂN TRANG & HIỂN THỊ THEO TAB ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 flex flex-col">
        
        {/* Render Thanh Tabs */}
        <CourseEditTabs activeTab={activeTab} onChangeTab={setActiveTab} />

        {/* Nội dung render tương ứng với tab được chọn */}
        <div className="mt-2">
          {activeTab === "overview" && (
            <Step1BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />
          )}

          {activeTab === "curriculum" && (
            <div className="p-8 text-center text-gray-500 font-bold bg-white rounded-2xl border border-gray-200 shadow-2xs">
              Đang phát triển chương trình & AI
            </div>
          )}

          {activeTab === "pricing" && (
            <Step3SettingsPrice 
              courseTitle={basicInfo.title} 
              thumbnailPreview={basicInfo.thumbnailPreview} 
            />
          )}

          {activeTab === "advanced" && (
             <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-6">
                {/* Đưa phần Cài đặt nâng cao và Danger Zone vào đây */}
                <h2 className="text-base font-black text-gray-900">Cấu hình Quyền học tập</h2>
                {/* ... */}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}
```
