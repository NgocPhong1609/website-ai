"use client";

import React, { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { resolveUserRole } from "@/src/features/student/auth/components/login/AuthShared";

/**
 * Client-side guard for Instructor Layout.
 * Prevents non-instructors (Students) from accessing Instructor Portal.
 * If user is a Student, redirects to /explore.
 * If user is unauthenticated, redirects to /login.
 */
export function InstructorRoleGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");
    const userInfoRaw = window.localStorage.getItem("userInfo");

    if (!token) {
      setIsAuthorized(false);
      router.replace("/login");
      return;
    }

    if (userInfoRaw) {
      try {
        const user = JSON.parse(userInfoRaw);
        const role = resolveUserRole(user);

        if (role === "student") {
          setIsAuthorized(false);
          router.replace("/explore");
          return;
        }
      } catch (e) {
        console.error("[InstructorRoleGuard] Failed to parse userInfo", e);
      }
    }

    setIsAuthorized(true);
  }, [pathname, router]);

  if (isAuthorized === false) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F4F4F8]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#4648D4] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#64647A]">Đang chuyển hướng...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
