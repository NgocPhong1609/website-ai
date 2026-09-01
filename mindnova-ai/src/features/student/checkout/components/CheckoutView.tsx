"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCourseDetail } from "../../courses/api";
import { checkoutService } from "../services/checkout.service";
import { Loader } from "@/src/shared/components/ui/Loader";

export function CheckoutView({ courseId }: { courseId: number }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCourseDetail(courseId);
  const [paymentMethod, setPaymentMethod] = useState<string>("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  // Coupon states
  const [couponCodeInput, setCouponCodeInput] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [appliedCoupon, setAppliedCoupon] = useState<{
    code: string;
    type: "percent" | "fixed";
    value: number;
    discount_amount: number;
    original_price: number;
    final_price: number;
    is_free: boolean;
  } | null>(null);

  if (isLoading) {
    return (
      <div className="p-6 min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Đang tải thông tin hóa đơn..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-red-500 font-bold">
        Lỗi tải thông tin khóa học. Vui lòng thử lại.
      </div>
    );
  }

  const { header_info } = data;
  const originalPrice = Number(header_info.price) || 0;
  const discountAmount = appliedCoupon ? appliedCoupon.discount_amount : 0;
  const finalTotal = appliedCoupon ? appliedCoupon.final_price : originalPrice;
  const isEffectiveFree = finalTotal <= 0;

  const handleApplyCoupon = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!couponCodeInput.trim()) return;

    setIsApplyingCoupon(true);
    setCouponError(null);

    const res = await checkoutService.applyCoupon(couponCodeInput.trim(), courseId);

    if (res.success && res.data) {
      setAppliedCoupon(res.data);
      setCouponCodeInput("");
    } else {
      setCouponError(res.message || "Mã giảm giá không hợp lệ.");
    }
    setIsApplyingCoupon(false);
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);

      const hasToken = typeof window !== "undefined" && !!(window.localStorage.getItem("accessToken") || document.cookie.includes("accessToken="));
      if (!hasToken) {
        setIsProcessing(false);
        alert("Bạn cần đăng nhập để nhận khóa học hoặc thanh toán.");
        router.push("/login");
        return;
      }

      const methodToUse = isEffectiveFree ? "free" : paymentMethod;
      const res = await checkoutService.createOrder([courseId], methodToUse, appliedCoupon?.code);

      if (res.success) {
        if (isEffectiveFree || !res.payment_url) {
          alert("🎉 Chúc mừng! Bạn đã nhận khóa học thành công.");
          router.replace(`/courses/detail?courseId=${courseId}`);
          return;
        }

        if (!res.payment_url && process.env.NODE_ENV === "development") {
          try {
            // @ts-ignore
            await checkoutService.devCompleteOrder(res.data.id);
            // @ts-ignore
            router.push(`/payment/callback?orderId=${res.data.transaction_id}&course_id=${courseId}`);
            return;
          } catch (e) {
            console.error("Mock payment failed:", e);
            alert("Lỗi Dev mock payment");
            setIsProcessing(false);
            return;
          }
        }

        window.location.href = res.payment_url;
        return;
      }

      alert(res.message || "Có lỗi xảy ra khi tạo thanh toán.");
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến cổng thanh toán. Vui lòng thử lại sau.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      {/* Cột trái: Tóm tắt hóa đơn & Nhập mã giảm giá */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#2C3039] mb-6 border-b border-[#F0F0F8] pb-4">
            Tóm tắt Đơn hàng
          </h2>
          
          <div className="flex gap-4 mb-6">
            {header_info.thumbnail ? (
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative border border-gray-100">
                <Image src={header_info.thumbnail} alt={header_info.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl bg-slate-100 shrink-0" />
            )}
            <div>
              <h3 className="text-base font-bold text-[#2C3039] leading-snug mb-1">
                {header_info.title}
              </h3>
              <span className="inline-block px-2.5 py-1 bg-[#FAF7F2] text-[#C0392B] text-xs font-bold rounded-lg border border-[#E8E2D9]">
                {header_info.level}
              </span>
            </div>
          </div>

          {/* Ô nhập mã giảm giá (Coupon input) */}
          <div className="border-t border-[#F0F0F8] pt-5 mb-6">
            <label className="text-xs font-black uppercase text-[#2C3039] tracking-wider block mb-2">
              🎟️ Mã giảm giá / Khuyến mãi
            </label>

            {appliedCoupon ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-950">
                  <span className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-mono text-xs font-black uppercase shadow-2xs">
                    {appliedCoupon.code}
                  </span>
                  <span>
                    {appliedCoupon.type === "percent"
                      ? `Giảm ${appliedCoupon.value}%`
                      : `Giảm ${appliedCoupon.discount_amount.toLocaleString()} VND`}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveCoupon}
                  className="text-xs font-extrabold text-rose-600 hover:text-rose-800 underline cursor-pointer"
                >
                  Hủy bỏ mã
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponCodeInput}
                  onChange={(e) => {
                    setCouponCodeInput(e.target.value.toUpperCase());
                    if (couponError) setCouponError(null);
                  }}
                  placeholder="Nhập mã giảm giá (VD: TEST)..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#E8E2D9] focus:border-[#C0392B] focus:ring-2 focus:ring-[#C0392B]/20 outline-none uppercase text-[#2C3039]"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponCodeInput.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#C0392B] hover:bg-[#a02c20] disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-2xs"
                >
                  {isApplyingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </form>
            )}

            {couponError && (
              <p className="mt-2 text-xs font-bold text-rose-600 bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                ⚠️ {couponError}
              </p>
            )}
          </div>

          {/* Chi tiết chi phí */}
          <div className="space-y-3 border-t border-[#F0F0F8] pt-4">
            <div className="flex justify-between text-sm text-[#8A8478]">
              <span>Giá khóa học gốc</span>
              <span className="font-semibold">{originalPrice === 0 ? "Miễn phí" : `${originalPrice.toLocaleString()} VND`}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-sm text-emerald-700 font-bold">
                <span>Khuyến mãi ({appliedCoupon.code})</span>
                <span>- {discountAmount.toLocaleString()} VND</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-[#2C3039] pt-2 border-t border-[#E8E2D9]">
              <span>Tổng thanh toán</span>
              <span className="text-[#C0392B]">
                {isEffectiveFree ? "0 VND (Miễn phí)" : `${finalTotal.toLocaleString()} VND`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Phương thức thanh toán hoặc nhận khóa học */}
      <div className="w-full lg:w-[400px] shrink-0 space-y-6">
        <div className="bg-white rounded-2xl border border-[#E8E2D9] p-6 shadow-sm">
          {isEffectiveFree ? (
            <>
              <h2 className="text-lg font-bold text-[#2C3039] mb-4 border-b border-[#F0F0F8] pb-4">
                🎁 Nhận khóa học Miễn phí
              </h2>
              <div className="mb-6 space-y-2.5 p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-emerald-900 text-xs font-bold leading-relaxed">
                  {appliedCoupon
                    ? `🎉 Mã giảm giá "${appliedCoupon.code}" đã giảm 100% học phí! Bạn được nhận khóa học này hoàn toàn miễn phí.`
                    : "Khóa học này hoàn toàn miễn phí."}
                </p>
                <p className="text-slate-600 text-xs font-medium">
                  Nhấn nút bên dưới để thêm ngay khóa học vào tài khoản của bạn.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl text-sm font-black text-white bg-emerald-600 hover:bg-emerald-700 shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isProcessing ? "Đang xử lý..." : "✨ Xác nhận Nhận khóa học ngay"}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#2C3039] mb-6 border-b border-[#F0F0F8] pb-4">
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-3 mb-6">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-[#C0392B] bg-[#FAF7F2] ring-1 ring-[#C0392B]/30' : 'border-[#E8E2D9] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 text-[#C0392B]" />
                  <div className="font-semibold text-sm text-[#2C3039]">Thanh toán qua VNPay</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-[#C0392B] bg-[#FAF7F2] ring-1 ring-[#C0392B]/30' : 'border-[#E8E2D9] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-4 h-4 text-[#C0392B]" />
                  <div className="font-semibold text-sm text-[#2C3039]">Ví điện tử Momo</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-[#C0392B] bg-[#FAF7F2] ring-1 ring-[#C0392B]/30' : 'border-[#E8E2D9] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="w-4 h-4 text-[#C0392B]" />
                  <div className="font-semibold text-sm text-[#2C3039]">Chuyển khoản Ngân hàng</div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#C0392B] shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận Thanh toán"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isProcessing}
            className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-[#8A8478] bg-white border border-[#E8E2D9] hover:bg-[#FAF7F2] transition-all cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
