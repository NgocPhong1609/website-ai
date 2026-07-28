"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useInstructorCourse } from "../../management/api/courses";
import { useUpdateCourse, useUploadCourseThumbnail, useDeleteCourse, useUpdateCourseStatus } from "../api";
import { ChevronRightIcon, SaveIcon } from "../../pricing/components/icons";
import { Step1BasicInfo } from "./Step1BasicInfo";
import type { CourseBasicInfo, DifficultyLevel } from "../types";

export function EditCourseContainer({ courseId }: { courseId: string }) {
  const router = useRouter();
  const { data: course, isLoading } = useInstructorCourse(courseId);
  const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();
  const { mutateAsync: uploadThumbnail, isPending: isUploading } = useUploadCourseThumbnail();
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatus();

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
        difficulty: (course.level as DifficultyLevel) || "beginner",
        thumbnailPreview: course.thumbnail || null,
      }));
    }
  }, [course]);

  if (isLoading) {
    return <div className="p-8 text-center text-[#9090B0]">Đang tải dữ liệu...</div>;
  }

  if (!course) {
    return <div className="p-8 text-center text-red-500">Không tìm thấy khóa học</div>;
  }

  const handleSave = async () => {
    try {
      await updateCourse({
        courseId,
        payload: {
          title: basicInfo.title,
          description: basicInfo.description,
          level: basicInfo.difficulty,
          category_id: 1, // Fallback placeholder category
        },
      });

      if (basicInfo.thumbnailFile) {
        await uploadThumbnail({ courseId, file: basicInfo.thumbnailFile });
      }

      alert("Lưu thông tin thành công!");
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
    if (!course) return;
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
    <div className="flex flex-col h-full bg-[#FAF8FF]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#F0F0F8] px-6 pt-5 pb-4">
        <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[12px] text-[#9090B0]">
          <span className="hover:text-[#4648D4] cursor-pointer transition-colors">My Courses</span>
          <ChevronRightIcon size={12} />
          <span className="text-[#1A1A2E] font-medium">Chỉnh sửa</span>
        </nav>
        <div className="flex items-start justify-between mt-2">
          <div>
            <h1 className="text-[16px] font-extrabold text-[#1A1A2E] tracking-tight">
              Chỉnh sửa: {course.title}
            </h1>
            <p className="text-[12px] text-[#9090B0] mt-0.5">
              Cập nhật thông tin cơ bản cho khóa học của bạn.
            </p>
          </div>
          <button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#6B6BFF] to-[#4648D4] hover:-translate-y-0.5 transition-all disabled:bg-gray-400 disabled:shadow-none"
          >
            <SaveIcon size={14} />
            {isPending ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 overflow-y-auto px-6 py-8">
        <div className="max-w-[800px] mx-auto bg-white rounded-2xl border border-[#EAEAF4] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col gap-6">
          <Step1BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />

          <div className="border-t border-[#F4F4FA] my-4" />

          {/* Status Settings */}
          <div className="flex flex-col gap-3 p-5 rounded-xl border border-[#EAEAF4] bg-[#F9F9FC]">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[#1A1A2E]">Trạng thái khóa học</h3>
                <p className="text-[12px] text-[#9090B0] mt-1">
                  Chuyển khóa học sang trạng thái <strong>{course.status === "published" ? "Bản nháp" : "Công khai"}</strong>. Khóa học dạng nháp sẽ không hiển thị trên cửa hàng.
                </p>
              </div>
              <button
                type="button"
                onClick={handleToggleStatus}
                disabled={isPending}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 shrink-0 ${
                  course.status === "published" 
                    ? "bg-amber-100 text-amber-700 hover:bg-amber-200" 
                    : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                }`}
              >
                {isUpdatingStatus ? "Đang xử lý..." : course.status === "published" ? "Chuyển về Nháp" : "Công khai khóa học"}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="flex flex-col gap-3 p-5 rounded-xl border border-red-100 bg-red-50/50 mt-2">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-red-700">Xóa khóa học</h3>
                <p className="text-[12px] text-red-600/80 mt-1">
                  Hành động này sẽ xóa vĩnh viễn khóa học cùng toàn bộ module và bài học liên quan. Không thể khôi phục!
                  {course.status === "published" && (
                    <span className="block mt-1 font-semibold">Vui lòng chuyển khóa học về trạng thái Nháp để có thể xóa.</span>
                  )}
                </p>
              </div>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending || course.status === "published"}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-red-600 hover:bg-red-700 active:scale-95 transition-all disabled:bg-red-300 disabled:cursor-not-allowed disabled:shadow-none shrink-0"
              >
                {isDeleting ? "Đang xóa..." : "Xóa khóa học"}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
