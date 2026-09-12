"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useGetCourseDetail } from "../../courses/api";
import { checkoutService } from "../services/checkout.service";
import { useGetPaymentMethods } from "../../billing/api";
import { Ticket, AlertTriangle, Gift, PartyPopper, Sparkles } from "lucide-react";
import { Loader } from "@/src/shared/components/ui/Loader";
import toast from "react-hot-toast";

export function CheckoutView({ courseId }: { courseId: number }) {
  const router = useRouter();
  const { data, isLoading, isError } = useGetCourseDetail(courseId);
  const [paymentMethod, setPaymentMethod] = useState<string>("vnpay");
  const [savedMethodId, setSavedMethodId] = useState<number | null>(null);
  const [confirmAccount, setConfirmAccount] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { data: savedMethods = [] } = useGetPaymentMethods();

  useEffect(() => {
    const preferred = savedMethods.find((method) => method.is_default) ?? savedMethods[0];
    if (preferred && savedMethodId === null) {
      setSavedMethodId(preferred.id);
    }
  }, [savedMethods, savedMethodId]);

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
      <div className="p-6 text-center text-[#3B82F6] font-bold">
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
        toast("Bạn cần đăng nhập để nhận khóa học hoặc thanh toán.");
        router.push("/login");
        return;
      }

      if (!isEffectiveFree && savedMethods.length > 0) {
        if (!savedMethodId) {
          toast.error("Vui lòng chọn tài khoản đã lưu.");
          setIsProcessing(false);
          return;
        }
        if (!confirmAccount) {
          toast.error("Hãy xác nhận tài khoản thanh toán trước khi tiếp tục.");
          setIsProcessing(false);
          return;
        }
      }

      const selected = savedMethods.find((method) => method.id === savedMethodId);
      const methodToUse = isEffectiveFree ? "free" : (selected?.provider || paymentMethod);
      const res = await checkoutService.createOrder([courseId], methodToUse, appliedCoupon?.code, savedMethodId || undefined);

      if (res.success) {
        if (isEffectiveFree || !res.payment_url) {
          toast.success("🎉 Chúc mừng! Bạn đã nhận khóa học thành công.");
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
            toast.error("Lỗi Dev mock payment");
            setIsProcessing(false);
            return;
          }
        }

        window.location.href = res.payment_url;
        return;
      }

      toast.error(res.message || "Có lỗi xảy ra khi tạo thanh toán.");
      setIsProcessing(false);
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối đến cổng thanh toán. Vui lòng thử lại sau.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      {/* Cột trái: Tóm tắt hóa đơn & Nhập mã giảm giá */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#0F172A] mb-6 border-b border-[#F0F0F8] pb-4">
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
              <h3 className="text-base font-bold text-[#0F172A] leading-snug mb-1">
                {header_info.title}
              </h3>
              <span className="inline-block px-2.5 py-1 bg-[#F8FAFC] text-[#3B82F6] text-xs font-bold rounded-lg border border-[#E2E8F0]">
                {header_info.level}
              </span>
            </div>
          </div>

          {/* Ô nhập mã giảm giá (Coupon input) */}
          <div className="border-t border-[#F0F0F8] pt-5 mb-6">
            <label className="text-xs font-black uppercase text-[#0F172A] tracking-wider flex items-center gap-1.5 mb-2">
              <Ticket size={16} /> Mã giảm giá / Khuyến mãi
            </label>

            {appliedCoupon ? (
              <div className="p-4 rounded-2xl bg-[#E8F8F0] border border-[#27AE60]/20 flex items-center justify-between gap-3 shadow-2xs">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0F172A]">
                  <span className="px-2.5 py-1 rounded-lg bg-[#27AE60] text-white font-mono text-xs font-black uppercase shadow-2xs">
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
                  className="text-xs font-extrabold text-[#3B82F6] hover:text-[#2563EB] underline cursor-pointer"
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
                  className="flex-1 px-4 py-2.5 rounded-xl text-xs font-bold border border-[#E2E8F0] focus:border-[#3B82F6] focus:ring-2 focus:ring-[#3B82F6]/20 outline-none uppercase text-[#0F172A]"
                />
                <button
                  type="submit"
                  disabled={isApplyingCoupon || !couponCodeInput.trim()}
                  className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-[#3B82F6] hover:bg-[#2563EB] disabled:opacity-50 transition-all cursor-pointer shrink-0 shadow-2xs"
                >
                  {isApplyingCoupon ? "Đang kiểm tra..." : "Áp dụng"}
                </button>
              </form>
            )}

            {couponError && (
              <p className="mt-2 text-xs font-bold text-[#3B82F6] bg-[#EFF6FF] p-2.5 rounded-xl border border-[#3B82F6]/20 flex items-center gap-1.5">
                <AlertTriangle size={14} /> {couponError}
              </p>
            )}
          </div>

          {/* Chi tiết chi phí */}
          <div className="space-y-3 border-t border-[#F0F0F8] pt-4">
            <div className="flex justify-between text-sm text-[#64748B]">
              <span>Giá khóa học gốc</span>
              <span className="font-semibold">{originalPrice === 0 ? "Miễn phí" : `${originalPrice.toLocaleString()} VND`}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-sm text-[#27AE60] font-bold">
                <span>Khuyến mãi ({appliedCoupon.code})</span>
                <span>- {discountAmount.toLocaleString()} VND</span>
              </div>
            )}

            <div className="flex justify-between text-lg font-bold text-[#0F172A] pt-2 border-t border-[#E2E8F0]">
              <span>Tổng thanh toán</span>
              <span className="text-[#3B82F6]">
                {isEffectiveFree ? "0 VND (Miễn phí)" : `${finalTotal.toLocaleString()} VND`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Phương thức thanh toán hoặc nhận khóa học */}
      <div className="w-full lg:w-[400px] shrink-0 space-y-6">
        <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm">
          {isEffectiveFree ? (
            <>
              <h2 className="text-lg font-bold text-[#0F172A] mb-4 border-b border-[#F0F0F8] pb-4 flex items-center gap-2">
                <Gift size={20} className="text-[#3B82F6]" /> Nhận khóa học Miễn phí
              </h2>
              <div className="mb-6 space-y-2.5 p-4 rounded-xl bg-[#E8F8F0] border border-[#27AE60]/20">
                <p className="text-[#27AE60] text-xs font-bold leading-relaxed flex items-start gap-1.5">
                  {appliedCoupon ? (
                    <>
                      <PartyPopper size={14} className="shrink-0 mt-0.5" />
                      <span>Mã giảm giá "{appliedCoupon.code}" đã giảm 100% học phí! Bạn được nhận khóa học này hoàn toàn miễn phí.</span>
                    </>
                  ) : (
                    "Khóa học này hoàn toàn miễn phí."
                  )}
                </p>
                <p className="text-[#64748B] text-xs font-medium">
                  Nhấn nút bên dưới để thêm ngay khóa học vào tài khoản của bạn.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl text-sm font-black text-white bg-[#27AE60] hover:bg-[#1f8749] shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isProcessing ? "Đang xử lý..." : <><Sparkles size={16} /> Xác nhận Nhận khóa học ngay</>}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#0F172A] mb-6 border-b border-[#F0F0F8] pb-4">
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-3 mb-6">
                {savedMethods.length > 0 ? (
                  <>
                    {savedMethods.map((method) => (
                      <label key={method.id} className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${savedMethodId === method.id ? "border-[#3B82F6] bg-[#F8FAFC] ring-1 ring-[#3B82F6]/30" : "border-[#E2E8F0] hover:bg-[#F8FAFC]"}`}>
                        <input type="radio" name="savedMethod" checked={savedMethodId === method.id} onChange={() => { setSavedMethodId(method.id); setConfirmAccount(false); }} className="w-4 h-4 text-[#3B82F6]" />
                        <div>
                          <div className="font-semibold text-sm text-[#0F172A]">{method.label}</div>
                          <div className="text-xs text-[#64748B]">{method.provider.toUpperCase()}</div>
                        </div>
                      </label>
                    ))}
                    <label className="flex items-center gap-2 text-xs font-semibold text-[#0F172A]">
                      <input type="checkbox" checked={confirmAccount} onChange={(e) => setConfirmAccount(e.target.checked)} />
                      Xác nhận dùng tài khoản đã chọn để thanh toán
                    </label>
                  </>
                ) : (
                  <>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-[#3B82F6] bg-[#F8FAFC] ring-1 ring-[#3B82F6]/30' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 text-[#3B82F6]" />
                  <div className="font-semibold text-sm text-[#0F172A]">Thanh toán qua VNPay</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-[#3B82F6] bg-[#F8FAFC] ring-1 ring-[#3B82F6]/30' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-4 h-4 text-[#3B82F6]" />
                  <div className="font-semibold text-sm text-[#0F172A]">Ví điện tử Momo</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-[#3B82F6] bg-[#F8FAFC] ring-1 ring-[#3B82F6]/30' : 'border-[#E2E8F0] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="w-4 h-4 text-[#3B82F6]" />
                  <div className="font-semibold text-sm text-[#0F172A]">Chuyển khoản Ngân hàng</div>
                </label>
                  </>
                )}
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#3B82F6] shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex justify-center items-center gap-2 cursor-pointer"
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận Thanh toán"}
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => router.back()}
            disabled={isProcessing}
            className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-[#64748B] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all cursor-pointer"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
