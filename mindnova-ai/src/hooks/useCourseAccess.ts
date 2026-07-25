"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { UserCourseStatus } from "@/src/types/student";

interface UseCourseAccessReturn {
  status: UserCourseStatus | null;
  isActive: boolean;
  isLoading: boolean;
}

/**
 * Checks if the current user has ACTIVE access to the course.
 *
 * Core rule: Users can only access lesson content if their status in
 * User_Course table is ACTIVE. If not purchased, redirect to Checkout.
 *
 * In production, this would call: GET /api/courses/[courseId]/access
 * Here we simulate with a mock that reads from a constant.
 */
export function useCourseAccess(
  courseId: number,
  mockStatus: UserCourseStatus = "ACTIVE"
): UseCourseAccessReturn {
  const router = useRouter();
  const [status, setStatus] = useState<UserCourseStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with 400ms delay
    const timer = setTimeout(() => {
      // In production: apiClient<{ status: UserCourseStatus }>(`/api/courses/${courseId}/access`)
      setStatus(mockStatus);
      setIsLoading(false);

      if (mockStatus !== "ACTIVE") {
        router.replace("/billing/checkout");
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [courseId, mockStatus, router]);

  return {
    status,
    isActive: status === "ACTIVE",
    isLoading,
  };
}
