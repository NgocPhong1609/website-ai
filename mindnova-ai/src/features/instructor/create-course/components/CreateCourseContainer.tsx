"use client";

// ─── CreateCourseContainer ─────────────────────────────────────────────────────
// Root client component that manages the multi-step form state and composes
// all sub-components into the full create-course page.

import { useState, useCallback } from "react";
import Link from "next/link";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { ArrowRightIcon, SaveIcon, BookOpenIcon, RobotIcon } from "./icons";
import type { CourseBasicInfo, StepKey } from "../types";

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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-[#4648D4] hover:bg-[#3D40C0] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40"
        >
          Tiếp theo
          <ArrowRightIcon size={15} />
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
    2: "Cấu trúc",
    3: "Cài đặt",
  };

  return (
    <div className="min-h-[calc(100vh-60px)] bg-[#F8F8FD] flex flex-col">
      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className="py-8 px-6">
        <div className="max-w-3xl mx-auto flex flex-col gap-6">
          {/* Title area */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-[#6B6BFF]">
              <span className="text-sm">
                <RobotIcon size={14} />
              </span>
              <Link
                href="/instructor/create-course"
                className="text-sm font-semibold hover:underline"
              >
                Tạo nội dung mới
              </Link>
            </div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-extrabold text-[#1A1A2E] tracking-tight">
                Thêm khóa học mới:{" "}
                <span className="text-[#4648D4]">{stepLabels[step]}</span>
              </h1>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF0FF] border border-[#D5D5FF]">
                <span className="text-[#6B6BFF]">
                  <RobotIcon size={12} />
                </span>
                <span className="text-[11px] text-[#6B6BFF] font-medium">
                  AI sẽ hỗ trợ bạn sinh nội dung ở các bước tiếp theo
                </span>
              </div>
            </div>
          </div>

          {/* Step indicator */}
          <StepIndicator currentStep={step} />
        </div>
      </div>

      {/* ── Form card ───────────────────────────────────────────────── */}
      <div className="flex-1 px-6 pb-8">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_2px_20px_rgba(70,72,212,0.06)] p-6 flex flex-col gap-6">
            {/* Step content */}
            {step === 1 && (
              <Step1BasicInfo data={formData} onChange={handleChange} />
            )}

            {/* Steps 2 & 3 — placeholder */}
            {step !== 1 && (
              <div className="flex items-center justify-center min-h-[300px] text-[#B0B0C8] text-sm">
                Nội dung bước {step} sẽ hiển thị ở đây...
              </div>
            )}

            {/* Form footer with CTA */}
            <FormFooter step={step} onBack={handleBack} onNext={handleNext} />
          </div>

          {/* Page bottom bar */}
          <div className="mt-4 px-1">
            <PageFooter />
          </div>
        </div>
      </div>
    </div>
  );
}
