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

  if (isLoading) {
    return (
      <div className="p-6 min-h-[70vh] flex items-center justify-center">
        <Loader size="lg" text="Đang tải thông tin hóa đơn..." />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-red-500">
        Lỗi tải thông tin khóa học. Vui lòng thử lại.
      </div>
    );
  }

  const { header_info } = data;
  const isFree = Number(header_info.price) === 0;

  const handleCheckout = async () => {
    try {
      setIsProcessing(true);
      const methodToUse = isFree ? "free" : paymentMethod;
      const res = await checkoutService.createOrder([courseId], methodToUse);
      if (res.success) {
        if (isFree || !res.payment_url) {
           router.push(`/courses/lesson?courseId=${courseId}`);
        } else {
           window.location.href = res.payment_url;
        }
      } else {
        alert(res.message || "Có lỗi xảy ra khi tạo thanh toán.");
        setIsProcessing(false);
      }
    } catch (err) {
      console.error(err);
      alert("Lỗi kết nối đến cổng thanh toán.");
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full flex flex-col lg:flex-row gap-8">
      {/* Cột trái: Tóm tắt hóa đơn */}
      <div className="flex-1 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EAEAF4] p-6 shadow-sm">
          <h2 className="text-lg font-bold text-[#1A1A2E] mb-6 border-b border-[#F0F0F8] pb-4">
            Tóm tắt Đơn hàng
          </h2>
          
          <div className="flex gap-4 mb-6">
            {header_info.thumbnail ? (
              <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0 relative">
                <Image src={header_info.thumbnail} alt={header_info.title} fill className="object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-[#1E1B4B] to-[#4648D4] shrink-0" />
            )}
            <div>
              <h3 className="text-base font-bold text-[#1A1A2E] leading-snug mb-1">
                {header_info.title}
              </h3>
              <span className="inline-block px-2.5 py-1 bg-[#EEF2FF] text-[#5052EE] text-xs font-semibold rounded-lg">
                {header_info.level}
              </span>
            </div>
          </div>

          <div className="space-y-4 border-t border-[#F0F0F8] pt-4">
            <div className="flex justify-between text-sm text-[#64647A]">
              <span>Giá khóa học</span>
              <span className="font-semibold">{isFree ? "Miễn phí" : `${Number(header_info.price).toLocaleString()} VND`}</span>
            </div>
            <div className="flex justify-between text-sm text-[#64647A]">
              <span>Khuyến mãi (Giảm 0%)</span>
              <span className="font-semibold text-[#10B981]">- 0 VND</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#1A1A2E] pt-2 border-t border-[#EAEAF4]">
              <span>Tổng thanh toán</span>
              <span className="text-[#5052EE]">{isFree ? "Miễn phí" : `${Number(header_info.price).toLocaleString()} VND`}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cột phải: Phương thức thanh toán */}
      <div className="w-full lg:w-[400px] shrink-0 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EAEAF4] p-6 shadow-sm">
          {isFree ? (
            <>
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-6 border-b border-[#F0F0F8] pb-4">
                Nhận khóa học
              </h2>
              <div className="mb-6 space-y-2">
                <p className="text-[#64647A] text-sm">Khóa học này hoàn toàn miễn phí.</p>
                <p className="text-[#64647A] text-sm">Nhấn nút bên dưới để thêm khóa học vào tài khoản của bạn.</p>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? "Đang xử lý..." : "Nhận khóa học"}
                {!isProcessing && <span>➔</span>}
              </button>
            </>
          ) : (
            <>
              <h2 className="text-lg font-bold text-[#1A1A2E] mb-6 border-b border-[#F0F0F8] pb-4">
                Phương thức thanh toán
              </h2>
              
              <div className="space-y-3 mb-6">
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'vnpay' ? 'border-[#5052EE] bg-[#EEF2FF]/50 ring-1 ring-[#5052EE]/30' : 'border-[#EAEAF4] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="vnpay" checked={paymentMethod === 'vnpay'} onChange={() => setPaymentMethod('vnpay')} className="w-4 h-4 text-[#5052EE]" />
                  <div className="font-semibold text-sm text-[#1A1A2E]">Thanh toán qua VNPay</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-[#5052EE] bg-[#EEF2FF]/50 ring-1 ring-[#5052EE]/30' : 'border-[#EAEAF4] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="momo" checked={paymentMethod === 'momo'} onChange={() => setPaymentMethod('momo')} className="w-4 h-4 text-[#5052EE]" />
                  <div className="font-semibold text-sm text-[#1A1A2E]">Ví điện tử Momo</div>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${paymentMethod === 'banking' ? 'border-[#5052EE] bg-[#EEF2FF]/50 ring-1 ring-[#5052EE]/30' : 'border-[#EAEAF4] hover:bg-[#F8FAFC]'}`}>
                  <input type="radio" name="paymentMethod" value="banking" checked={paymentMethod === 'banking'} onChange={() => setPaymentMethod('banking')} className="w-4 h-4 text-[#5052EE]" />
                  <div className="font-semibold text-sm text-[#1A1A2E]">Chuyển khoản Ngân hàng</div>
                </label>
              </div>

              <button
                type="button"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4648D4] via-[#5052EE] to-[#0D9488] shadow-md hover:shadow-lg disabled:opacity-60 transition-all flex justify-center items-center gap-2"
              >
                {isProcessing ? "Đang xử lý..." : "Xác nhận Thanh toán"}
                {!isProcessing && <span>➔</span>}
              </button>
            </>
          )}
          <button
            type="button"
            onClick={() => router.back()}
            disabled={isProcessing}
            className="w-full mt-3 py-3 rounded-xl text-sm font-semibold text-[#64647A] bg-white border border-[#EAEAF4] hover:bg-[#F4F4FA] transition-all"
          >
            Quay lại
          </button>
        </div>
      </div>
    </div>
  );
}
