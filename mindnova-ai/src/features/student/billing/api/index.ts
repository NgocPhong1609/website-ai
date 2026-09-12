import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

export type SavedPaymentMethod = {
  id: number;
  provider: "vnpay" | "momo" | "banking" | string;
  holder_name: string;
  bank_name: string | null;
  last4: string;
  is_default: boolean;
  label: string;
};

export function useGetPaymentMethods() {
  return useQuery({
    queryKey: ["student", "payment-methods"],
    queryFn: async (): Promise<SavedPaymentMethod[]> => {
      const { data } = await axiosClient.get("/api/student/payment-methods");
      return data.data ?? [];
    },
  });
}

export function useSavePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      provider: string;
      holder_name: string;
      account_number: string;
      bank_name?: string;
      is_default?: boolean;
    }) => {
      const { data } = await axiosClient.post("/api/student/payment-methods", payload);
      return data.data as SavedPaymentMethod;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "payment-methods"] });
    },
  });
}

export function useDeletePaymentMethod() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await axiosClient.delete(`/api/student/payment-methods/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["student", "payment-methods"] });
    },
  });
}
