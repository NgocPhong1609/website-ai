import { getErrorMessage } from "@/src/shared/lib/user-error";
import { useState, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

export interface AIInsight {
 id: string;
 title: string;
 description: string;
 priority: "high" | "medium" | "low";
 type: "warning" | "suggestion" | "trend";
 metrics?: Record<string, string>;
 actionPlan: string[];
}

export function useAiInsights() {
 const [insights, setInsights] = useState<AIInsight[]>([]);
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const fetchInsights = async () => {
 setIsLoading(true);
 setError(null);
 try {
 const response = await axiosClient.get("/api/instructor/student-analytics/ai-insights");
 if (response.data?.success) {
 setInsights(response.data.data);
 } else {
 throw new Error(response.data?.message || "Không thể tải phân tích bằng AI. Vui lòng thử lại.");
 }
 } catch (err: any) {
 setError(getErrorMessage(err, "Đã xảy ra lỗi. Vui lòng thử lại."));
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 fetchInsights();
 }, []);

 return { insights, isLoading, error, refetch: fetchInsights };
}
