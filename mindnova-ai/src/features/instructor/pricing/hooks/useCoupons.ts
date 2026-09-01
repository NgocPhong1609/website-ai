import { useState, useCallback, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

export interface Coupon {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: string | number;
  max_uses: number | null;
  used_count: number;
  starts_at?: string | null;
  expires_at: string | null;
  status: "active" | "disabled" | "expired";
  course_id?: number | null;
  instructor_id?: number | null;
}

export function useCoupons(courseId?: string | number) {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState({ total_codes: 0, used_count: 0, discount_amount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = courseId
        ? `/api/instructor/coupons?course_id=${courseId}`
        : "/api/instructor/coupons";
      const response = await axiosClient.get(url);
      if (response.data?.success) {
        const rawList: Coupon[] = response.data.data || [];
        // Filter on client side as double safety when courseId is set:
        // keep coupons that either match courseId OR apply to all courses (course_id === null/undefined)
        const filtered = courseId
          ? rawList.filter(
              (c) => !c.course_id || String(c.course_id) === String(courseId)
            )
          : rawList;

        setCoupons(filtered);
        setStats(response.data.stats || { total_codes: filtered.length, used_count: 0, discount_amount: 0 });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  const createCoupon = useCallback(
    async (data: Partial<Coupon>) => {
      try {
        await axiosClient.post("/api/instructor/coupons", data);
        await fetchCoupons();
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to create coupon");
      }
    },
    [fetchCoupons]
  );

  const updateCoupon = useCallback(
    async (id: number, data: Partial<Coupon>) => {
      try {
        await axiosClient.put(`/api/instructor/coupons/${id}`, data);
        await fetchCoupons();
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to update coupon");
      }
    },
    [fetchCoupons]
  );

  const deleteCoupon = useCallback(
    async (id: number) => {
      try {
        await axiosClient.delete(`/api/instructor/coupons/${id}`);
        await fetchCoupons();
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to delete coupon");
      }
    },
    [fetchCoupons]
  );

  const toggleStatus = useCallback(
    async (id: number, status: string) => {
      try {
        await axiosClient.patch(`/api/instructor/coupons/${id}/toggle`, { status });
        await fetchCoupons();
      } catch (err: any) {
        throw new Error(err.response?.data?.message || "Failed to toggle status");
      }
    },
    [fetchCoupons]
  );

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return { coupons, stats, isLoading, error, createCoupon, updateCoupon, deleteCoupon, toggleStatus, refetch: fetchCoupons };
}
