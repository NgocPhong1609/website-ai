import { useState, useCallback } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

export interface OutlineAnswer {
 content: string;
 is_correct: boolean;
}

export interface OutlineQuestion {
 content: string;
 answers: OutlineAnswer[];
}

export interface OutlineLesson {
 title: string;
 type: "document" | "quiz";
 content?: string; // HTML content cho bài tài liệu
 questions?: OutlineQuestion[]; // Câu hỏi cho bài trắc nghiệm
}

export interface OutlineChapter {
 title: string;
 lessons: OutlineLesson[];
}

export interface GeneratedOutline {
 chapters: OutlineChapter[];
}

interface GenerateParams {
 topic: string;
 targetAudience: string;
 skillLevel: string;
 methodology: string;
}

export function useGenerateOutline() {
 const [isGenerating, setIsGenerating] = useState(false);
 const [error, setError] = useState<string | null>(null);

 const generate = useCallback(async (params: GenerateParams): Promise<GeneratedOutline | null> => {
 setIsGenerating(true);
 setError(null);
 try {
 const response = await axiosClient.post("/api/instructor/courses/ai-outline/generate", params);
 if (response.data?.success && response.data?.data) {
 return response.data.data;
 } else {
 throw new Error(response.data?.message || "Không thể tạo đề cương khóa học.");
 }
 } catch (err: any) {
 const status = err.response?.status;
 const serverMsg = err.response?.data?.message;

 let vietnameseError: string;
 if (status === 401 || status === 403) {
 vietnameseError = "Bạn chưa đăng nhập hoặc không có quyền truy cập. Vui lòng đăng nhập lại.";
 } else if (status === 422) {
 vietnameseError = "Vui lòng nhập đầy đủ thông tin chủ đề khóa học.";
 } else if (status === 404) {
 vietnameseError = "Chức năng tạo đề cương AI hiện chưa khả dụng. Vui lòng liên hệ quản trị viên.";
 } else if (status === 429) {
 vietnameseError = "Bạn đã gửi quá nhiều yêu cầu. Vui lòng chờ một lát rồi thử lại.";
 } else if (status === 500) {
 if (serverMsg) {
 vietnameseError = serverMsg;
 } else {
 vietnameseError = "Hiện tại AI chưa thể tạo đề cương. Vui lòng thử lại sau ít phút.";
 }
 } else if (err.code === "ERR_NETWORK" || err.message === "Network Error") {
 vietnameseError = "Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.";
 } else {
 vietnameseError = "Đã xảy ra lỗi không mong muốn. Vui lòng thử lại.";
 }

 setError(vietnameseError);
 return null;
 } finally {
 setIsGenerating(false);
 }
 }, []);

 return { generate, isGenerating, error };
}
