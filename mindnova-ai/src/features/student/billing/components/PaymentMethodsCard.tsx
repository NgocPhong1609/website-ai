"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import { axiosClient } from "@/src/shared/lib/axios";
import { useGetBilling } from "../api";
import { GatewayPaymentMethods, type GatewayId } from "./GatewayPaymentMethods";

export function PaymentMethodsCard() {
  const router = useRouter();
  const { data } = useGetBilling();
  const [gateway, setGateway] = useState<GatewayId>("vnpay");
  const [isProcessing, setIsProcessing] = useState(false);

  const pendingOrder = (data?.orders ?? []).find(
    (order) => order.status === "pending" && Number(order.total_amount) > 0,
  );

  async function handleContinue() {
    if (isProcessing) return;
    setIsProcessing(true);

    try {
      if (pendingOrder) {
        const { data: res } = await axiosClient.post(`/api/student/orders/${pendingOrder.id}/pay`, {
          payment_method: gateway,
        });
        if (res?.payment_url) {
          window.location.href = res.payment_url;
          return;
        }
        toast.error(res?.message || "Không tạo được liên kết thanh toán. Vui lòng thử lại.");
        setIsProcessing(false);
        return;
      }

      toast("Chọn khóa học để thanh toán qua VNPAY hoặc MoMo. Website không lưu số tài khoản hay thẻ.");
      router.push("/explore");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Không thể tiếp tục thanh toán.");
      setIsProcessing(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white border border-[#EAEAF4] shadow-2xs p-6 flex flex-col gap-5 transition-all duration-300 hover:shadow-sm">
      <div className="flex items-start justify-between gap-4 border-b border-[#F0F2FA] pb-4">
        <div>
          <h2 className="text-base font-semibold text-[#0f172a] flex items-center gap-2 flex-wrap">
            <span>Phương thức thanh toán</span>
            <span className="text-[11px] font-medium text-[#2563eb] bg-[#EFF6FF] px-2.5 py-0.5 rounded-full border border-[#2563eb]/20 flex items-center">
              <ShieldCheck size={12} className="mr-1" /> VNPAY &amp; MoMo
            </span>
          </h2>
          <p className="text-xs font-normal text-[#64748b] mt-1">
            Thanh toán được xử lý trực tiếp trên cổng VNPAY hoặc ví MoMo. MindNova không lưu số thẻ, CVV, OTP hay số tài khoản ngân hàng.
          </p>
        </div>
      </div>

      <GatewayPaymentMethods value={gateway} onChange={setGateway} name="billingGateway" />

      {pendingOrder && (
        <p className="text-xs text-[#2563eb] bg-[#EFF6FF] border border-[#2563eb]/20 rounded-xl px-3 py-2">
          Bạn có đơn hàng đang chờ ({pendingOrder.transaction_id}). Tiếp tục sẽ mở lại cổng thanh toán với giao dịch mới.
        </p>
      )}

      <button
        type="button"
        onClick={handleContinue}
        disabled={isProcessing}
        className="w-full py-3 rounded-xl text-sm font-bold text-white bg-[#3B82F6] hover:bg-[#2563EB] shadow-md disabled:opacity-60 transition-all cursor-pointer"
      >
        {isProcessing ? "Đang xử lý..." : "Tiếp tục thanh toán"}
      </button>
    </div>
  );
}
