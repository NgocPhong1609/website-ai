"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import toast from "react-hot-toast";
import { useConfirmDialog } from "@/src/shared/components/ui/ConfirmDialog";
import { useInstructorCourse } from "../../management/api/courses";
import { useCreateCourseStore } from "../stores/createCourseStore";
import { useUpdateCourse, useUploadCourseThumbnail, useDeleteCourse, useUpdateCourseStatus, useUpdateCoursePrice, useSubmitForReview } from "../api";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step3SettingsPrice } from "./Step3SettingsPrice";
import { CourseEditTabs, EditCourseTab } from "./CourseEditTabs";
import { CourseHealthCard } from "./CourseHealthCard";
import { Step2CourseStructure } from "./Step2CourseStructure";
import type { CourseBasicInfo, DifficultyLevel } from "../types";
import { Skeleton } from "@/src/shared/components/ui";

import { OTHER_CATEGORY_VALUE } from "../constants";
import { useProposeCategory } from "../api";
import { ArrowLeft, Check, Eye, Save, Trash2, Award, MessageSquare, Loader2 } from "lucide-react";

export function EditCourseContainer({ courseId }: { courseId: string }) {
 const router = useRouter();
 const { confirm } = useConfirmDialog();
 const { data: course, isLoading } = useInstructorCourse(courseId);
 const { mutateAsync: updateCourse, isPending: isUpdating } = useUpdateCourse();
 const { mutateAsync: updatePrice, isPending: isUpdatingPrice } = useUpdateCoursePrice();
 const { mutateAsync: uploadThumbnail, isPending: isUploading } = useUploadCourseThumbnail();
 const { mutateAsync: deleteCourse, isPending: isDeleting } = useDeleteCourse();
 const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateCourseStatus();
 const { mutateAsync: submitForReview, isPending: isSubmittingReview } = useSubmitForReview();
 const { mutateAsync: proposeCategory } = useProposeCategory();

 const [activeTab, setActiveTab] = useState("overview");
 const [saveSuccess, setSaveSuccess] = useState(false);
 const [basicInfo, setBasicInfo] = useState<CourseBasicInfo>({
 title: "",
 description: "",
 field: "",
 categoryId: null,
 categoryName: "",
 otherName: "",
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
 field: course.category_id ? String(course.category_id) : "",
 categoryId: course.category_id ? Number(course.category_id) : null,
 categoryName: course.category_name || course.category?.name || "",
 otherName: "",
 difficulty: (course.level as DifficultyLevel) || "beginner",
 thumbnailPreview: course.thumbnail || null,
 }));
 useCreateCourseStore.getState().setSettings("basePrice", String(course.price ?? 500000));
 useCreateCourseStore.getState().setSettings("isFlashSale", course.is_flash_sale);
 useCreateCourseStore.getState().setSettings("salePrice", String(course.sale_price ?? ""));
 useCreateCourseStore.getState().setSettings("saleStartDate", course.sale_start_date ? course.sale_start_date.split('T')[0] : "");
 useCreateCourseStore.getState().setSettings("saleEndDate", course.sale_end_date ? course.sale_end_date.split('T')[0] : "");
 }
 }, [course]);

 if (isLoading) {
 return (
 <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
 <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 pt-3 pb-2 shadow-sm">
 <div className="max-w-6xl mx-auto flex flex-col gap-2">
 <div className="flex flex-wrap items-center justify-between gap-3">
 <div className="flex items-center gap-3">
 <Skeleton className="w-10 h-10 rounded-lg" />
 <div>
 <Skeleton className="h-3 w-40 mb-1" />
 <Skeleton className="h-5 w-64" />
 </div>
 </div>
 <div className="flex items-center gap-2.5">
 <Skeleton className="w-24 h-9 rounded-lg" />
 <Skeleton className="w-32 h-9 rounded-lg" />
 </div>
 </div>
 <div className="flex gap-4 mt-2">
 <Skeleton className="w-24 h-8" />
 <Skeleton className="w-24 h-8" />
 <Skeleton className="w-24 h-8" />
 </div>
 </div>
 </header>
 <main className="max-w-6xl mx-auto w-full px-4 sm:px-6 pt-6 flex flex-col gap-6">
 <Skeleton className="w-full h-24 rounded-lg" />
 <div className="grid grid-cols-1 md:grid-cols-[1fr_350px] gap-6">
 <div className="flex flex-col gap-5">
 <Skeleton className="w-full h-12 rounded-lg" />
 <Skeleton className="w-full h-32 rounded-lg" />
 </div>
 <div className="flex flex-col gap-4">
 <Skeleton className="w-full h-48 rounded-lg" />
 </div>
 </div>
 </main>
 </div>
 );
 }

 if (!course) {
 return <div className="p-8 text-center text-rose-500 font-bold">Không tìm thấy khóa học</div>;
 }

 const handleSave = async () => {
 try {
 let categoryId = basicInfo.categoryId;
 if (basicInfo.field === OTHER_CATEGORY_VALUE || !categoryId) {
 const otherName = basicInfo.otherName.trim();
 if (!otherName) {
 throw new Error("Vui lòng chọn danh mục hoặc nhập lĩnh vực khác.");
 }
 const proposed = await proposeCategory(otherName);
 categoryId = proposed.id;
 }
 
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

 const storeSettings = useCreateCourseStore.getState().settings;
 if (storeSettings.basePrice !== undefined && storeSettings.basePrice !== null) {
 const priceNum = Number(String(storeSettings.basePrice).replace(/[^0-9]/g, ""));
 if (priceNum === 0 || priceNum >= 100000) {
 await updatePrice({ 
 courseId, 
 price: priceNum,
 partnership_tier: storeSettings.partnershipTier || "standard",
 is_flash_sale: priceNum === 0 ? false : storeSettings.isFlashSale,
 sale_price: priceNum === 0 ? undefined : (storeSettings.salePrice ? Number(String(storeSettings.salePrice).replace(/[^0-9]/g, "")) : undefined),
 sale_start_date: priceNum === 0 ? undefined : storeSettings.saleStartDate,
 sale_end_date: priceNum === 0 ? undefined : storeSettings.saleEndDate
 });
 }
 }

 setSaveSuccess(true);
 setTimeout(() => setSaveSuccess(false), 3000);
 } catch (error) {
 console.error(error);
 toast.error(getErrorMessage(error, "Không thể lưu thông tin khóa học. Vui lòng thử lại."));
 }
 };

 const handleDelete = async () => {
 const confirmed = await confirm({
 title: "Xóa khóa học",
 message: "Bạn có chắc chắn muốn xóa khóa học này? Toàn bộ module, bài học và dữ liệu liên quan sẽ bị xóa vĩnh viễn. Hành động này không thể hoàn tác!",
 confirmText: "Xóa vĩnh viễn",
 cancelText: "Hủy bỏ",
 variant: "danger",
 });
 if (!confirmed) return;
 try {
 await deleteCourse(courseId);
 toast.success("Đã xóa khóa học thành công!");
 router.push("/instructor/courses");
 } catch (error: any) {
 console.error(error);
 toast.error(getErrorMessage(error, "Lỗi khi xóa khóa học"));
 }
 };

 const handleSubmitReview = async () => {
 const confirmed = await confirm({
 title: "Gửi xét duyệt",
 message: "Bạn có chắc chắn muốn gửi khóa học này để quản trị viên xét duyệt?",
 confirmText: "Gửi xét duyệt",
 cancelText: "Hủy bỏ",
 variant: "info",
 });
 if (!confirmed) return;
 try {
 await submitForReview({ courseId });
 toast.success("Khóa học đã được gửi xét duyệt thành công!");
 router.refresh();
 } catch (error: any) {
 toast.error(getErrorMessage(error, "Gửi xét duyệt thất bại!"));
 }
 };

 const isPending = isUpdating || isUploading || isDeleting || isUpdatingStatus || isUpdatingPrice || isSubmittingReview;

 return (
 <div className="min-h-screen bg-slate-50 flex flex-col font-sans pb-16">
 {/* ── HEADER CẬP NHẬT ─────────────────────────────────────────────────── */}
 <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 pt-3 pb-2 shadow-sm">
 <div className="max-w-6xl mx-auto flex flex-col gap-2">
 <div className="flex flex-wrap items-center justify-between gap-3">
 
 {/* Left Header - Breadcrumb & Title */}
 <div className="flex items-center gap-3">
 <Link
 href="/instructor/courses"
 className="w-10 h-10 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors shadow-sm border border-slate-100"
 >
 <ArrowLeft size={18} />
 </Link>
 <div>
 <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-bold text-slate-500 mb-0.5">
 <Link href="/instructor/courses" className="hover:text-slate-800 transition-colors">
 Khóa học của tôi
 </Link>
 <span>/</span>
 <span className="text-blue-500">
 Chỉnh sửa khóa học #{courseId}
 </span>
 </nav>
 <div className="flex items-center gap-2.5">
 <h1 className="text-lg font-bold text-slate-900 tracking-tight truncate max-w-md md:max-w-2xl">
 {basicInfo.title || "Tên khóa học"}
 </h1>
 <span className={`px-2.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${course.status === "published" ? "bg-emerald-50 text-emerald-700" : course.status === "pending_review" ? "bg-blue-50 text-blue-600 border-blue-200" : "bg-slate-50 text-slate-600 border-slate-200"}`}>
 {course.status === "published" ? "ĐÃ CÔNG KHAI" : course.status === "pending_review" ? "ĐANG CHỜ DUYỆT" : "BẢN NHÁP"}
 </span>
 </div>
 </div>
 </div>

 {/* Right Header - Buttons */}
 <div className="flex items-center gap-2.5">
 <Link
 href={`/courses/lesson?course_id=${courseId}&preview=true`}
 target="_blank"
 className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
 >
 <Eye size={14} />
 <span className="hidden sm:inline">Xem trước</span>
 </Link>

 {course.status === "draft" && (
 <button
 type="button"
 onClick={handleSubmitReview}
 disabled={isPending}
 className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-white bg-blue-500 hover:bg-blue-600 transition-all shadow-sm disabled:bg-slate-400"
 >
 <span className="hidden sm:inline">Gửi xét duyệt</span>
 </button>
 )}

 {course.status === "pending_review" && (
 <button
 type="button"
 disabled
 className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg text-xs font-bold text-slate-500 bg-slate-100 border border-slate-200 cursor-not-allowed shadow-sm"
 >
 <span className="hidden sm:inline">Đang chờ duyệt</span>
 </button>
 )}

 <button
 type="button"
 onClick={handleSave}
 disabled={isPending}
 className={twMerge(
 "flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-bold text-white transition-all shadow-sm cursor-pointer",
 saveSuccess ? "bg-emerald-500 hover:bg-emerald-600" : "bg-blue-500 hover:bg-blue-600 disabled:bg-slate-400"
 )}
 >
 {isUpdating || isUploading || isUpdatingPrice ? (
 <span><Loader2 className="inline h-4 w-4 mr-1.5 align-text-bottom animate-spin" aria-hidden />Đang lưu...</span>
 ) : saveSuccess ? (
 <>
 <Check size={14} />
 <span>Đã lưu thay đổi</span>
 </>
 ) : (
 <>
 <Save size={14} />
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
 <CourseHealthCard courseId={courseId} />
 
 {/* Nội dung render tương ứng với tab được chọn */}
 <div className="mt-2">
 {activeTab === "overview" && (
 <Step1BasicInfo data={basicInfo} onChange={handleBasicInfoChange} />
 )}

 {activeTab === "structure" && (
 <Step2CourseStructure courseId={courseId} />
 )}

 {activeTab === "pricing" && (
 <Step3SettingsPrice 
 courseId={courseId}
 courseTitle={basicInfo.title} 
 thumbnailPreview={basicInfo.thumbnailPreview} 
 initialPrice={course?.price}
 initialTier={(course as any)?.partnership_tier || "standard"}
 initialFlashSale={course?.is_flash_sale}
 initialSalePrice={course?.sale_price}
 initialSaleStartDate={course?.sale_start_date ? course.sale_start_date.split('T')[0] : null}
 initialSaleEndDate={course?.sale_end_date ? course.sale_end_date.split('T')[0] : null}
 />
 )}

 {activeTab === "advanced" && (
 <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
 <div className="flex flex-col gap-1 mb-2">
 <h2 className="text-[17px] font-bold text-slate-900">Cấu hình Quyền học tập</h2>
 <p className="text-[13px] text-slate-500">Quản lý cấp chứng chỉ tự động và khóa bình luận diễn đàn.</p>
 </div>

 <div className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
 <div className="flex items-center gap-3">
 <span className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0"><Award className="h-4 w-4" aria-hidden /></span>
 <div>
 <span className="block text-[14px] font-bold text-slate-900">Cấp Chứng Chỉ Tốt Nghiệp Tự Động (Blockchain ID)</span>
 <span className="text-[12px] text-slate-500 block mt-0.5">Tự động sinh mã chứng nhận khi học viên đạt trên 80% tiến độ bài giảng</span>
 </div>
 </div>
 <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
 </div>

 <div className="flex items-center justify-between p-4 rounded-lg border border-slate-100 bg-slate-50/50">
 <div className="flex items-center gap-3">
 <span className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0"><MessageSquare className="h-4 w-4" aria-hidden /></span>
 <div>
 <span className="block text-[14px] font-bold text-slate-900">Hòm thư thảo luận trực tiếp</span>
 <span className="text-[12px] text-slate-500 block mt-0.5">Cho phép học viên đặt câu hỏi Hỏi-Đáp bên dưới từng bài video</span>
 </div>
 </div>
 <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-500 focus:ring-blue-500 cursor-pointer" />
 </div>

 <div className="mt-4 pt-6 border-t border-rose-50 flex flex-col gap-4">
 <h3 className="text-[12px] font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
 <Trash2 size={14} />
 <span>Khu Vực Nguy Hiểm (Danger Zone)</span>
 </h3>
 <div className="p-4 rounded-lg bg-rose-50/50 border border-rose-100 flex flex-col sm:flex-row items-center justify-between gap-4">
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
 className="px-5 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold text-[13px] shadow-sm transition-all shrink-0 cursor-pointer disabled:bg-rose-300 disabled:cursor-not-allowed"
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
