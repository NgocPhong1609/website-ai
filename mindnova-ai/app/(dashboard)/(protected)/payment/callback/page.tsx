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

export default async function PaymentCallbackPage({ searchParams }: Props) {
 const params = await searchParams;
 const transactionId = (params.vnp_TxnRef || params.orderId || params.transaction_id) as string;
 let isSuccess = false;
 let courseId = params.course_id as string;

 if (transactionId) {
 try {
 const apiUrl = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : "http://127.0.0.1:8000/api";
 const cookieStore = await cookies();
 // Quét tất cả các tên cookie khả dụng trong hệ thống
 const token = 
 cookieStore.get("accessToken")?.value ||
 cookieStore.get("token")?.value ||
 cookieStore.get("auth_token")?.value ||
 cookieStore.get("access_token")?.value;

 const headers: HeadersInit = {
 "Content-Type": "application/json",
 "Accept": "application/json",
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
 }, {} as Record<string, string>)
 ).toString();

 const isVnPay = !!params.vnp_SecureHash;
 const endpoint = isVnPay 
 ? `${apiUrl}/student/payments/callback/vnpay?${queryString}&current_user_id=201`
 : `${apiUrl}/student/orders/transaction/${transactionId}`;

 const callbackRes = await fetch(endpoint, { 
 method: "GET",
 headers,
 cache: "no-store" 
 });

 if (callbackRes.ok) {
 const result = await callbackRes.json();
 if (result.data) {
 const paymentOrOrder = result.data;
 isSuccess = paymentOrOrder.status === "completed";

 if (isSuccess && payment.metadata) {
 const metaCourseIds = payment.metadata.course_ids;
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

 return (
 <div className="flex items-center justify-center min-h-[80vh] p-6">
 <div className="bg-white rounded-3xl border border-[#E8E2D9] shadow-sm max-w-md w-full p-8 text-center flex flex-col items-center">
 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm ${isSuccess ? "bg-[#D1FAE5] text-[#2C3039]" : "bg-[#FEE2E2] text-[#EF4444]"}`}>
 {isSuccess ? "" : ""}
 </div>

 <h1 className="text-2xl font-bold text-[#2C3039] mb-3">
 {isSuccess ? "Thanh toán Thành công!" : "Thanh toán đang xử lý hoặc thất bại"}
 </h1>

 <p className="text-sm text-[#8A8478] mb-8 leading-relaxed">
 {isSuccess
 ? "Cảm ơn bạn đã đăng ký khóa học. Hóa đơn của bạn đã được ghi nhận và khóa học đã được thêm vào lộ trình học tập."
 : "Giao dịch của bạn chưa được hoàn tất hoặc đang chờ xử lý từ ngân hàng. Nếu bạn đã bị trừ tiền, vui lòng chờ trong ít phút."}
 </p>

 <Link
 href={isSuccess ? (courseId ? `/courses/lesson?courseId=${courseId}` : "/study-plan") : "/explore"}
 className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-[#2C3039] shadow-md hover:shadow-lg transition-all"
 >
 {isSuccess ? "Vào học ngay" : "Quay lại khám phá"}
 </Link>
 </div>
 </div>
 );
}