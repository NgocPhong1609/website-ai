import { useState, useCallback, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

export interface Coupon {
  id: number;
  code: string;
  type: "percent" | "fixed";
  value: string;
  max_uses: number | null;
  used_count: number;
  expires_at: string | null;
  status: "active" | "disabled" | "expired";
}

export function useCoupons() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [stats, setStats] = useState({ total_codes: 0, used_count: 0, discount_amount: 0 });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get("/api/instructor/coupons");
      if (response.data?.success) {
        setCoupons(response.data.data);
        setStats(response.data.stats);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch coupons");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createCoupon = useCallback(async (data: Partial<Coupon>) => {
    try {
      await axiosClient.post("/api/instructor/coupons", data);
      await fetchCoupons();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to create coupon");
    }
  }, [fetchCoupons]);

  const updateCoupon = useCallback(async (id: number, data: Partial<Coupon>) => {
    try {
      await axiosClient.put(`/api/instructor/coupons/${id}`, data);
      await fetchCoupons();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to update coupon");
    }
  }, [fetchCoupons]);

  const deleteCoupon = useCallback(async (id: number) => {
    try {
      await axiosClient.delete(`/api/instructor/coupons/${id}`);
      await fetchCoupons();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to delete coupon");
    }
  }, [fetchCoupons]);

  const toggleStatus = useCallback(async (id: number, status: string) => {
    try {
      await axiosClient.patch(`/api/instructor/coupons/${id}/toggle`, { status });
      await fetchCoupons();
    } catch (err: any) {
      throw new Error(err.response?.data?.message || "Failed to toggle status");
    }
  }, [fetchCoupons]);

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return { coupons, stats, isLoading, error, createCoupon, updateCoupon, deleteCoupon, toggleStatus, refetch: fetchCoupons };
}
