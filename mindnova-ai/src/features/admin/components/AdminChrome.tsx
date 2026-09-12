"use client";

import { useState, type ReactNode } from "react";
import { AdminSidebar } from "@/src/features/admin/components/AdminSidebar";
import { AdminTopbar } from "@/src/features/admin/components/AdminTopbar";

export function AdminChrome({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="relative flex h-[calc(100vh-1.5rem)] overflow-hidden rounded-[20px] border border-slate-200/80 bg-white/75 shadow-[0_35px_90px_-40px_rgba(15,23,42,0.5)] backdrop-blur-xl sm:rounded-[30px]">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Đóng menu"
          className="absolute inset-0 z-30 bg-slate-900/40 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div
        className={`absolute inset-y-0 left-0 z-40 h-full transition-transform duration-200 lg:static lg:translate-x-0 ${
          mobileNavOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <AdminTopbar onOpenNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-[linear-gradient(180deg,rgba(255,255,255,0.3),rgba(241,245,249,0.5))]">
          {children}
        </main>
      </div>
    </div>
  );
}
