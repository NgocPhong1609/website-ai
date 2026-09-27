"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";

import React from "react";
import { Skeleton, SkeletonList } from "@/src/shared/components/ui/Skeleton";
import { useConfirmDialog } from "@/src/shared/components/ui/ConfirmDialog";
import { NoDataAvailable } from "@/src/shared/components/ui";
import { Lock, MessageSquareOff, Star } from "lucide-react";
import { useGetCourseDetail, useGetCourseReviews, useCreateCourseReview, useUpdateCourseReview, useDeleteCourseReview } from "../../api";
import { CourseHeader } from "./CourseHeader";
import { CurriculumAccordion } from "./CurriculumAccordion";
import { CourseSidebar } from "./CourseSidebar";
import toast from "react-hot-toast";

function useCurrentUserId(): string | null {
 const [id, setId] = React.useState<string | null>(null);
 React.useEffect(() => {
 try {
 const raw = window.localStorage.getItem("userInfo");
 setId(raw ? String(JSON.parse(raw)?.id ?? "") || null : null);
 } catch {
 setId(null);
 }
 }, []);
 return id;
}

function CourseReviewSection({ courseId, isEnrolled }: { courseId: string | number; isEnrolled: boolean }) {
 const { data: reviewsData, isLoading: isReviewsLoading } = useGetCourseReviews(courseId);
 const currentUserId = useCurrentUserId();
 const { confirm } = useConfirmDialog();
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
 const isMine = (review: typeof reviews[0]) => !!currentUserId && String(review.user?.id ?? "") === currentUserId;
 const myReview = reviews.find(isMine);
 const canWriteReview = isEnrolled && !myReview;

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
 toast.success("Cảm ơn bạn đã đánh giá khóa học!");
 } catch (error: any) {
 const message = getErrorMessage(error, "Không thể gửi nhận xét. Vui lòng thử lại.");
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
 toast.error(getErrorMessage(error, "Không thể cập nhật nhận xét."));
 }
 };

 const handleDelete = async (reviewId: string | number) => {
 const confirmed = await confirm({
 title: "Xóa nhận xét",
 message: "Bạn có chắc muốn xóa nhận xét này? Bạn có thể viết lại nhận xét mới sau đó.",
 confirmText: "Xóa nhận xét",
 variant: "danger",
 });
 if (!confirmed) return;

 try {
 await deleteReviewMutation.mutateAsync({
 courseId,
 reviewId,
 });
 } catch (error: any) {
 toast.error(getErrorMessage(error, "Không thể xóa nhận xét."));
 }
 };

 return (
 <section className="mt-8 w-full rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
 <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
 <div>
 <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Bình luận & nhận xét</p>
 <h3 className="mt-2 text-2xl font-semibold text-slate-900">Đánh giá khóa học</h3>
 </div>
 <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-900">
 Đánh giá: {averageRating.toFixed(1)} / 5
 </div>
 </div>

 {!isEnrolled ? (
 <div className="mt-6 flex items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
 <Lock size={16} className="shrink-0 text-slate-400" aria-hidden />
 <span>Đăng ký khóa học để gửi nhận xét và đánh giá của bạn.</span>
 </div>
 ) : !canWriteReview ? (
 <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">
 Bạn đã đánh giá khóa học này. Bạn có thể sửa hoặc xóa nhận xét của mình ở danh sách bên dưới.
 </div>
 ) : (
 <form onSubmit={onSubmit} className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
 <div className="flex items-center gap-1 mb-2">
 <span className="text-sm font-medium text-slate-500 mr-2">Mức độ hài lòng:</span>
 {[1, 2, 3, 4, 5].map((star) => (
 <button
 key={star}
 type="button"
 onClick={() => setRating(star)}
 className="w-8 h-8 flex items-center justify-center transition-transform hover:scale-110 cursor-pointer"
 aria-label={`Chọn ${star} sao`}
 >
 <Star 
 size={24} 
 className={star <= rating ? "text-amber-500 fill-amber-500" : "text-slate-200"} 
 />
 </button>
 ))}
 </div>

 <textarea
 value={comment}
 onChange={(e) => setComment(e.target.value)}
 rows={4}
 placeholder="Viết nhận xét của bạn về khóa học..."
 className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:border-slate-400"
 />

 <div className="mt-4 flex items-center justify-between gap-3">
 <p className="text-xs text-slate-500">{reviews.length} nhận xét đã được gửi</p>
 <button
 type="submit"
 disabled={createReviewMutation.isPending || !comment.trim()}
 className="rounded-lg bg-blue-500 px-5 py-2.5 text-sm font-bold text-white transition hover:bg-blue-600 disabled:opacity-50"
 >
 {createReviewMutation.isPending ? "Đang gửi..." : "Gửi nhận xét"}
 </button>
 </div>

 {submitError ? (
 <p className="mt-3 text-sm text-rose-600 font-medium" role="alert">{submitError}</p>
 ) : null}
 </form>
 )}

 <div className="mt-6 space-y-4">
 {isReviewsLoading ? (
 <SkeletonList items={2} />
 ) : reviews.length === 0 ? (
 <NoDataAvailable
  icon={MessageSquareOff}
  title="Chưa có nhận xét"
  description="Chưa có nhận xét nào cho khóa học này. Hãy trở thành người đầu tiên đánh giá khóa học!"
  variant="compact"
 />
 ) : (
 reviews.map((review) => (
 <div key={review.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
 <div className="flex items-start justify-between gap-3">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-bold text-white">
 {(review.user?.name ?? "H").charAt(0).toUpperCase()}
 </div>
 <div>
 <p className="font-bold text-slate-900">{review.user?.name ?? "Học viên"}</p>
 <p className="text-xs text-slate-500">{new Date(review.created_at ?? Date.now()).toLocaleDateString("vi-VN")}</p>
 </div>
 </div>
 <div className="flex items-center gap-2">
 <div className="rounded-md border border-slate-200 bg-white px-2 py-1 text-xs font-bold text-slate-900">
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
 ? "bg-slate-900 text-white border-slate-900" 
 : "bg-white text-slate-500 border-slate-200 hover:border-slate-400"
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
 className="w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:border-slate-400"
 />
 <div className="flex justify-end gap-2">
 <button
 type="button"
 onClick={() => setEditingReviewId(null)}
 className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-500 hover:bg-slate-100"
 >
 Hủy
 </button>
 <button
 type="submit"
 disabled={updateReviewMutation.isPending}
 className="rounded-lg bg-slate-900 px-4 py-2 text-xs font-bold text-white hover:bg-[#1C1D23] disabled:opacity-50"
 >
 {updateReviewMutation.isPending ? "Đang lưu..." : "Lưu"}
 </button>
 </div>
 </form>
 ) : (
 <>
 <p className="mt-3 text-sm leading-relaxed text-slate-500">{review.comment}</p>
 {isMine(review) && (
 <div className="mt-3 flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
 <button
 onClick={() => handleEdit(review)}
 className="text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors"
 >
 Sửa
 </button>
 <button
 onClick={() => handleDelete(review.id)}
 disabled={deleteReviewMutation.isPending}
 className="text-xs font-bold text-rose-600 hover:text-rose-700 transition-colors disabled:opacity-50"
 >
 Xóa
 </button>
 </div>
 )}
 </>
 )}
 </div>
 ))
 )}
 </div>
 </section>
 );
}

