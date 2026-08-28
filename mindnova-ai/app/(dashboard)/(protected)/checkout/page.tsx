import type { Metadata } from "next";
import { CheckoutView } from "@/src/features/student/checkout/components/CheckoutView";

export const metadata: Metadata = {
 title: "Thanh toán | MindNova AI",
 description: "Thanh toán khóa học an toàn và tiện lợi trên MindNova AI.",
};

type Props = {
 searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CheckoutPage({ searchParams }: Props) {
 const resolvedParams = await searchParams;
 const courseIdStr = resolvedParams.courseId;
 const courseId = courseIdStr ? parseInt(courseIdStr as string, 10) : 1;

 return (
 <div className="p-6 md:p-8 max-w-[1200px] mx-auto min-h-full">
 <div className="mb-8">
 <h1 className="text-2xl sm:text-3xl font-bold text-[#2C3039] tracking-tight">
 Thanh toán <span className="bg-[#2C3039] bg-clip-text text-transparent">Khóa học</span>
 </h1>
 <p className="text-sm text-[#8A8478] mt-2">
 Vui lòng kiểm tra lại thông tin đơn hàng và chọn phương thức thanh toán phù hợp.
 </p>
 </div>

 <CheckoutView courseId={courseId} />
 </div>
 );
}
