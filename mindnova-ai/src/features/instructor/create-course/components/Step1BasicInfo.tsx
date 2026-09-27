"use client";

import React, { useCallback, useMemo, useState } from "react";
import { twMerge } from "tailwind-merge";
import { ThumbnailUploader } from "./ThumbnailUploader";
import {
 OTHER_CATEGORY_VALUE,
 MAX_TITLE_LENGTH,
 MAX_DESCRIPTION_LENGTH,
} from "../constants";
import { useInstructorCategories } from "../api";
import type { CourseBasicInfo, DifficultyLevel } from "../types";
import { ChevronDown } from "lucide-react";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

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
 isNearLimit ? "text-amber-600 font-bold" : "text-slate-400 font-medium",
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
 "px-4 py-2 rounded-lg text-sm font-medium border transition-all cursor-pointer",
 value === key
 ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm"
 : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
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
 const { data: categories = [], isLoading: categoriesLoading, isError: categoriesError, refetch: refetchCategories } = useInstructorCategories();
 const [search, setSearch] = useState("");
 const [open, setOpen] = useState(false);

 const filtered = useMemo(() => {
 const q = search.trim().toLowerCase();
 if (!q) return categories;
 return categories.filter((c) => c.name.toLowerCase().includes(q));
 }, [categories, search]);

 const selectedName =
 data.field === OTHER_CATEGORY_VALUE
 ? "Khác"
 : categories.find((c) => Number(c.id) === Number(data.categoryId))?.name
   ?? data.categoryName
   ?? "";

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

 return (
 <div className="flex flex-col gap-6 animate-fadeIn">
 <div className="flex items-center justify-between border-b border-slate-200 pb-4 bg-white p-5 rounded-lg shadow-sm">
 <div>
 <h2 className="text-base font-semibold text-slate-900">Thông tin cơ bản khóa học</h2>
 <p className="text-sm text-slate-500 mt-0.5">Cập nhật tiêu đề và mô tả chính hiển thị trên danh mục học viện MindNova.</p>
 </div>
 </div>



 <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-6">
 {/* Left column: Thumbnail + AI tip */}
 <div className="flex flex-col gap-4">
 <div>
 <label className="text-sm font-semibold text-slate-900">Ảnh bìa khóa học</label>
 <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
 Tải lên hình ảnh đại diện tỷ lệ 4:3 hấp dẫn để thu hút học viên trên sàn MindNova.
 </p>
 </div>

 <ThumbnailUploader
 preview={data.thumbnailPreview}
 onChange={handleThumbnail}
 onRemove={handleThumbnailRemove}
 />
 </div>

 {/* Right column: Text fields */}
 <div className="flex flex-col gap-5 bg-white p-6 rounded-lg border border-slate-200 shadow-sm">
 {/* Course title */}
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center justify-between">
 <label htmlFor="course-title" className="text-sm font-semibold text-slate-900">
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
 className="w-full px-4 py-2.5 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all shadow-sm"
 />
 </div>

 {/* Description */}
 <div className="flex flex-col gap-1.5">
 <div className="flex items-center justify-between">
 <label htmlFor="course-description" className="text-sm font-semibold text-slate-900">
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
 className="w-full px-4 py-3 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none leading-relaxed shadow-sm"
 />
 </div>

 {/* Field + Difficulty row */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start pt-1">
 {/* Field select */}
 <div className="flex flex-col gap-1.5">
 <label htmlFor="course-field" className="text-sm font-semibold text-slate-900">
 Lĩnh vực Chuyên môn
 </label>
 <div className="relative">
 <button
 id="course-field"
 type="button"
 onClick={() => setOpen((v) => !v)}
 className={`w-full appearance-none px-4 py-2.5 pr-10 rounded-lg text-sm bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer shadow-sm text-left ${
 !selectedName ? "text-slate-400" : "text-slate-900"
 }`}
 >
 {categoriesLoading ? <Skeleton className="h-4 w-40 my-0.5" aria-label="Đang tải danh mục" /> : selectedName || "-- Chọn lĩnh vực --"}
 </button>
 <div className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-slate-500">
 <ChevronDown size={14} />
 </div>
 {open && (
 <div className="absolute z-50 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
 <input
 autoFocus
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder="Tìm danh mục..."
 className="w-full border-b border-slate-200 px-3 py-2 text-xs text-slate-900 outline-none"
 />
 <ul className="max-h-56 overflow-y-auto py-1">
 {categoriesError && (
 <li className="px-3 py-2 text-xs text-rose-600">
 Không tải được danh mục.{" "}
 <button type="button" className="font-bold underline" onClick={() => void refetchCategories()}>
 Thử lại
 </button>
 </li>
 )}
 {filtered.map((c) => (
 <li key={c.id}>
 <button
 type="button"
 className="w-full px-3 py-2 text-left text-xs font-semibold text-slate-900 hover:bg-blue-50"
 onClick={() => {
 onChange("categoryId", Number(c.id));
 onChange("categoryName", c.name);
 onChange("field", String(c.id));
 onChange("otherName", "");
 setOpen(false);
 setSearch("");
 }}
 >
 {c.name}
 </button>
 </li>
 ))}
 {!categoriesError && filtered.length === 0 && (
 <li className="px-3 py-2 text-xs text-slate-500">Không tìm thấy danh mục</li>
 )}
 <li className="border-t border-slate-200">
 <button
 type="button"
 className="w-full px-3 py-2 text-left text-xs font-bold text-blue-500 hover:bg-blue-50"
 onClick={() => {
 onChange("categoryId", null);
 onChange("field", OTHER_CATEGORY_VALUE);
 setOpen(false);
 setSearch("");
 }}
 >
 Khác
 </button>
 </li>
 </ul>
 </div>
 )}
 </div>
 {data.field === OTHER_CATEGORY_VALUE && (
 <input
 value={data.otherName}
 onChange={(e) => onChange("otherName", e.target.value)}
 placeholder="Nhập lĩnh vực khác..."
 className="mt-2 w-full px-4 py-2.5 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 bg-white border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
 />
 )}
 </div>

 {/* Difficulty */}
 <div className="flex flex-col gap-1.5">
 <label className="text-sm font-semibold text-slate-900">Trình độ Khóa học</label>
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