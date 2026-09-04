"use client";

import React from "react";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGetCourseDetail, useGetCourseReviews, useCreateCourseReview, useUpdateCourseReview, useDeleteCourseReview } from "../../api";
import { CourseHeader } from "./CourseHeader";
import { CurriculumAccordion } from "./CurriculumAccordion";
import { CourseSidebar } from "./CourseSidebar";
import toast from "react-hot-toast";

function CourseReviewSection({ courseId }: { courseId: string | number }) {
 const { data: reviewsData, isLoading: isReviewsLoading } = useGetCourseReviews(courseId);
 const createReviewMutation = useCreateCourseReview();
 const updateReviewMutation = useUpdateCourseReview();
 const deleteReviewMutation = useDeleteCourseReview();
 const [rating, setRating] = React.useState(5);
 const [comment, setComment] = React.useState("");
 const [submitError, setSubmitError] = React.useState("");
 const [editingReviewId, setEditingReviewId] = React.useState<string | number | null>(null);
 const [editRating, setEditRating] = React.useState(5);
 const [editComment, setEditComment] = React.useState("");

 const reviews = reviewsData?.reviews ?? [];
 const averageRating = reviewsData?.average_rating ?? 0;

 const onSubmit = async (e: React.FormEvent) => {
 e.preventDefault();
 if (!comment.trim()) {
 setSubmitError("Vui lòng nhập nội dung nhận xét trước khi gửi.");
 return;
 }

 setSubmitError("");

 try {
 await createReviewMutation.mutateAsync({
 courseId,
 rating,
 comment: comment.trim(),
 });

 setComment("");
 setRating(5);
 } catch (error: any) {
 const message = error?.response?.data?.message || "Không thể gửi nhận xét. Vui lòng thử lại.";
 setSubmitError(message);
 }
 };

 const handleEdit = (review: typeof reviews[0]) => {
 setEditingReviewId(review.id);
 setEditRating(review.rating);
 setEditComment(review.comment);
 };

 const handleEditSubmit = async (e: React.FormEvent, reviewId: string | number) => {
 e.preventDefault();
 if (!editComment.trim()) return;

 try {
 await updateReviewMutation.mutateAsync({
 courseId,
 reviewId,
 rating: editRating,
 comment: editComment.trim(),
 });
 setEditingReviewId(null);
 } catch (error: any) {
 toast.error(error?.response?.data?.message || "Không thể cập nhật nhận xét.");
 }
 };

 const handleDelete = async (reviewId: string | number) => {
 if (!window.confirm("Bạn có chắc muốn xóa nhận xét này?")) return;

 try {
 await deleteReviewMutation.mutateAsync({
 courseId,
 reviewId,
 });
 } catch (error: any) {
 toast.error(error?.response?.data?.message || "Không thể xóa nhận xét.");
 }
 };

 return (
 <section className="mt-8 w-full rounded-2xl border border-[#E8E2D9] bg-white p-5 shadow-sm">
 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
 <div>
 <p className="text-xs font-bold uppercase tracking-widest text-[#B8B0A3]">Bình luận & nhận xét</p>
 <h3 className="mt-2 text-2xl font-bold text-[#2C3039] font-[family-name:var(--font-playfair-display)]">Đánh giá khóa học</h3>
 </div>
 <div className="rounded-lg border border-[#E8E2D9] bg-[#FAF7F2] px-4 py-2 text-sm font-semibold text-[#2C3039]">
 Đánh giá: {averageRating.toFixed(1)} / 5
 </div>
 </div>

 <form onSubmit={onSubmit} className="mt-6 rounded-xl border border-[#E8E2D9] bg-[#FAF7F2] p-4">
 <div className="flex items-center gap-2 mb-2">
 <span className="text-sm font-semibold text-[#8A8478] mr-2">Mức độ hài lòng:</span>
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => setRating(star)}
 className={`w-8 h-8 rounded-md text-sm font-bold border transition-colors ${
 star <= rating 
 ? "bg-[#2C3039] text-white border-[#2C3039]" 
 : "bg-white text-[#8A8478] border-[#E8E2D9] hover:border-[#B8B0A3]"
 }`}
 aria-label={`Chọn ${star} sao`}
 >
 {star}
 </button>
 ))}
 </div>

 <textarea
 value={comment}
 onChange={(e) => setComment(e.target.value)}
 rows={4}
 placeholder="Viết nhận xét của bạn về khóa học..."
 className="mt-4 w-full resize-none rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-sm text-[#2C3039] placeholder:text-[#B8B0A3] outline-none transition focus:border-[#B8B0A3]"
 />

 <div className="mt-4 flex items-center justify-between gap-3">
 <p className="text-xs text-[#8A8478]">{reviews.length} nhận xét đã được gửi</p>
 <button
 type="submit"
 disabled={createReviewMutation.isPending || !comment.trim()}
 className="rounded-lg bg-[#C0392B] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#A93226] disabled:opacity-50"
 >
 {createReviewMutation.isPending ? "Đang gửi..." : "Gửi nhận xét"}
 </button>
 </div>

 {submitError ? (
 <p className="mt-3 text-sm text-[#C0392B] font-medium">{submitError}</p>
 ) : null}
 </form>

 <div className="mt-6 space-y-4">
 {isReviewsLoading ? (
 <div className="flex items-center justify-center py-8 text-sm text-[#8A8478]">Đang tải bình luận...</div>
 ) : reviews.length === 0 ? (
 <div className="rounded-xl border border-dashed border-[#B8B0A3] bg-[#FEFCF9] p-6 text-center text-sm text-[#8A8478]">
 Chưa có nhận xét nào cho khóa học này.
 </div>
 ) : (
 reviews.map((review) => (
 <div key={review.id} className="rounded-xl border border-[#E8E2D9] bg-[#FEFCF9] p-4">
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2C3039] text-sm font-bold text-white font-[family-name:var(--font-playfair-display)]">
 {(review.user?.name ?? "H").charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-bold text-[#2C3039]">{review.user?.name ?? "Học viên"}</p>
 <p className="text-xs text-[#8A8478]">{new Date(review.created_at ?? Date.now()).toLocaleDateString("vi-VN")}</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <div className="rounded-md border border-[#E8E2D9] bg-white px-2 py-1 text-xs font-bold text-[#2C3039]">
 Đánh giá: {review.rating}/5
 </div>
 </div>
 </div>

 {editingReviewId === review.id ? (
 <form onSubmit={(e) => handleEditSubmit(e, review.id)} className="mt-4 flex flex-col gap-3">
 <div className="flex items-center gap-2 mb-1">
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => setEditRating(star)}
 className={`w-7 h-7 rounded text-xs font-bold border transition-colors ${
 star <= editRating 
 ? "bg-[#2C3039] text-white border-[#2C3039]" 
 : "bg-white text-[#8A8478] border-[#E8E2D9] hover:border-[#B8B0A3]"
 }`}
 aria-label={`Chọn ${star} sao`}
 >
 {star}
 </button>
 ))}
 </div>
 <textarea
 value={editComment}
 onChange={(e) => setEditComment(e.target.value)}
 rows={3}
 className="w-full resize-none rounded-xl border border-[#E8E2D9] bg-white px-4 py-3 text-sm text-[#2C3039] outline-none focus:border-[#B8B0A3]"
 />
 <div className="flex justify-end gap-2">
 <button
 type="button"
 onClick={() => setEditingReviewId(null)}
 className="rounded-lg border border-[#E8E2D9] bg-white px-4 py-2 text-xs font-bold text-[#8A8478] hover:bg-[#F5F0E8]"
 >
 Hủy
 </button>
 <button
 type="submit"
 disabled={updateReviewMutation.isPending}
 className="rounded-lg bg-[#2C3039] px-4 py-2 text-xs font-bold text-white hover:bg-[#1C1D23] disabled:opacity-50"
 >
 {updateReviewMutation.isPending ? "Đang lưu..." : "Lưu"}
 </button>
 </div>
 </form>
 ) : (
 <>
 <p className="mt-3 text-sm leading-relaxed text-[#4A4F5C]">{review.comment}</p>
 <div className="mt-3 flex items-center justify-end gap-3 pt-3 border-t border-[#E8E2D9]">
 <button
 onClick={() => handleEdit(review)}
 className="text-xs font-bold text-[#8A8478] hover:text-[#2C3039] transition-colors"
 >
 Sửa
 </button>
 <button
 onClick={() => handleDelete(review.id)}
 disabled={deleteReviewMutation.isPending}
 className="text-xs font-bold text-[#C0392B] hover:text-[#A93226] transition-colors disabled:opacity-50"
 >
 Xóa
 </button>
 </div>
 </>
 )}
 </div>
 ))
 )}
 </div>
 </section>
 );
}

