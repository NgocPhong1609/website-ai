"use client";

import React, { useState } from "react";
import { twMerge } from "tailwind-merge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosClient } from "@/src/shared/lib/axios";

interface StudentRefundModalProps {
  isOpen: boolean;
  onClose: () => void;
  courseId: string | number;
  courseTitle?: string;
  onSuccess?: () => void;
}

export function StudentRefundModal({
  isOpen,
  onClose,
  courseId,
  courseTitle,
  onSuccess,
}: StudentRefundModalProps) {
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("Nội dung không phù hợp với nhu cầu");
  const [statusMsg, setStatusMsg] = useState<string | null>(null);
  const [isError, setIsError] = useState(false);

  // Fetch refund eligibility from backend
  const { data: eligibility, isLoading } = useQuery({
    queryKey: ["studentRefundEligibility", String(courseId)],
    queryFn: async () => {
      const res = await axiosClient.get(`/api/student/courses/${courseId}/refund-eligibility`);
      return res.data?.data;
    },
    enabled: isOpen && !!courseId,
  });

  // Refund mutation
  const refundMutation = useMutation({
    mutationFn: async () => {
      const res = await axiosClient.post("/api/student/orders/refund", {
        course_id: courseId,
        reason,
      });
      return res.data;
    },
    onSuccess: (res) => {
      setIsError(false);
      setStatusMsg(res.message || "Hoàn tiền thành công!");
      queryClient.invalidateQueries({ queryKey: ["student"] });
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
        setStatusMsg(null);
        window.location.href = "/courses";
      }, 2000);
    },
    onError: (err: any) => {
      setIsError(true);
      setStatusMsg(err.response?.data?.message || err.message || "Đã xảy ra lỗi khi hoàn tiền.");
    },
  });

  if (!isOpen) return null;

  const isEligible = eligibility?.is_eligible ?? false;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-fadeIn font-sans">
      <div className="relative w-full max-w-lg bg-white rounded-2xl border border-[#E8E2D9] shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-[#C0392B] text-white">
          <div className="flex items-center gap-2.5">
            <span className="text-xl">💰</span>
            <div>
              <h3 className="text-base font-black text-white">Yêu Cầu Hoàn Tiền Khóa Học</h3>
              <p className="text-xs text-white/80">Chính sách bảo vệ quyền lợi học viên MindNova AI</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng"
            className="w-8 h-8 rounded-xl flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          {/* Course Summary Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">Khóa học yêu cầu hoàn</span>
            <h4 className="text-sm font-black text-slate-900 mt-1">{eligibility?.course_title || courseTitle || "Khóa học của bạn"}</h4>
            {eligibility?.amount && (
              <p className="text-xs font-bold text-[#C0392B] mt-1">
                Số tiền thanh toán: {Number(eligibility.amount).toLocaleString("vi-VN")} VNĐ
              </p>
            )}
          </div>

          {/* Refund Rules Checklist */}
          <div className="flex flex-col gap-3 p-4 rounded-xl bg-[#FEFCF9] border border-[#E8E2D9]">
            <h5 className="text-xs font-black text-[#2C3039] uppercase">Kiểm Tra Điều Kiện Hoàn Tiền</h5>

            {isLoading ? (
              <p className="text-xs font-medium text-gray-500 text-center py-2">Đang kiểm tra tiến độ học tập và thời hạn đơn hàng...</p>
            ) : (
              <div className="flex flex-col gap-2 text-xs">
                {/* Rule 1: Within 30 days */}
                <div className="flex items-start gap-2">
                  <span className={twMerge("font-bold", eligibility?.within_30_days ? "text-emerald-600" : "text-rose-600")}>
                    {eligibility?.within_30_days ? "✓" : "✕"}
                  </span>
                  <div>
                    <span className="font-bold text-gray-800">Thời hạn bảo hộ 30 ngày: </span>
                    <span className="text-gray-600">
                      {eligibility?.days_since_purchase !== undefined
                        ? `Đã mua ${eligibility.days_since_purchase} ngày trước`
                        : "Trong thời hạn 30 ngày"}
                    </span>
                  </div>
                </div>

                {/* Rule 2: Progress <= 10% OR completed <= 5 */}
                <div className="flex items-start gap-2">
                  <span className={twMerge("font-bold", eligibility?.progress_eligible ? "text-emerald-600" : "text-rose-600")}>
                    {eligibility?.progress_eligible ? "✓" : "✕"}
                  </span>
                  <div>
                    <span className="font-bold text-gray-800">Điều kiện tiến độ (≤10% hoặc ≤5 bài): </span>
                    <span className="text-gray-600">
                      Tiến độ hiện tại: <strong>{eligibility?.progress_percentage ?? 0}%</strong> ({eligibility?.completed_lessons ?? 0} bài đã hoàn thành)
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Status Message */}
          {!isLoading && (
            <div>
              {isEligible ? (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold">
                    <span>🎉</span>
                    <span>Bạn đủ điều kiện nhận lại 100% học phí!</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed">
                    Khóa học thỏa mãn điều kiện tiến độ ≤10% (hoặc ≤5 bài) và nằm trong 30 ngày bảo hộ mua sắm.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-900 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 font-bold text-rose-700">
                    <span>⚠️</span>
                    <span>Khóa học KHÔNG ĐỦ ĐIỀU KIỆN hoàn tiền</span>
                  </div>
                  <ul className="list-disc list-inside text-[11px] text-rose-800 flex flex-col gap-1">
                    {eligibility?.reasons?.map((r: string, idx: number) => (
                      <li key={idx}>{r}</li>
                    )) || <li>Vui lòng kiểm tra lại tiến độ học tập hoặc thời hạn đơn hàng.</li>}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Reason Select */}
          {isEligible && (
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black text-gray-800 uppercase">Lý do hoàn tiền (Tùy chọn)</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-gray-300 text-xs font-medium text-gray-800 bg-white focus:outline-none focus:border-[#C0392B]"
              >
                <option value="Nội dung không phù hợp với nhu cầu">Nội dung không phù hợp với nhu cầu</option>
                <option value="Mua nhầm khóa học">Mua nhầm khóa học</option>
                <option value="Chất lượng bài giảng chưa đạt kỳ vọng">Chất lượng bài giảng chưa đạt kỳ vọng</option>
                <option value="Lý do cá nhân khác">Lý do cá nhân khác</option>
              </select>
            </div>
          )}

          {statusMsg && (
            <div className={twMerge("p-3 rounded-xl text-xs font-bold", isError ? "bg-rose-100 text-rose-700 border border-rose-300" : "bg-slate-900 text-white")}>
              {statusMsg}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-gray-300 text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all cursor-pointer"
            >
              Hủy bỏ
            </button>

            {isEligible && (
              <button
                type="button"
                onClick={() => refundMutation.mutate()}
                disabled={refundMutation.isPending}
                className="px-5 py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#A93226] text-white text-xs font-extrabold shadow-md transition-all disabled:opacity-50 cursor-pointer"
              >
                {refundMutation.isPending ? "Đang xử lý..." : "Xác Nhận & Hoàn Tiền Ngay"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
