"use client";

import React from "react";
import Link from "next/link";
import Button from "./Button";

interface AuthRequiredScreenProps {
  intendedUrl?: string;
}

export default function AuthRequiredScreen({ intendedUrl = "/progress" }: AuthRequiredScreenProps) {
  const loginUrl = intendedUrl ? `/login?callbackUrl=${encodeURIComponent(intendedUrl)}` : "/login";
  const registerUrl = intendedUrl ? `/register?callbackUrl=${encodeURIComponent(intendedUrl)}` : "/register";

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 w-full h-full text-center">
      <div className="w-24 h-24 mb-6 rounded-full bg-[#EEF2FF] flex items-center justify-center border border-[#6B6BFF]/20 shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-[#6B6BFF]">
          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
        </svg>
      </div>

      <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A2E] mb-3">
        🔐 Bạn cần đăng nhập để sử dụng tính năng này
      </h1>
      
      <p className="text-[#64647A] text-sm sm:text-base max-w-md mb-8">
        Hãy đăng nhập hoặc tạo tài khoản để tiếp tục sử dụng các công cụ học tập và quản lý của MindNova AI.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-sm">
        <Link href={loginUrl} className="w-full">
          <Button variant="primary" className="w-full py-3 text-base rounded-xl font-semibold shadow-md bg-gradient-to-r from-[#6B6BFF] to-[#4CD7F6] border-none text-white hover:brightness-105">
            Đăng nhập
          </Button>
        </Link>
        <Link href={registerUrl} className="w-full">
          <Button variant="outline" className="w-full py-3 text-base rounded-xl font-semibold text-[#4648D4] border-[#6B6BFF]/30 hover:bg-[#EEF2FF]">
            Đăng ký
          </Button>
        </Link>
      </div>
    </div>
  );
}
