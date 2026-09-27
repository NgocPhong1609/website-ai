import type { IGeneratingStep } from "@/src/features/student/onboarding/types";

export const GENERATING_STEPS: IGeneratingStep[] = [
 { id: 1, label: "Phân tích mục tiêu của bạn", status: "completed" },
 { id: 2, label: "Đánh giá trình độ hiện tại", status: "completed" },
 { id: 3, label: "Chọn các chủ đề phù hợp nhất", status: "in-progress" },
 { id: 4, label: "Xây dựng lộ trình học tập", status: "pending" },
];
