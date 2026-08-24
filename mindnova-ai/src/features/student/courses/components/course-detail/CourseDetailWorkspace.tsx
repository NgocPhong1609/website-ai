"use client";

import React from "react";
import { Loader } from "@/src/shared/components/ui/Loader";
import { useGetCourseDetail, useGetCourseReviews, useCreateCourseReview, useUpdateCourseReview, useDeleteCourseReview } from "../../api";
import { CourseHeader } from "./CourseHeader";
import { CurriculumAccordion } from "./CurriculumAccordion";
import { CourseSidebar } from "./CourseSidebar";

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
      alert(error?.response?.data?.message || "Không thể cập nhật nhận xét.");
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
      alert(error?.response?.data?.message || "Không thể xóa nhận xét.");
    }
  };

  return (
    <section className="mt-8 w-full rounded-[20px] border border-[#E7E8F2] bg-white p-5 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#5052EE]">Bình luận & nhận xét</p>
          <h3 className="mt-2 text-2xl font-bold text-[#1A1A2E]">Đánh giá khóa học</h3>
        </div>
        <div className="rounded-full bg-[#EEF2FF] px-4 py-2 text-sm font-semibold text-[#3730A3]">
          ⭐ {averageRating.toFixed(1)} / 5
        </div>
      </div>

      <form onSubmit={onSubmit} className="mt-6 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4">
        <div className="flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className={`text-2xl transition ${star <= rating ? "text-yellow-400" : "text-slate-300"}`}
              aria-label={`Chọn ${star} sao`}
            >
              ★
            </button>
          ))}
        </div>

        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          placeholder="Viết nhận xét của bạn về khóa học..."
          className="mt-4 w-full resize-none rounded-xl border border-[#D8DCEB] bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none transition focus:border-[#5052EE]"
        />

        <div className="mt-4 flex items-center justify-between gap-3">
          <p className="text-xs text-[#64647A]">{reviews.length} nhận xét đã được gửi</p>
          <button
            type="submit"
            disabled={createReviewMutation.isPending || !comment.trim()}
            className="rounded-xl bg-[#5052EE] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4648D4] disabled:cursor-not-allowed disabled:bg-[#B9C0FF]"
          >
            {createReviewMutation.isPending ? "Đang gửi..." : "Gửi nhận xét"}
          </button>
        </div>

        {submitError ? (
          <p className="mt-3 text-sm text-red-600">{submitError}</p>
        ) : null}
      </form>

      <div className="mt-6 space-y-4">
        {isReviewsLoading ? (
          <div className="flex items-center justify-center py-8 text-sm text-[#64647A]">Đang tải bình luận...</div>
        ) : reviews.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#CBD5E1] bg-[#F8FAFC] p-6 text-center text-sm text-[#64647A]">
            Chưa có nhận xét nào cho khóa học này.
          </div>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="rounded-2xl border border-[#E7E8F2] bg-[#F8FAFC] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#5052EE] to-[#7C3AED] text-sm font-bold text-white">
                    {(review.user?.name ?? "H").charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-[#1A1A2E]">{review.user?.name ?? "Học viên"}</p>
                    <p className="text-xs text-[#64647A]">{new Date(review.created_at ?? Date.now()).toLocaleDateString("vi-VN")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#FFF7ED] px-2 py-1 text-xs font-semibold text-[#C2410C]">
                    {"★".repeat(review.rating)}{review.rating ? "" : ""}
                  </div>
                </div>
              </div>

              {editingReviewId === review.id ? (
                <form onSubmit={(e) => handleEditSubmit(e, review.id)} className="mt-3 flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setEditRating(star)}
                        className={`text-xl transition ${star <= editRating ? "text-yellow-400" : "text-slate-300"}`}
                        aria-label={`Chọn ${star} sao`}
                      >
                        ★
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={editComment}
                    onChange={(e) => setEditComment(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-xl border border-[#D8DCEB] bg-white px-4 py-3 text-sm text-[#1A1A2E] outline-none focus:border-[#5052EE]"
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setEditingReviewId(null)}
                      className="rounded-xl border border-[#E5E7EB] px-4 py-2 text-xs font-semibold text-[#64647A] hover:bg-gray-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={updateReviewMutation.isPending}
                      className="rounded-xl bg-[#5052EE] px-4 py-2 text-xs font-semibold text-white hover:bg-[#4648D4] disabled:opacity-60"
                    >
                      {updateReviewMutation.isPending ? "Đang lưu..." : "Lưu"}
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <p className="mt-3 text-sm leading-6 text-[#2F374B]">{review.comment}</p>
                  <div className="mt-3 flex items-center justify-end gap-2">
                    <button
                      onClick={() => handleEdit(review)}
                      className="text-xs font-semibold text-[#5052EE] hover:text-[#4648D4] transition-colors"
                    >
                      Sửa
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      disabled={deleteReviewMutation.isPending}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors disabled:opacity-60"
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
        <div className="w-16 h-16 rounded-2xl bg-[#FEF2F2] text-[#DC2626] flex items-center justify-center text-2xl mb-1 shadow-sm border border-[#FCA5A5]/40">
          ⚠️
        </div>
        <h3 className="text-lg font-bold text-[#1A1A2E]">Không thể tải thông tin khóa học</h3>
        <p className="text-xs text-[#64647A] max-w-md leading-relaxed">
          Đã xảy ra sự cố khi kết nối tới máy chủ khóa học MindNova AI. Vui lòng kiểm tra kết nối mạng và thử tải lại sau ít phút.
        </p>
        <button 
          type="button"
          onClick={() => refetch()} 
          className="mt-2 px-6 py-2.5 bg-[#5052EE] text-white text-xs font-semibold rounded-xl hover:bg-[#4648D4] transition-all cursor-pointer shadow-sm"
        >
          🔄 Thử tải lại ngay
        </button>
      </div>
    );
  }

  const { header_info, progress_card, ai_insight, instructor, modules, resources } = data;

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col lg:flex-row items-start gap-8">
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
