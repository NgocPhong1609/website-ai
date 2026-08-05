import { axiosClient } from "@/src/shared/lib/axios";
import type { OrderResponse } from "../types";

export const checkoutService = {
  createOrder: async (courseIds: number[], paymentMethod: string): Promise<OrderResponse> => {
    const { data } = await axiosClient.post<OrderResponse>("/api/orders", {
      course_ids: courseIds,
      payment_method: paymentMethod,
    });
    return data;
  },
};
