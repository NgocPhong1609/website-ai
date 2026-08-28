"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface AdminErrorProps {
 error: Error & { digest?: string };
 reset: () => void;
}

export default function AdminError({ error, reset }: AdminErrorProps) {
 const router = useRouter();

 useEffect(() => {
 if (error.message.includes("Unauthorized (401)")) {
 window.localStorage.removeItem("accessToken");
 document.cookie = "accessToken=; Max-Age=0; path=/";
 router.replace("/login");
 }
 }, [error, router]);

 return (
 <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 p-6 text-center">
 <h2 className="text-xl font-semibold text-slate-900">Không thể tải dữ liệu quản trị</h2>
 <p className="max-w-xl text-sm text-slate-600">{error.message}</p>
 <div className="flex items-center gap-3">
 <button
 type="button"
 onClick={reset}
 className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
 >
 Thử lại
 </button>
 <button
 type="button"
 onClick={() => router.replace("/login")}
 className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
 >
 Đăng nhập lại
 </button>
 </div>
 </div>
 );
}
