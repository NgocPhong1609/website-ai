"use client";

import React, { useState, useCallback } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2CourseStructure } from "./Step2CourseStructure";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { AIOutlineModal } from "./AIOutlineModal";
import type { CourseBasicInfo, StepKey } from "./types";
import {
  SparklesIcon,
  BookOpenIcon,
  TagIcon,
  SettingsIcon,
  CheckIcon,
  SaveIcon,
  EyeIcon,
  TrashIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
} from "./icons";

interface CourseStudioProps {
  mode: "create" | "edit";
  courseId?: string;
}

export function CourseStudio({ mode, courseId = "c1" }: CourseStudioProps) {
  const [step, setStep] = useState<StepKey | 4>(1); // 4 = Advanced settings in edit mode
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [status, setStatus] = useState<"published" | "draft">("published");

  const [formData, setFormData] = useState<CourseBasicInfo>({
    title: mode === "edit" ? "Mastering Next.js 16 & AI Integration Professional" : "",
    description:
      mode === "edit"
        ? "Khóa học chuyên sâu hướng dẫn từ A-Z kiến trúc Fullstack hiện đại cùng tích hợp LLM Agent vào thực nghiệm."
        : "",
    field: "Trí tuệ nhân tạo",
    difficulty: "beginner",
    thumbnailFile: null,
    thumbnailPreview: mode === "edit" ? "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop" : null,
    outline: [],
  });

  const handleChange = useCallback(
    <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleApplyOutline = (chapters: any[]) => {
    handleChange("outline", chapters);
  };

  const handleNext = () => {
    if (step < 3) setStep((s) => ((s as number) + 1) as StepKey);
    else alert("Khóa học đã được hoàn tất trên hệ thống MindNova AI!");
  };

  const handleBack = () => {
    if ((step as number) > 1) setStep((s) => ((s as number) - 1) as StepKey);
  };

  const handleSaveEdit = () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  const createStepLabels: Record<1 | 2 | 3, string> = {
    1: "Thông tin cơ bản",
    2: "Nội dung khóa học",
    3: "Cài đặt & Giá",
  };

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
                    {mode === "create" ? "Studio Tạo Khóa Học AI" : `Chỉnh sửa khóa học #${courseId}`}
                  </span>
                </nav>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-md md:max-w-xl">
                    {mode === "create" ? createStepLabels[step as 1 | 2 | 3] || "Studio Khóa học" : formData.title}
                  </h1>
                  {mode === "edit" && (
                    <span
                      className={twMerge(
                        "px-2.5 py-0.5 rounded-md text-[11px] font-extrabold tracking-wider uppercase border",
                        status === "published"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      )}
                    >
                      {status === "published" ? "Published" : "Draft Mode"}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              {mode === "edit" ? (
                <>
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
                    onClick={handleSaveEdit}
                    disabled={isSaving}
                    className={twMerge(
                      "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white transition-all shadow-sm cursor-pointer",
                      saveSuccess
                        ? "bg-emerald-600 hover:bg-emerald-700"
                        : "bg-[#4F46E5] hover:bg-[#4338CA] active:scale-95"
                    )}
                  >
                    {isSaving ? (
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
                </>
              ) : (
                <>
                  <button
                    type="button"
                    id="btn-save-draft"
                    onClick={() => alert("Đã lưu bản nháp của bạn!")}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 transition-all cursor-pointer shadow-2xs"
                  >
                    💾 Lưu nháp
                  </button>
                  <button
                    type="button"
                    id="btn-finish-publish"
                    onClick={() => setIsOutlineOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
                  >
                    <SparklesIcon size={13} />
                    <span>Sinh đề cương AI</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Navigation Bar / Steps Indicator */}
          {mode === "create" ? (
            <StepIndicator currentStep={step as StepKey} />
          ) : (
            <div className="flex items-center gap-1.5 p-1.5 bg-gray-50 rounded-2xl border border-gray-200 shadow-2xs overflow-x-auto">
              <button
                type="button"
                onClick={() => setStep(1)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 1
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <span>📝</span>
                <span>Thông tin tổng quan &amp; SEO</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(2)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 2
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <BookOpenIcon size={14} />
                <span>Chương trình & Nội dung AI</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(3)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 3
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <TagIcon size={14} />
                <span>Giá bán & Khuyến mãi</span>
              </button>

              <button
                type="button"
                onClick={() => setStep(4)}
                className={twMerge(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer whitespace-nowrap shrink-0",
                  step === 4
                    ? "bg-[#4F46E5] text-white shadow-sm"
                    : "text-gray-600 hover:bg-white hover:text-gray-900"
                )}
              >
                <SettingsIcon size={14} />
                <span>Cài đặt nâng cao</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* ── Studio Workspace Content ────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 flex flex-col gap-6">
        {step === 1 && (
          <div className="flex flex-col gap-6">
            <Step1BasicInfo data={formData} onChange={handleChange} />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-black text-gray-900">Trung tâm Điều hành Chương bài &amp; Video</h2>
                <p className="text-xs text-gray-500 mt-1">
                  Hệ thống hỗ trợ tải lên video hàng loạt (Bulk Uploader), chia chương linh hoạt và tích hợp đề kiểm tra trắc nghiệm sinh tự động từ AI.
                </p>
              </div>
              <Link
                href={`/instructor/courses/${courseId || "new"}/lessons`}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#4F46E5] hover:bg-[#4338CA] text-white font-extrabold text-xs shadow-2xs transition-all shrink-0 cursor-pointer"
              >
                <BookOpenIcon size={15} />
                <span>Mở Studio Quản Lý Bài Giảng &amp; Video ➔</span>
              </Link>
            </div>

            <Step2CourseStructure />
          </div>
        )}

        {step === 3 && (
          <Step3SettingsPrice
            courseTitle={formData.title || "Khóa học chưa đặt tên"}
            thumbnailPreview={formData.thumbnailPreview}
          />
        )}

        {step === 4 && mode === "edit" && (
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs flex flex-col gap-6 max-w-3xl mx-auto w-full animate-fadeIn">
            <div>
              <h2 className="text-base font-black text-gray-900">Cấu hình Quyền học tập</h2>
              <p className="text-xs text-gray-500 mt-0.5">Quản lý cấp chứng chỉ tự động và khóa bình luận diễn đàn.</p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div>
                <span className="block text-xs font-bold text-gray-900">🏆 Cấp Chứng Chỉ Tốt Nghiệp Tự Động (Blockchain ID)</span>
                <span className="text-[11px] text-gray-500">Tự động sinh mã chứng nhận khi học viên đạt trên 80% tiến độ bài giảng</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#4F46E5] rounded focus:ring-[#4F46E5] cursor-pointer" />
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-gray-50/50">
              <div>
                <span className="block text-xs font-bold text-gray-900">💬 Hòm thư thảo luận trực tiếp</span>
                <span className="text-[11px] text-gray-500">Cho phép học viên đặt câu hỏi Hỏi-Đáp bên dưới từng bài video</span>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 text-[#4F46E5] rounded focus:ring-[#4F46E5] cursor-pointer" />
            </div>

            <div className="mt-4 pt-6 border-t border-rose-100 flex flex-col gap-4">
              <h3 className="text-xs font-black uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
                <TrashIcon size={14} />
                <span>Khu Vực Nguy Hiểm (Danger Zone)</span>
              </h3>
              <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div>
                  <span className="block text-xs font-bold text-rose-950">Xóa vĩnh viễn khóa học này</span>
                  <span className="text-[11px] text-rose-800">Hành động này không thể hoàn tác. Toàn bộ video và dữ liệu bài giảng sẽ bị xóa.</span>
                </div>
                <button
                  type="button"
                  onClick={() => alert("Vui lòng liên hệ Admin hệ thống để thao tác hủy khóa học đang có học viên tham dự.")}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs shadow-xs transition-all shrink-0 cursor-pointer"
                >
                  Xóa bài giảng
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Create Mode Wizard Navigation Footer */}
        {mode === "create" && (
          <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between bg-white p-5 rounded-2xl shadow-2xs">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-xs font-bold text-gray-700 border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 disabled:pointer-events-none transition-all cursor-pointer shadow-2xs"
            >
              <span>← Quay lại</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
            >
              {step === 3 ? (
                <>
                  <SparklesIcon size={14} />
                  <span>Hoàn tất &amp; Đăng khóa học</span>
                </>
              ) : (
                <>
                  <span>Tiếp theo</span>
                  <ArrowRightIcon size={14} />
                </>
              )}
            </button>
          </div>
        )}
      </main>

      <AIOutlineModal
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        onApply={handleApplyOutline}
      />
    </div>
  );
}