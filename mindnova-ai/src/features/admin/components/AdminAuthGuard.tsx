"use client";

import { useEffect } from "react";

export function AdminAuthGuard() {
  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");

    if (!token) {
      document.cookie = "accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      document.cookie = "userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      window.location.replace("/login");
    }
  }, []);

  return null;
}
