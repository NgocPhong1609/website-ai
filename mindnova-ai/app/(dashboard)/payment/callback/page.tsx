import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kết quả Thanh toán | MindNova AI",
  description: "Xác nhận kết quả thanh toán khóa học.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PaymentCallbackPage({ searchParams }: Props) {
  const params = await searchParams;
  
  // VNPay trả về vnp_ResponseCode
  const responseCode = params.vnp_ResponseCode as string;
  const isSuccess = responseCode === "00";

  return (
    <div className="flex items-center justify-center min-h-[80vh] p-6">
      <div className="bg-white rounded-3xl border border-[#EAEAF4] shadow-sm max-w-md w-full p-8 text-center flex flex-col items-center">
        <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 text-4xl shadow-sm ${isSuccess ? 'bg-[#D1FAE5] text-[#10B981]' : 'bg-[#FEE2E2] text-[#EF4444]'}`}>
          {isSuccess ? '🎉' : '❌'}
        </div>
        
        <h1 className="text-2xl font-bold text-[#1A1A2E] mb-3">
          {isSuccess ? 'Thanh toán Thành công!' : 'Thanh toán Thất bại'}
        </h1>
        
        <p className="text-sm text-[#64647A] mb-8 leading-relaxed">
          {isSuccess 
            ? 'Cảm ơn bạn đã đăng ký khóa học. Hóa đơn của bạn đã được ghi nhận và khóa học đã được thêm vào lộ trình học tập.' 
            : 'Đã có lỗi xảy ra trong quá trình xử lý giao dịch. Vui lòng kiểm tra lại số dư hoặc thử lại sau.'}
        </p>

        <Link
          href={isSuccess ? "/study-plan" : "/explore"}
          className="w-full py-3.5 rounded-xl text-sm font-bold text-white bg-gradient-to-r from-[#4648D4] to-[#0D9488] shadow-md hover:shadow-lg transition-all"
        >
          {isSuccess ? 'Vào học ngay' : 'Quay lại khám phá'}
        </Link>
      </div>
    </div>
  );
}
