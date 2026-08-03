"use client";

// ─── CreateCourseContainer ─────────────────────────────────────────────────────
// Root client component that manages the multi-step form.
// All data is stored in Zustand store (draft) — NO API calls until "Hoàn tất & Đăng".

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2CourseStructure } from "./Step2CourseStructure";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { AIOutlineModal } from "./AIOutlineModal";
import { ArrowRightIcon, SaveIcon, BookOpenIcon, SparklesIcon } from "./icons";
import type { CourseBasicInfo, StepKey } from "../types";
import type { GeneratedOutline } from "./AIOutlineModal";
import { useCreateCourse, useUploadCourseThumbnail, useUpdateCoursePrice, useUpdateCourseStatus } from "../api";
import { useCreateModule, useCreateLesson, useUpdateLesson, useCreateQuiz } from "../../lesson-management/api";
import { useCreateCourseStore } from "../stores/createCourseStore";

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
        <span className="text-[12px]">Dữ liệu được lưu tạm tự động</span>
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
        <span>Dữ liệu được lưu tạm tự động</span>
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

export function CreateCourseContainer() {
  // ── Zustand store ─────────────────────────────────────────────────────────────
  const step = useCreateCourseStore((s) => s.step);
  const courseInfo = useCreateCourseStore((s) => s.courseInfo);
  const modules = useCreateCourseStore((s) => s.modules);
  const settings = useCreateCourseStore((s) => s.settings);
  const setCourseInfo = useCreateCourseStore((s) => s.setCourseInfo);
  const setStep = useCreateCourseStore((s) => s.setStep);
  const goNext = useCreateCourseStore((s) => s.goNext);
  const goBack = useCreateCourseStore((s) => s.goBack);
  const resetDraft = useCreateCourseStore((s) => s.resetDraft);
  const hydrate = useCreateCourseStore((s) => s.hydrate);

  // ── AI Outline Modal ──────────────────────────────────────────────────────────
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);

  // ── Publishing state ──────────────────────────────────────────────────────────
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [step2Error, setStep2Error] = useState<string | null>(null);

  // ── API mutations (only used at final publish) ────────────────────────────────
  const { mutateAsync: createCourse } = useCreateCourse();
  const { mutateAsync: uploadThumbnail } = useUploadCourseThumbnail();
  const { mutateAsync: updatePrice } = useUpdateCoursePrice();
  const { mutateAsync: updateStatus } = useUpdateCourseStatus();
  const { mutateAsync: createModule } = useCreateModule();
  const { mutateAsync: createLesson } = useCreateLesson();
  const { mutateAsync: createQuiz } = useCreateQuiz();

  // ── Hydrate on mount ──────────────────────────────────────────────────────────
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // ── AI outline handler ────────────────────────────────────────────────────────
  const handleApplyOutline = useCallback((_outline: GeneratedOutline) => {
    // In production: convert outline chapters → modules and merge into form
    setIsOutlineOpen(false);
  }, []);

  // ── Course info change handler ────────────────────────────────────────────────
  const handleChange = useCallback(
    <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
      setCourseInfo(key, value);
    },
    [setCourseInfo],
  );

  // ── Step validation & navigation ──────────────────────────────────────────────
  const handleNext = useCallback(() => {
    if (step === 1) {
      if (!courseInfo.title.trim()) {
        alert("Vui lòng nhập tên khóa học.");
        return;
      }
      if (!courseInfo.thumbnailFile) {
        alert("Vui lòng tải lên ảnh bìa khóa học.");
        return;
      }
    }
    if (step === 2) {
      let isValid = true;
      let errorMessage = "";
      
      if (modules.length === 0) {
        isValid = false;
        errorMessage = "Vui lòng thêm ít nhất một chương học.";
      } else {
        for (const mod of modules) {
          if (mod.lessons.length === 0) {
            isValid = false;
            errorMessage = `Chương "${mod.title}" chưa có bài học nào.`;
            break;
          }
          for (const lesson of mod.lessons) {
            if (lesson.type === "quiz") {
              if (!lesson.quizData || !lesson.quizData.questions || lesson.quizData.questions.length === 0) {
                isValid = false;
                errorMessage = `Bài kiểm tra "${lesson.title}" chưa có câu hỏi nào.`;
                break;
              }
              for (const q of lesson.quizData.questions) {
                if (!q.content?.trim()) {
                  isValid = false;
                  errorMessage = `Có câu hỏi bị để trống nội dung trong bài kiểm tra "${lesson.title}".`;
                  break;
                }
                if (!q.answers || q.answers.length < 2) {
                  isValid = false;
                  errorMessage = `Câu hỏi trong bài "${lesson.title}" phải có ít nhất 2 đáp án.`;
                  break;
                }
                const hasCorrect = q.answers.some(ans => ans.is_correct);
                if (!hasCorrect) {
                  isValid = false;
                  errorMessage = `Câu hỏi trong bài "${lesson.title}" chưa chọn đáp án đúng.`;
                  break;
                }
                const hasEmptyOption = q.answers.some(ans => !ans.content?.trim());
                if (hasEmptyOption) {
                  isValid = false;
                  errorMessage = `Không được để trống câu trả lời trong bài "${lesson.title}".`;
                  break;
                }
              }
            } else {
              if (!lesson.content?.trim() && !lesson.temp_media_ids?.length) {
                isValid = false;
                errorMessage = `Bài học "${lesson.title}" chưa có nội dung hoặc video.`;
                break;
              }
            }
            if (!isValid) break;
          }
          if (!isValid) break;
        }
      }
      
      if (!isValid) {
        setStep2Error(errorMessage);
        return;
      }
      setStep2Error(null);
    }
    // Step 1, 2: Just move to next step. NO API calls.
    if (step < 3) {
      goNext();
    }
  }, [step, courseInfo, modules, goNext]);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  // ── Final publish (Step 3 only) ───────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    setPublishError(null);
    setIsPublishing(true);

    try {
      // 1. Create Course
      if (!courseInfo.thumbnailFile) {
        throw new Error("Vui lòng tải lên ảnh bìa khóa học.");
      }

      const courseData = await createCourse({
        title: courseInfo.title,
        description: courseInfo.description,
        level: courseInfo.difficulty,
        category_id: 1, // TODO: Map from courseInfo.field when backend supports it
        thumbnail: courseInfo.thumbnailFile,
      });

      const courseId = courseData.id;

      // 3. Create modules and lessons
      for (const mod of modules) {
        const createdModule = await createModule({
          courseId,
          title: mod.title,
          order: mod.order,
        });

        const moduleId = createdModule.id;

        // Create lessons
        for (const lesson of mod.lessons) {
          let finalContent = lesson.content || "";

          // Strip large poster data URLs from content to prevent DB bloat
          finalContent = finalContent.replace(/poster="data:image\/[^"]+"/g, 'poster=""');

          // Create the lesson first
          const payloadType = lesson.type === 'quiz' ? 'quiz_module' : (lesson.type === 'document' ? 'article' : lesson.type);
          const createdLesson = await createLesson({
            courseId,
            moduleId,
            payload: {
              title: lesson.title,
              type: payloadType,
              content: finalContent,
              order: lesson.order,
              status: 'published',
              temp_media_ids: lesson.temp_media_ids,
              video_url: lesson.video_url
            }
          });

          const lessonId = createdLesson.id;

          // Handle quiz data
          if (lesson.type === 'quiz' && lesson.quizData) {
            await createQuiz({ lessonId, payload: lesson.quizData });
          }
        }
      }

      // 4. Update price
      const priceNum = Number(settings.basePrice.replace(/[^0-9]/g, ""));
      await updatePrice({ courseId, price: priceNum });

      // 5. Publish
      if (!settings.isDraft) {
        await updateStatus({ courseId, status: "published" });
      }

      // 6. Success — clean up draft and redirect
      resetDraft();
      alert("🎉 Xuất bản khóa học thành công!");
      window.location.href = "/instructor/courses";
    } catch (error: any) {
      console.error("Publish failed:", error);
      
      let errorMsg = "Có lỗi xảy ra khi xuất bản. Vui lòng thử lại.";
      if (error.response?.data) {
        const data = error.response.data;
        if (data.message) {
          errorMsg = `Lỗi: ${data.message}`;
        }
        if (data.errors) {
          errorMsg += ` - Chi tiết: ${JSON.stringify(data.errors)}`;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setPublishError(errorMsg);
    } finally {
      setIsPublishing(false);
    }
  }, [
    courseInfo,
    modules,
    settings,
    createCourse,
    uploadThumbnail,
    createModule,
    updatePrice,
    updateStatus,
    resetDraft,
    createLesson,
    createQuiz,
  ]);

  // ── Step labels ───────────────────────────────────────────────────────────────
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
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-[#9090B0]">
            <Link href="/instructor/courses" className="hover:text-[#4648D4] transition-colors">
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
              {/* Back button */}
              {step > 1 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#464554] border border-[#DDDDF0] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
                >
                  ← Quay lại
                </button>
              )}

              {/* Save draft */}
              <button
                type="button"
                id="btn-save-draft"
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-[#464554] border border-[#DDDDF0] bg-white hover:bg-[#F4F4FA] hover:border-[#C5C6FF] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#EAEAF4]"
              >
                Lưu nháp
              </button>

              {/* Finish & Publish (only functional at Step 3) */}
              <button
                id="btn-finish-publish"
                type="button"
                onClick={step === 3 ? handlePublish : handleNext}
                disabled={isPublishing}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] shadow-[0_4px_14px_rgba(70,72,212,0.35)] hover:shadow-[0_6px_20px_rgba(70,72,212,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#4648D4]/40 disabled:opacity-70"
              >
                {step === 3 ? (
                  <>
                    <SparklesIcon size={13} />
                    {isPublishing ? "Đang xử lý..." : "Hoàn tất & Đăng"}
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
          {/* Publish error banner */}
          {publishError && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
              <span>{publishError}</span>
              <button
                type="button"
                onClick={() => setPublishError(null)}
                className="text-red-500 hover:text-red-700 ml-3"
              >
                ✕
              </button>
            </div>
          )}

          <div className={step === 3 ? "flex flex-col gap-0" : "bg-white rounded-2xl border border-[#EAEAF4] shadow-[0_2px_20px_rgba(70,72,212,0.06)] p-6 flex flex-col gap-6"}>
            {/* Step content */}
            {step === 1 && (
              <Step1BasicInfo data={courseInfo} onChange={handleChange} />
            )}

            {step === 2 && (
              <Step2CourseStructure error={step2Error} />
            )}

            {step === 3 && (
              <Step3SettingsPrice
                courseTitle={courseInfo.title}
                thumbnailPreview={courseInfo.thumbnailPreview}
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