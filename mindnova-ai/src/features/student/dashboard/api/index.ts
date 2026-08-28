import { useQuery } from "@tanstack/react-query";
import { axiosClient } from "../../../../shared/lib/axios";

export const useGetDashboardOverview = () => {
 return useQuery({
 queryKey: ["student", "dashboard", "overview"],
 queryFn: async () => {
 const { data } = await axiosClient.get("/api/student/dashboard");
 return data;
 },
 staleTime: 5 * 60 * 1000,
 });
};
