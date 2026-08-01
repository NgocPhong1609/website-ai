"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function AdminAuthGuard() {
  const router = useRouter();

  useEffect(() => {
    // Proactively check accessToken or admin role if needed
    const token = typeof window !== "undefined" ? window.localStorage.getItem("accessToken") : null;
    if (!token) {
      // Keep silent or redirect if auth enforcement is enabled
    }
  }, [router]);

  return null;
}
