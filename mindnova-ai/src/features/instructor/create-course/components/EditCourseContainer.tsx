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
