import { axiosClient } from "@/src/shared/lib/axios";
import type { OrderResponse } from "../types";

export interface ApplyCouponResponse {
  success: boolean;
  message: string;
  data?: {
    code: string;
    type: "percent" | "fixed";
    value: number;
    discount_amount: number;
    original_price: number;
    final_price: number;
    is_free: boolean;
  };
}

export const checkoutService = {
  applyCoupon: async (code: string, courseId: number): Promise<ApplyCouponResponse> => {
    try {
      const { data } = await axiosClient.post<ApplyCouponResponse>("/api/coupons/apply", {
        code,
        course_id: courseId,
      });
      return data;
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || "Không thể áp dụng mã giảm giá.";
      return {
        success: false,
        message: backendMessage,
      };
    }
  },

  createOrder: async (courseIds: number[], paymentMethod: string, couponCode?: string): Promise<OrderResponse> => {
    try {
      const { data } = await axiosClient.post<OrderResponse>("/api/orders", {
        course_ids: courseIds,
        payment_method: paymentMethod,
        coupon_code: couponCode || undefined,
      });
      return data;
    } catch (error: any) {
      const backendMessage = error?.response?.data?.message || "Không thể tạo đơn hàng. Vui lòng thử lại.";
      const status = error?.response?.status;

      if (status === 401 || status === 403) {
        return {
          success: false,
          message: "Bạn cần đăng nhập trước khi thanh toán hoặc nhận khóa học miễn phí.",
        };
      }

      return {
        success: false,
        message: backendMessage,
      };
    }
  },

  devCompleteOrder: async (orderId: number) => {
    const { data } = await axiosClient.post(`/api/dev/orders/${orderId}/complete`);
    return data;
  }
};
