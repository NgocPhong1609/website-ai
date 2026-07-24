"use client";

import { useEffect } from "react";

export function AdminAuthGuard() {
  useEffect(() => {
    const token = window.localStorage.getItem("accessToken");

    if (!token) {
      window.location.replace("/login");
    }
  }, []);

  return null;
}
