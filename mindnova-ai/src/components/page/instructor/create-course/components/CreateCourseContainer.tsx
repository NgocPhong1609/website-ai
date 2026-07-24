"use client";

// ─── CreateCourseContainer ─────────────────────────────────────────────────────
// Root client component that manages the multi-step form state and composes
// all sub-components into the full create-course page.

import { useState, useCallback } from "react";
import Link from "next/link";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { AIOutlineModal } from "./AIOutlineModal";
import { ArrowRightIcon, SaveIcon, BookOpenIcon, SparklesIcon } from "./icons";
import type { CourseBasicInfo, StepKey } from "../types";
import type { GeneratedOutline } from "./AIOutlineModal";

// ─── Footer bar ───────────────────────────────────────────────────────────────

interface FormFooterProps {
  step: StepKey;
  onBack: () => void;
  onNext: () => void;
}

function FormFooter({ step, onBack, onNext }: FormFooterProps) {
  const isFirst = step === 1;

  return (
    <div className="flex items-center justify-between pt-1 mt-1 border-t border-[#F0F0F8]">
      {/* Left info */}
      <div className="flex items-center gap-1.5 text-[#9090B0]">
        <SaveIcon size={12} />
        <span className="text-[12px]">Tự động lưu lúc 10:45 AM</span>
      </div>

      {/* CTA row */}
      <div className="flex items-center gap-3">
        {isFirst ? (
          <Link
            href="/instructor"
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64647A] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
          >
            Hủy bỏ
          </Link>
        ) : (
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl text-sm font-medium text-[#64647A] border border-[#EAEAF4] bg-white hover:bg-[#F4F4FA] hover:text-[#1A1A2E] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
          >
            ← Quay lại
          </button>
        )}

        <button
          id="btn-next-step"
          type="button"
          onClick={onNext}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          {step === 3 ? (
            <>
              <SparklesIcon size={13} />
              Hoàn tất & Đăng
            </>
          ) : (
            <>
              Tiếp theo
              <ArrowRightIcon size={15} />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Footer bottom bar ────────────────────────────────────────────────────────

function PageFooter() {
  return (
    <div className="flex items-center justify-between text-[11px] text-[#B0B0C8]">
      <div className="flex items-center gap-1.5">
        <SaveIcon size={11} />
        <span>Tự động lưu lúc 10:45 AM</span>
      </div>
      <button
        type="button"
        className="flex items-center gap-1.5 hover:text-[#4648D4] transition-colors duration-150"
      >
        <BookOpenIcon size={11} />
        <span>Xem lại nguyên tắc tạo nội dung</span>
      </button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const INITIAL_DATA: CourseBasicInfo = {
  title: "",
  description: "",
  field: "",
  difficulty: "beginner",
  thumbnailFile: null,
  thumbnailPreview: null,
};

export function CreateCourseContainer() {
  const [step, setStep] = useState<StepKey>(1);
  const [formData, setFormData] = useState<CourseBasicInfo>(INITIAL_DATA);
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  const handleApplyOutline = useCallback((_outline: GeneratedOutline) => {
    // In production: convert outline chapters → CourseStructure and merge into form
    setIsOutlineOpen(false);
  }, []);

  const handleChange = useCallback(
    <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const handleNext = () => {
    if (step < 3) setStep((s) => (s + 1) as StepKey);
  };

  const handleBack = () => {
    if (step > 1) setStep((s) => (s - 1) as StepKey);
  };

  const stepLabels: Record<StepKey, string> = {
    1: "Thông tin cơ bản",
    2: "Nội dung bài học",
    3: "Cài đặt & Giá: Hoàn tất",
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#F8F8FD] flex flex-col">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="py-6 px-6 bg-white border-b border-[#F0F0F8]">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-1 text-[12px] text-[#9090B0]"
          >
            <Link
              href="/instructor/courses"
              className="hover:text-[#4648D4] transition-colors"
            >
              Khóa học của tôi
            </Link>
            <span className="mx-1">/</span>
            <span className="text-[#464554] font-medium">Tạo khóa học mới</span>
          </nav>

          {/* Title + CTA row */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <h1 className="text-[22px] font-extrabold text-[#1A1A2E] tracking-tight leading-snug">
              {stepLabels[step]}
            </h1>

            <div className="flex items-center gap-3 shrink-0">
              {/* Save draft */}
              <button
                type="button"
                id="btn-save-draft"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#464554] border border-[#DDDDF0] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
              >
                Lưu nháp
              </button>

              {/* Finish & Publish */}
              <button
                id="btn-finish-publish"
                type="button"
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
              >
                {step === 3 ? (
                  <>
                    <SparklesIcon size={13} />
                    Hoàn tất & Đăng
                  </>
                ) : (
                  <>
                    Tiếp theo
                    <ArrowRightIcon size={14} />
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────── */}
      <div className="flex-1 px-6 py-6">
        <div className="max-w-4xl mx-auto">
          <div
            className={
              step === 3
                ? "flex flex-col gap-0"
                : "bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_2px_20px_rgba(70,72,212,0.06)] p-6 flex flex-col gap-6"
            }
          >
            {/* Step content */}
            {step === 1 && (
              <Step1BasicInfo data={formData} onChange={handleChange} />
            )}

            {/* Step 2 — placeholder */}
            {step === 2 && (
              <div className="flex items-center justify-center min-h-[300px] text-[#B0B0C8] text-sm">
                Nội dung bài học sẽ hiển thị ở đây...
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <Step3SettingsPrice
                courseTitle={formData.title}
                thumbnailPreview={formData.thumbnailPreview}
              />
            )}

            {/* Form footer with CTA (hidden on step 3 — CTAs are in header) */}
            {step !== 3 && (
              <FormFooter step={step} onBack={handleBack} onNext={handleNext} />
            )}
          </div>

          {/* Page bottom bar */}
          <div className="mt-4 px-1">
            <PageFooter />
          </div>
        </div>
      </div>

      {/* ── AI Outline Modal ── */}
      <AIOutlineModal
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        onApply={handleApplyOutline}
      />
    </div>
  );
}
