"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import { useInstructorCourse } from "../../management/api/courses";
import { useCreateCourseStore } from "../stores/createCourseStore";
import { useUpdateCourse, useUploadCourseThumbnail, useDeleteCourse, useUpdateCourseStatus, useUpdateCoursePrice } from "../api";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { CourseEditTabs, EditCourseTab } from "./CourseEditTabs";
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
  const { mutateAsync: updatePrice, isPending: isUpdatingPrice } = useUpdateCoursePrice();
  const { mutateAsync: uploadThumbnail, isPending: isUploading } = useUploadCourseThumbnail();
  const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatus();

  const [activeTab, setActiveTab] = useState("overview");
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
      useCreateCourseStore.getState().setSettings("basePrice", String(course.price ?? 500000));
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

      const storeBasePrice = useCreateCourseStore.getState().settings.basePrice;
      if (storeBasePrice !== undefined && storeBasePrice !== null) {
        const priceNum = Number(String(storeBasePrice).replace(/[^0-9]/g, ""));
        if (priceNum === 0 || priceNum >= 100000) {
          await updatePrice({ courseId, price: priceNum });
        }
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

  const isPending = isUpdating || isUploading || isDeleting || isUpdatingStatus || isUpdatingPrice;

  return (
    <div className="min-h-screen bg-[#F4F4F8] flex flex-col font-sans pb-16">
      {/* ── HEADER CẬP NHẬT ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 px-6 pt-3 pb-2 shadow-2xs">
        <div className="max-w-6xl mx-auto flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            
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
                    {course.status === "published" ? "PUBLISHED" : "DRAFT MODE"}
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
                disabled={isPending}
                className={twMerge(
                  "flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black text-white transition-all shadow-sm cursor-pointer",
                  saveSuccess ? "bg-emerald-600 hover:bg-emerald-700" : "bg-[#4F46E5] hover:bg-[#4338CA] disabled:bg-gray-400"
                )}
              >
                {isUpdating || isUploading || isUpdatingPrice ? (
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

          {/* Render Thanh Tabs bên trong Header */}
          <CourseEditTabs activeTab={activeTab as EditCourseTab} onChangeTab={setActiveTab} />
        </div>
      </header>

      {/* ── THÂN TRANG & HIỂN THỊ THEO TAB ──────────────────────────────────── */}
      <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 flex flex-col">
        
        {/* Nội dung render tương ứng với tab được chọn */}
        <div className="mt-2">
          {activeTab === "overview" && (
            <Step1BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />
          )}

          {activeTab === "pricing" && (
            <Step3SettingsPrice 
              courseTitle={basicInfo.title} 
              thumbnailPreview={basicInfo.thumbnailPreview} 
              initialPrice={course?.price}
            />
          )}

          {activeTab === "advanced" && (
             <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex flex-col gap-2">
                <div className="flex flex-col gap-1 mb-2">
                  <h2 className="text-[17px] font-black text-gray-900">Cấu hình Quyền học tập</h2>
                  <p className="text-[13px] text-gray-500">Quản lý cấp chứng chỉ tự động và khóa bình luận diễn đàn.</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">🏆</span>
                    <div>
                      <span className="block text-[14px] font-bold text-gray-900">Cấp Chứng Chỉ Tốt Nghiệp Tự Động (Blockchain ID)</span>
                      <span className="text-[12px] text-gray-500 block mt-0.5">Tự động sinh mã chứng nhận khi học viên đạt trên 80% tiến độ bài giảng</span>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer" />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-gray-100 bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">💬</span>
                    <div>
                      <span className="block text-[14px] font-bold text-gray-900">Hòm thư thảo luận trực tiếp</span>
                      <span className="text-[12px] text-gray-500 block mt-0.5">Cho phép học viên đặt câu hỏi Hỏi-Đáp bên dưới từng bài video</span>
                    </div>
                  </div>
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5] cursor-pointer" />
                </div>

                <div className="mt-4 pt-6 border-t border-rose-50 flex flex-col gap-4">
                  <h3 className="text-[12px] font-black uppercase tracking-wider text-[#E11D48] flex items-center gap-1.5">
                    <TrashIcon size={14} />
                    <span>Khu Vực Nguy Hiểm (Danger Zone)</span>
                  </h3>
                  <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div>
                      <span className="block text-[14px] font-bold text-rose-950">Xóa vĩnh viễn khóa học này</span>
                      <span className="text-[12px] text-rose-700 block mt-1">
                        Hành động này không thể hoàn tác. Toàn bộ video và dữ liệu bài giảng sẽ bị xóa.
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={handleDelete}
                      disabled={isPending || isDeleting}
                      className="px-5 py-2.5 rounded-xl bg-[#E11D48] hover:bg-rose-700 text-white font-extrabold text-[13px] shadow-sm transition-all shrink-0 cursor-pointer disabled:bg-rose-300 disabled:cursor-not-allowed"
                    >
                      {isDeleting ? "Đang xóa..." : "Xóa bài giảng"}
                    </button>
                  </div>
                </div>
             </div>
          )}
        </div>
      </main>
    </div>
  );
}