export function CourseDetailWorkspace({ courseId }: { courseId: string | number }) {
 const { data, isLoading, isError, refetch } = useGetCourseDetail(courseId);

 if (isLoading) {
 return (
 <div role="status" aria-busy="true" aria-label="Đang tải khóa học" className="p-6 md:p-8 max-w-[1400px] mx-auto flex flex-col lg:flex-row items-start gap-8">
 <div className="flex-1 w-full space-y-6">
 <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
 <Skeleton className="h-4 w-48" />
 <Skeleton className="h-9 w-2/3" />
 <Skeleton className="h-4 w-1/2" />
 <Skeleton className="h-10 w-40" />
 </div>
 <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-3">
 <Skeleton className="h-6 w-64" />
 {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-16 w-full" />)}
 </div>
 </div>
 <div className="w-full lg:w-[340px] space-y-6">
 <Skeleton className="h-44 w-full rounded-xl" />
 <Skeleton className="h-32 w-full rounded-xl" />
 </div>
 </div>
 );
 }

 if (isError || !data) {
 return (
 <div className="p-6 md:p-12 max-w-[1400px] mx-auto min-h-[60vh] flex flex-col items-center justify-center text-center gap-3">
 <div className="px-4 py-1.5 rounded-md bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold tracking-widest uppercase mb-1">
 Lỗi
 </div>
 <h3 className="text-lg font-semibold text-slate-900">Không thể tải thông tin khóa học</h3>
 <p className="text-xs text-slate-500 max-w-md leading-relaxed">
 Đã xảy ra sự cố khi kết nối tới máy chủ khóa học MindNova AI. Vui lòng kiểm tra kết nối mạng và thử tải lại sau ít phút.
 </p>
 <button 
 type="button"
 onClick={() => refetch()} 
 className="mt-4 px-6 py-2.5 bg-blue-500 text-white text-xs font-bold rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
 >
 Thử tải lại ngay
 </button>
 </div>
 );
 }

 const { header_info, progress_card, ai_insight, instructor, modules, resources } = data;

 return (
 <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col lg:flex-row items-start gap-8 bg-slate-50">
 {/* Main Content (Left) */}
 <div className="flex-1 w-full min-w-0">
 <CourseHeader info={header_info} />
 <CurriculumAccordion modules={modules} courseId={courseId} isEnrolled={!!header_info.is_enrolled} />
 <CourseReviewSection courseId={courseId} isEnrolled={!!header_info.is_enrolled} />
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
