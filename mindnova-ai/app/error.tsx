"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { XCircle } from "lucide-react";
import Button from "@/src/shared/components/ui/Button";

interface ErrorProps {
 error: Error & { digest?: string };
 reset: () => void;
}

function AlertCircleIcon() {
 return (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
 );
}

export default function GlobalError({ error, reset }: ErrorProps) {
 const router = useRouter();

 useEffect(() => {
  // Log to an error reporting service in production (e.g., Sentry)
  console.error("[GlobalError]:", error);
 }, [error]);

 const isUnauthorized = error.message?.includes("401") || error.message?.includes("Unauthorized");

 if (isUnauthorized) {
  return (
   <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm">
    <div className="w-full max-w-[422px] rounded-xl bg-white p-8 text-center shadow-xl">
     <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-red-50 border border-red-100 text-red-500">
      <XCircle className="w-10 h-10" />
     </div>
     <h2 className="mb-2 text-[22px] font-bold text-gray-900">Yêu cầu đăng nhập</h2>
     <p className="mb-8 text-base text-gray-500">
      Phiên đăng nhập đã hết hạn hoặc bạn chưa đăng nhập. Vui lòng đăng nhập lại để tiếp tục sử dụng.
     </p>
     <div className="flex flex-col gap-3">
      <Button
       onClick={() => router.push("/login")}
       className="w-full rounded-lg bg-blue-600 px-4 py-3 text-base font-semibold text-white hover:bg-blue-700"
      >
       Đi đến Đăng nhập
      </Button>
     </div>
    </div>
   </div>
  );
 }

 return (
  <div className="flex min-h-100 w-full flex-col items-center justify-center px-6 py-12 text-center sm:min-h-[600px]">
   <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#EFF6FF] text-[#3B82F6] shadow-sm">
    <AlertCircleIcon />
   </div>

   <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
    Đã có lỗi xảy ra!
   </h2>

   <p className="mt-3 max-w-md text-sm text-gray-500">
    Hệ thống gặp sự cố không mong muốn trong quá trình xử lý dữ liệu. Vui
    lòng thử tải lại trang hoặc quay lại sau.
   </p>

   {error.digest && (
    <code className="mt-4 rounded bg-gray-100 px-2 py-1 text-xs font-mono text-gray-600">
     Error ID: {error.digest}
    </code>
   )}

   <div className="mt-8 flex flex-col gap-3 sm:flex-row">
    <Button
     onClick={reset}
     className="rounded-lg bg-[#3B82F6] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#2563EB]"
    >
     Thử lại một lần nữa
    </Button>
    <Button
     variant="outline"
     onClick={() => router.push("/")}
     className="rounded-lg px-5 py-2.5 text-sm font-semibold"
    >
     Quay về Trang chủ
    </Button>
   </div>
  </div>
 );
}
