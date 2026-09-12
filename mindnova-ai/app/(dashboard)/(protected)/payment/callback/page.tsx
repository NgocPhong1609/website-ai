import Link from "next/link";
import type { Metadata } from "next";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kết quả Thanh toán | MindNova AI",
  description: "Xác nhận kết quả thanh toán khóa học.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

function firstParam(value: string | string[] | undefined): string | undefined {
  if (Array.isArray(value)) return value[0];
  return value;
}

export default async function PaymentCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  const transactionId = firstParam(params.vnp_TxnRef || params.orderId || params.transaction_id);
  const vnpResponseCode = firstParam(params.vnp_ResponseCode);
  const momoResultCode = firstParam(params.resultCode);
  let isSuccess = false;
  let isPending = true;
  let courseId = firstParam(params.course_id);

  if (transactionId) {
    try {
      const apiUrl = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : "http://127.0.0.1:8000/api";
      const cookieStore = await cookies();
      const token =
        cookieStore.get("accessToken")?.value ||
        cookieStore.get("token")?.value ||
        cookieStore.get("auth_token")?.value ||
        cookieStore.get("access_token")?.value;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Accept: "application/json",
      };

      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const queryString = new URLSearchParams(
        Object.entries(params).reduce((acc, [key, value]) => {
          if (value !== undefined) {
            acc[key] = Array.isArray(value) ? value[0] : value;
          }
          return acc;
        }, {} as Record<string, string>),
      ).toString();

      const isVnPay = !!params.vnp_SecureHash;
      const isMomo = !!params.signature && params.orderId !== undefined && params.resultCode !== undefined;
      const endpoint = isVnPay
        ? `${apiUrl}/student/payments/callback/vnpay?${queryString}`
        : isMomo
          ? `${apiUrl}/student/payments/callback/momo?${queryString}`
          : `${apiUrl}/student/orders/transaction/${transactionId}`;

      const callbackRes = await fetch(endpoint, {
        method: "GET",
        headers,
        cache: "no-store",
      });

      if (callbackRes.ok) {
        const result = await callbackRes.json();
        if (result.data) {
          const paymentOrOrder = result.data;
          isSuccess = paymentOrOrder.status === "completed";
          isPending = paymentOrOrder.status === "pending";

          if (isSuccess && paymentOrOrder.metadata) {
            const metaCourseIds = paymentOrOrder.metadata.course_ids;
            if (metaCourseIds && metaCourseIds.length > 0) {
              courseId = courseId || String(metaCourseIds[0]);
            }
          }
        }
      }
    } catch (e) {
      console.error("Failed to process payment callback:", e);
    }
  }

  const gatewaySaidFail =
    (vnpResponseCode !== undefined && vnpResponseCode !== "00") ||
    (momoResultCode !== undefined && momoResultCode !== "0");
  if (!isSuccess && gatewaySaidFail) {
    isPending = false;
  }

  const title = isSuccess
    ? "Thanh toán Thành công!"
    : isPending
      ? "Đang chờ xác nhận thanh toán"
      : "Thanh toán chưa hoàn tất";

  const description = isSuccess
    ? "Cảm ơn bạn đã đăng ký khóa học. Hóa đơn của bạn đã được ghi nhận và khóa học đã được thêm vào lộ trình học tập."
    : isPending
      ? "Giao dịch vẫn đang chờ cổng thanh toán xác nhận. Nếu bạn đã bị trừ tiền, vui lòng đợi trong ít phút rồi kiểm tra lại Billing. Trạng thái không tự chuyển thành công khi bạn chỉ quay lại website."
      : "Giao dịch chưa thành công. Bạn có thể thử lại bằng một giao dịch mới trên cổng VNPAY hoặc MoMo.";

  const retryHref = courseId ? `/checkout?courseId=${courseId}` : "/billing";

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="bg-white rounded-3xl border border-[#E2E8F0] shadow-sm max-w-md w-full p-8 text-center flex flex-col items-center">
        <div
          className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm ${
            isSuccess ? "bg-[#D1FAE5] text-[#0F172A]" : "bg-[#EFF6FF] text-[#3B82F6]"
          }`}
        >
          {isSuccess ? "✓" : isPending ? "…" : "!"}
        </div>

        <h1 className="text-2xl font-bold text-[#0F172A] mb-3">{title}</h1>

        <p className="text-sm text-[#64748B] mb-8 leading-relaxed">{description}</p>

        <div className="w-full flex flex-col gap-3">
          <Link
            href={isSuccess ? (courseId ? `/courses/lesson?courseId=${courseId}` : "/study-plan") : "/billing"}
            className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#0F172A] shadow-md hover:shadow-lg transition-all text-center"
          >
            {isSuccess ? "Vào học ngay" : "Xem Billing"}
          </Link>
          {!isSuccess && (
            <Link
              href={retryHref}
              className="w-full py-3 rounded-xl text-sm font-semibold text-[#2563EB] bg-white border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-all text-center"
            >
              Thử lại thanh toán
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
