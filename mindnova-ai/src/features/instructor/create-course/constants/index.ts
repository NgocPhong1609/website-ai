import type { Step } from "../types";

// ─── Create Course Constants ──────────────────────────────────────────────────

export const STEPS: Step[] = [
  { id: 1, label: "Thông tin" },
  { id: 2, label: "Cấu trúc" },
  { id: 3, label: "Cài đặt" },
];

export const COURSE_FIELDS = [
  "Lập trình & Công nghệ",
  "Trí tuệ nhân tạo",
  "Khoa học dữ liệu",
  "Thiết kế UI/UX",
  "Marketing số",
  "Kinh doanh",
  "Ngoại ngữ",
  "Khác",
] as const;

export const MAX_TITLE_LENGTH = 100;
export const MAX_DESCRIPTION_LENGTH = 500;

export const AI_TIP =
  '"Một khóa học thành công thường bắt đầu bằng tiêu đề rõ ràng, chứa từ khóa chuyên môn và ảnh bìa sáng tạo."';
