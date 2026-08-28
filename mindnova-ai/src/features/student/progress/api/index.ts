import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";
import type { ProgressOverviewData } from "../types";

export function useGetProgressOverview() {
 return useQuery({
 queryKey: ["student", "progress", "overview"],
 queryFn: async (): Promise<ProgressOverviewData> => {
 const { data } = await axiosClient.get("/api/student/progress/overview");
 return data.data;
 },
 staleTime: 5 * 60 * 1000,
 });
}

export * from "../types";
