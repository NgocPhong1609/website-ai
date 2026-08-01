"use client";

import React from "react";
import { SidebarOpenButton } from "@/src/components/ui";

export function AdminTopbar() {
  return (
    <header className="h-16 w-full bg-white border-b border-gray-200 px-6 flex items-center justify-between shrink-0 shadow-2xs">
      <div className="flex items-center gap-4">
        {/* Sidebar Reopen Button */}
        <SidebarOpenButton />
        
        <div>
          <h1 className="text-[17px] font-bold text-[#111827]">
            Cổng quản trị MindNova
          </h1>
          <p className="text-[12px] text-[#6B7280] hidden sm:block">
            Vận hành và quản lý nội dung AI
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 px-3 py-1.5 bg-[#EEF2FF] border border-indigo-100 rounded-full">
          <div className="w-2 h-2 rounded-full bg-[#4F46E5] animate-pulse" />
          <span className="text-[12px] font-bold text-[#4F46E5]">System Online</span>
        </div>

        <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
          <div className="w-9 h-9 rounded-full bg-[#4F46E5] text-white flex items-center justify-center font-bold text-[13px] shadow-sm">
            AD
          </div>
          <div className="hidden md:block text-left">
            <p className="text-[13px] font-bold text-[#111827] leading-tight">Admin Principal</p>
            <p className="text-[11px] font-medium text-[#6B7280]">Quản trị viên</p>
          </div>
        </div>
      </div>
    </header>
  );
}
