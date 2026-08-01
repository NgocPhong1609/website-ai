"use client";

import React from "react";
import { SidebarProvider } from "@/src/components/ui";

interface AdminDashboardShellProps {
  children: React.ReactNode;
}

export function AdminDashboardShell({ children }: AdminDashboardShellProps) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen w-full bg-[#F4F4F8] p-2 md:p-4 text-[#111827]">
        {children}
      </div>
    </SidebarProvider>
  );
}
