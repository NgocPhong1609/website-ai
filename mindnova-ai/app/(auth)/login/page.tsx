import type { Metadata } from "next";
import { LoginContainer } from "@/src/features/student/auth";

export const metadata: Metadata = {
 title: "Login",
 description:
 "Đăng nhập MindNova AI để tiếp tục lộ trình học tập cá nhân hóa của bạn.",
};

import { Suspense } from "react";

export default function LoginPage() {
 return (
 <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
 <LoginContainer />
 </Suspense>
 );
}
