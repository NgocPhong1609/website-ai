import Link from "next/link";
import type { Metadata } from "next";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export const metadata: Metadata = {
  title: "Kết quả Thanh toán | MindNova AI",
  description: "Xác nhận kết quả thanh toán khóa học.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  
  // Get transaction ID from various payment gateways
  const transactionId = (params.vnp_TxnRef || params.orderId || params.transaction_id) as string;
  let isSuccess = false;
  let courseId = params.course_id as string;

  if (transactionId) {
    try {
      const apiUrl = process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api` : "http://127.0.0.1:8000/api";
      const cookieStore = await cookies();
      const token = cookieStore.get('accessToken')?.value;

      const headers: HeadersInit = {
        "Content-Type": "application/json",
        "Accept": "application/json",
      };
      
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const res = await fetch(`${apiUrl}/student/orders/transaction/${transactionId}`, { 
        method: "GET",
        headers,
        cache: "no-store" 
      });

      if (res.ok) {
        const result = await res.json();
        if (result.success && result.data) {
          const order = result.data;
          isSuccess = order.status === "completed";
          
          if (isSuccess && order.order_items && order.order_items.length > 0) {
             // Prefer courseId from order items if not in query
             courseId = courseId || order.order_items[0].course_id;
          }
        }
      }
      
      // Clear cache Next.js để trang My Courses và Explore fetch lại dữ liệu mới nhất
      if (isSuccess) {
        revalidatePath("/courses", "page");
        revalidatePath("/explore", "page");
        revalidatePath("/study-plan", "page");
      }
    } catch (e) {
      console.error("Failed to check order status:", e);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-sm max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm ${isSuccess ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
          {isSuccess ? '🎉' : '❌'}
        </div>
        
        <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">
          {isSuccess ? 'Thanh toán Thành công!' : 'Thanh toán đang xử lý hoặc thất bại'}
        </h1>
        
        <p className="text-sm text-[#64647A] mb-8 leading-relaxed">
          {isSuccess 
            ? 'Cảm ơn bạn đã đăng ký khóa học. Hóa đơn của bạn đã được ghi nhận và khóa học đã được thêm vào lộ trình học tập.' 
            : 'Giao dịch của bạn chưa được hoàn tất hoặc đang chờ xử lý từ ngân hàng. Nếu bạn đã bị trừ tiền, vui lòng chờ trong ít phút.'}
        </p>

        <Link
          href={isSuccess ? (courseId ? `/courses/lesson?courseId=${courseId}` : "/study-plan") : "/explore"}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4648D4] to-[#0D9488] shadow-md hover:shadow-lg transition-all"
        >
          {isSuccess ? 'Vào học ngay' : 'Quay lại khám phá'}
        </Link>
      </div>
    </div>
  );
}
