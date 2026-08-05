import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { HistoryOverviewData } from "../types";

export function useGetHistoryOverview() {
  return useQuery({
    queryKey: ["student", "history", "overview"],
    queryFn: async (): Promise<HistoryOverviewData> => {
      const { data } = await axiosClient.get("/api/student/history/overview");
      return data.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export * from "../types";
