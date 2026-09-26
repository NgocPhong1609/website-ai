import { ForgotPasswordFlow } from "@/src/features/student/auth/components/forgot-password/ForgotPasswordFlow";

export const metadata = {
 title: "Quên mật khẩu | MindNova AI",
 description: "Khôi phục mật khẩu tài khoản MindNova AI của bạn.",
};

export default function ForgotPasswordPage() {
 return (
 <div className="flex w-full h-screen bg-[#F7F7FB]">
 <div className="w-full flex items-center justify-center">
 <div className="bg-white shadow-xl rounded-2xl w-full max-w-md overflow-hidden">
 <ForgotPasswordFlow />
 </div>
 </div>
 </div>
 );
}
