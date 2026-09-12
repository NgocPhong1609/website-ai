import type { Step } from "../types";

// ─── Create Course Constants ──────────────────────────────────────────────────

export const STEPS: Step[] = [
 { id: 1, label: "Thông tin chính" },
 { id: 2, label: "Nội dung bài học" },
 { id: 3, label: "Cài đặt & Giá" },
];

export const OTHER_CATEGORY_VALUE = "__other__";

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const AI_TIP =
 '"Một khóa học thành công thường bắt đầu bằng tiêu đề rõ ràng, chứa từ khóa chuyên môn và ảnh bìa sáng tạo."';