export function CourseDetailWorkspace({ courseId = 1 }: { courseId?: string | number }) {
 const { data, isLoading, isError, refetch } = useGetCourseDetail(courseId);

 if (isLoading) {
 return (
 <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[70vh] flex items-center justify-center">
 <Loader size="lg" text="Đang đồng bộ dữ liệu giáo trình và trợ lý AI Nova cho khóa học..." />
 </div>
 );
 }

 if (isError || !data) {
 return (
 <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
 <div className="px-4 py-1.5 rounded-md bg-[#C0392B] text-white text-xs font-bold tracking-widest uppercase mb-1">
 LỖI
 </div>
 <h3 className="text-lg font-bold text-[#2C3039] font-[family-name:var(--font-playfair-display)]">Không thể tải thông tin khóa học</h3>
 <p className="text-xs text-[#8A8478] max-w-md leading-relaxed">
 Đã xảy ra sự cố khi kết nối tới máy chủ khóa học MindNova AI. Vui lòng kiểm tra kết nối mạng và thử tải lại sau ít phút.
 </p>
 <button 
 type="button"
 onClick={() => refetch()} 
 className="mt-4 px-6 py-2.5 bg-[#2C3039] text-white text-xs font-bold rounded-lg hover:bg-[#1C1D23] transition-all cursor-pointer"
 >
 Thử tải lại ngay
 </button>
 </div>
 );
 }

 const { header_info, progress_card, ai_insight, instructor, modules, resources } = data;

 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col lg:flex-row items-start gap-8 bg-[#FAF7F2]">
 {/* Main Content (Left) */}
 <div className="flex-1 w-full min-w-0">
 <CourseHeader info={header_info} />
 <CurriculumAccordion modules={modules} courseId={courseId} />
 <CourseReviewSection courseId={courseId} />
 </div>

 {/* Sidebar (Right) */}
 <CourseSidebar 
 progress={progress_card}
 aiInsight={ai_insight}
 instructor={instructor}
 resources={resources}
 isEnrolled={header_info.is_enrolled}
 price={header_info.price}
 courseId={courseId}
 />
 </div>
 );
}
