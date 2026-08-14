"use client";

import { useEffect, useCallback, useState } from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { StepIndicator } from "./StepIndicator";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2CourseStructure } from "./Step2CourseStructure";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { AIOutlineModal } from "./AIOutlineModal";
import type { CourseBasicInfo, StepKey } from "../types";
import { useCreateCourse, useUploadCourseThumbnail, useUpdateCoursePrice, useUpdateCourseStatus } from "../api";
import { useCreateModule, useCreateLesson, useCreateQuiz } from "../../lesson-management/api";
import { useCreateCourseStore } from "../stores/createCourseStore";
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
import { COURSE_FIELDS } from "../constants";

export function CreateCourseContainer() {
  const mode = "create"; // Currently creating course
  
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

  // ── Modals & State ────────────────────────────────────────────────────────────
  const [isOutlineOpen, setIsOutlineOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);

  // ── API mutations ─────────────────────────────────────────────────────────────
  const { mutateAsync: createCourse } = useCreateCourse();
  const { mutateAsync: uploadThumbnail } = useUploadCourseThumbnail();
  const { mutateAsync: updatePrice } = useUpdateCoursePrice();
  const { mutateAsync: updateStatus } = useUpdateCourseStatus();
  const { mutateAsync: createModule } = useCreateModule();
  const { mutateAsync: createLesson } = useCreateLesson();
  const { mutateAsync: createQuiz } = useCreateQuiz();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const handleChange = useCallback(
    <K extends keyof CourseBasicInfo>(key: K, value: CourseBasicInfo[K]) => {
      setCourseInfo(key, value);
    },
    [setCourseInfo],
  );

  const handleApplyOutline = useCallback((outline: any) => {
    const uid = () => Math.random().toString(36).slice(2, 9);
    if (outline && outline.chapters && Array.isArray(outline.chapters)) {
      const newModules = outline.chapters.map((ch: any, cIdx: number) => ({
        id: uid(),
        title: ch.title,
        description: "",
        order: cIdx + 1,
        expanded: true,
        showAiSuggestion: false,
        lessons: ch.lessons.map((lesson: any, lIdx: number) => {
          const lessonTitle = typeof lesson === "string" ? lesson : lesson.title;
          const lessonType = typeof lesson === "string" ? "document" : (lesson.type === "quiz" ? "quiz" : "document");

          const draftLesson: any = {
            id: uid(),
            title: lessonTitle,
            type: lessonType as "video" | "quiz" | "document",
            order: lIdx + 1,
          };

          // Gắn nội dung HTML cho bài tài liệu
          if (lessonType === "document" && typeof lesson === "object" && lesson.content) {
            draftLesson.content = lesson.content;
          }

          // Gắn câu hỏi trắc nghiệm cho bài quiz
          if (lessonType === "quiz" && typeof lesson === "object" && Array.isArray(lesson.questions)) {
            draftLesson.quizData = {
              title: lessonTitle,
              time_limit_minutes: 15,
              passing_score: 80,
              questions: lesson.questions.map((q: any) => ({
                id: uid(),
                content: q.content,
                answers: (q.answers || []).map((a: any) => ({
                  id: uid(),
                  content: a.content,
                  is_correct: a.is_correct === true,
                })),
              })),
            };
          }

          return draftLesson;
        }),
      }));
      useCreateCourseStore.getState().setModules(newModules);
    }
    setIsOutlineOpen(false);
  }, []);

  const handleNext = useCallback(() => {
    if (step === 1) {
      if (!courseInfo.title.trim()) {
        alert("Vui lòng nhập tên khóa học.");
        return;
      }
      if (!courseInfo.thumbnailFile && !courseInfo.thumbnailPreview) {
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
        const hasAnyLesson = modules.some(m => m.lessons.length > 0);
        if (!hasAnyLesson) {
          isValid = false;
          errorMessage = "Vui lòng thêm ít nhất một bài học.";
        }
      }
      
      if (!isValid) {
        alert(errorMessage);
        return;
      }
    }
    if (step < 3) {
      goNext();
    }
  }, [step, courseInfo, modules, goNext]);

  const handleBack = useCallback(() => {
    goBack();
  }, [goBack]);

  const handlePublish = useCallback(async () => {
    setPublishError(null);
    setIsPublishing(true);

    try {
      if (!courseInfo.thumbnailFile && !courseInfo.thumbnailPreview) {
        throw new Error("Vui lòng tải lên ảnh bìa khóa học.");
      }

      const categoryId = Math.max(1, COURSE_FIELDS.indexOf(courseInfo.field as any) + 1);

      // We bypass upload if thumbnailFile is missing but preview exists (mock behavior or previously uploaded)
      // In production, we'd upload the file if it exists.
      const courseData = await createCourse({
        title: courseInfo.title,
        description: courseInfo.description,
        level: courseInfo.difficulty,
        category_id: categoryId, 
        thumbnail: courseInfo.thumbnailFile || new File(["mock"], "mock.png", { type: "image/png" }),
      });

      const courseId = courseData.id;

      for (const mod of modules) {
        const createdModule = await createModule({
          courseId,
          title: mod.title,
          order: mod.order,
        });

        const moduleId = createdModule.id;

        for (const lesson of mod.lessons) {
          // Content validation is removed as per new UI logic
          const payloadType = lesson.type === 'quiz' ? 'quiz_module' : (lesson.type === 'document' ? 'article' : lesson.type);
          await createLesson({
            courseId,
            moduleId,
            payload: {
              title: lesson.title,
              type: payloadType,
              content: lesson.content || "",
              order: lesson.order,
              status: 'published',
              temp_media_ids: lesson.temp_media_ids,
              video_url: lesson.video_url,
              quizData: lesson.quizData,
            }
          });
        }
      }

      const priceNum = Number(String(settings.basePrice).replace(/[^0-9]/g, ""));
      await updatePrice({ 
        courseId, 
        price: priceNum,
        is_flash_sale: priceNum === 0 ? false : settings.isFlashSale,
        sale_price: priceNum === 0 ? undefined : (settings.salePrice ? Number(String(settings.salePrice).replace(/[^0-9]/g, "")) : undefined),
        sale_start_date: priceNum === 0 ? undefined : settings.saleStartDate,
        sale_end_date: priceNum === 0 ? undefined : settings.saleEndDate
      });

      await updateStatus({ courseId, status: "draft" });

      resetDraft();
      alert("🎉 Tạo khóa học thành công!");
      window.location.href = "/instructor/courses";
    } catch (error: any) {
      console.error("Publish failed:", error);
      let errorMsg = "Có lỗi xảy ra khi tạo khóa học. Vui lòng thử lại.";
      if (error.response?.data?.message) {
        errorMsg = `Lỗi: ${error.response.data.message}`;
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
                    Studio Tạo Khóa Học AI
                  </span>
                </nav>
                <div className="flex items-center gap-2.5">
                  <h1 className="text-lg font-black text-gray-900 tracking-tight truncate max-w-md md:max-w-xl">
                    {createStepLabels[step as 1 | 2 | 3] || "Studio Khóa học"}
                  </h1>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5">

              <button
                type="button"
                id="btn-finish-publish"
                onClick={() => setIsOutlineOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer"
              >
                <SparklesIcon size={13} />
                <span>Sinh đề cương AI</span>
              </button>
            </div>
          </div>

          <StepIndicator currentStep={step} />
        </div>
      </header>

      {/* ── Studio Workspace Content ────────────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-8 flex flex-col gap-6">
        
        {publishError && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-medium flex items-center justify-between">
            <span>{publishError}</span>
            <button type="button" onClick={() => setPublishError(null)} className="text-red-500 hover:text-red-700 ml-3">✕</button>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-6">
            <Step1BasicInfo data={courseInfo} onChange={handleChange} />
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-6">


            <Step2CourseStructure />
          </div>
        )}

        {step === 3 && (
          <Step3SettingsPrice
            courseTitle={courseInfo.title || "Khóa học chưa đặt tên"}
            thumbnailPreview={courseInfo.thumbnailPreview}
          />
        )}

        {/* Wizard Navigation Footer */}
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
            onClick={step === 3 ? handlePublish : handleNext}
            disabled={isPublishing}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-extrabold text-white bg-[#4F46E5] hover:bg-[#4338CA] shadow-2xs transition-all cursor-pointer disabled:opacity-70"
          >
            {step === 3 ? (
              <>
                <SparklesIcon size={14} />
                <span>{isPublishing ? "Đang xử lý..." : "Hoàn tất & Tạo khóa học"}</span>
              </>
            ) : (
              <>
                <span>Tiếp theo</span>
                <ArrowRightIcon size={14} />
              </>
            )}
          </button>
        </div>
      </main>

      <AIOutlineModal
        isOpen={isOutlineOpen}
        onClose={() => setIsOutlineOpen(false)}
        onApply={handleApplyOutline}
      />
    </div>
  );
}
