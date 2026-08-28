import { axiosClient } from "@shared/lib/axios";

export const getStudents = async (params?: { search?: string; course_id?: number | string; page?: number; per_page?: number }) => {
 const { data } = await axiosClient.get("/api/instructor/students", { params });
 return data;
};

export const exportStudentsCSV = async (params?: { search?: string; course_id?: number | string }) => {
 const response = await axiosClient.get("/api/instructor/students/export", {
 params,
 responseType: "blob", // Important for downloading files
 });
 
 // Create download link and click it
 const url = window.URL.createObjectURL(new Blob([response.data]));
 const link = document.createElement("a");
 link.href = url;
 link.setAttribute("download", "student_list.csv");
 document.body.appendChild(link);
 link.click();
 
 // Cleanup
 link.parentNode?.removeChild(link);
 window.URL.revokeObjectURL(url);
};

export const getAnalytics = async (params?: { course_id?: number | string }) => {
 const { data } = await axiosClient.get("/api/instructor/students/analytics", { params });
 return data;
};

export const getLatestDiscussions = async (params?: { limit?: number }) => {
 const { data } = await axiosClient.get("/api/instructor/students/discussions", { params });
 return data;
};

export const generateAiNotification = async (payload: { prompt: string; tone?: string; course_id?: number | string }) => {
 const { data } = await axiosClient.post("/api/instructor/students/ai-notification/generate", payload);
 return data;
};

export const getNotificationOptions = async () => {
 const { data } = await axiosClient.get("/api/instructor/students/notification-options");
 return data;
};

export const sendNotification = async (payload: { content: string; course_ids: (string | number)[]; schedule?: string }) => {
 const { data } = await axiosClient.post("/api/instructor/students/notifications", payload);
 return data;
};

// Analytics Dashboard
export const getDashboardMetrics = async () => {
 const { data } = await axiosClient.get("/api/instructor/student-analytics/dashboard-metrics");
 return data;
};

export const getEngagementChart = async (params?: { days?: number }) => {
 const { data } = await axiosClient.get("/api/instructor/student-analytics/engagement-chart", { params });
 return data;
};
