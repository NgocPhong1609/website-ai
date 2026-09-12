import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "@/src/shared/lib/axios";

export type BillingOrder = {
  id: number;
  transaction_id: string;
  total_amount: number;
  payment_method: string;
  status: string;
  created_at: string | null;
  course_id?: number | null;
  service: string;
};

export type BillingPayload = {
  orders: BillingOrder[];
  payment_methods: string[];
};

export function useGetBilling() {
  return useQuery({
    queryKey: ["student", "billing"],
    queryFn: async (): Promise<BillingPayload> => {
      const { data } = await axiosClient.get("/api/orders");
      return data.data;
    },
  });
}

