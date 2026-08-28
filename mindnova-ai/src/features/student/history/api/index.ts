import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { HistoryOverviewData } from "../types";

export function useGetHistoryOverview(page = 1, perPage = 10) {
 return useQuery({
 queryKey: ["student", "history", "overview", page, perPage],
 queryFn: async (): Promise<HistoryOverviewData> => {
 const { data } = await axiosClient.get("/api/student/history/overview", {
 params: { page, per_page: perPage },
 });
 return data.data;
 },
 staleTime: 5 * 60 * 1000,
 });
}

export * from "../types";
