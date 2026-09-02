import { axiosClient } from "../../../../shared/lib/axios";

export const getRevenueOverview = async () => {
  const { data } = await axiosClient.get("/api/instructor/revenue/overview");
  return data.data;
};

export const requestWithdrawal = async (payload: { amount: number; bank_info: { bank_name: string; account_number: string; account_name: string; } }) => {
  const { data } = await axiosClient.post("/api/instructor/revenue/withdraw", payload);
  return data;
};

export const getTransactions = async (params?: { type?: string; status?: string; search?: string; page?: number; date_range?: string; start_date?: string; end_date?: string }) => {
  const { data } = await axiosClient.get("/api/instructor/revenue/transactions", { params });
  return data;
};

export const getSalesReport = async (params?: { days?: number }) => {
  const { data } = await axiosClient.get("/api/instructor/revenue/sales-report", { params });
  return data.data;
};

export const getPayoutMethods = async () => {
  const { data } = await axiosClient.get("/api/instructor/revenue/payout-methods");
  return data.data;
};

export const updatePayoutMethods = async (payload: { bank_name: string; account_number: string; account_name: string }) => {
  const { data } = await axiosClient.post("/api/instructor/revenue/payout-methods", payload);
  return data.data;
};
