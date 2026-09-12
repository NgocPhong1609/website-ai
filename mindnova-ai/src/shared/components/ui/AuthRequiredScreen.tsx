"use client";

import React from "react";
import Link from "next/link";
import { Lock } from "lucide-react";
import Button from "./Button";

interface AuthRequiredScreenProps {
  intendedUrl?: string;
}

export default function AuthRequiredScreen({ intendedUrl = "/progress" }: AuthRequiredScreenProps) {
  const loginUrl = intendedUrl ? `/login?callbackUrl=${encodeURIComponent(intendedUrl)}` : "/login";
  const registerUrl = intendedUrl ? `/login?mode=register&callbackUrl=${encodeURIComponent(intendedUrl)}` : "/login?mode=register";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full h-full text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-[#EFF6FF] flex items-center justify-center border border-[#DBEAFE] shadow-sm">
        <Lock className="w-12 h-12 text-[#3B82F6]" strokeWidth={1.5} aria-hidden />
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] mb-3">
        Bạn cần đăng nhập để sử dụng tính năng này
      </h1>
      
      <p className="text-[#475569] text-sm sm:text-base max-w-md mb-8">
        Hãy đăng nhập hoặc tạo tài khoản để tiếp tục sử dụng các công cụ học tập và quản lý của MindNova AI.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
        <Link href={loginUrl} className="w-full">
          <Button variant="primary" className="w-full py-3 text-base rounded-xl font-semibold shadow-md bg-gradient-to-r from-[#3B82F6] to-[#2563EB] border-none text-white hover:from-[#2563EB] hover:to-[#1D4ED8]">
            Đăng nhập
          </Button>
        </Link>
        <Link href={registerUrl} className="w-full">
          <Button variant="outline" className="w-full py-3 text-base rounded-xl font-semibold text-[#2563EB] border-[#DBEAFE] hover:bg-[#EFF6FF]">
            Đăng ký
          </Button>
        </Link>
      </div>
    </div>
  );
}
