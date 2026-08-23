"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { resolveUserRole } from "@/src/features/student/auth/components/login/AuthShared";

/**
 * Client-side guard for Student Layout.
 * Prevents Teachers/Instructors and Admins from rendering Student pages.
 * If user is a Teacher or Admin, instantly redirects to /instructor or /admin.
 */
export function StudentRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");
    const userInfoRaw = window.localStorage.getItem("userInfo");

    if (token && userInfoRaw) {
      try {
        const user = JSON.parse(userInfoRaw);
        const role = resolveUserRole(user);

        if (role === "instructor") {
          setIsAuthorized(false);
          router.replace("/instructor");
          return;
        } else if (role === "admin") {
          setIsAuthorized(false);
          router.replace("/admin");
          return;
        }
      } catch (e) {
        console.error("[StudentRoleGuard] Failed to parse userInfo", e);
      }
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (isAuthorized === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F7F7FB]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#6B6BFF] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#64647A]">Đang chuyển hướng đến Portal...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
