import { axiosClient } from "@/src/shared/lib/axios";
import type { OrderResponse } from "../types";

export const checkoutService = {
  createOrder: async (courseIds: number[], paymentMethod: string): Promise<OrderResponse> => {
    try {
      const { data } = await axiosClient.post<OrderResponse>("/api/orders", {
        course_ids: courseIds,
        payment_method: paymentMethod,
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
