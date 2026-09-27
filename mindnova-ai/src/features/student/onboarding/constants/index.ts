import {
  BrainCircuit,
  CalendarClock,
  Clock3,
  Flame,
  GraduationCap,
  Languages,
  Layers,
  Monitor,
  Rocket,
  Server,
  Sprout,
  Timer,
  TrendingUp,
  Trophy,
} from "lucide-react";
import type {
  LevelId,
  OnboardingGoal,
  OnboardingOption,
  OnboardingStepKey,
  TimeId,
} from "../types";

export const MAX_TOPICS = 5;

export const ONBOARDING_STEPS: { key: OnboardingStepKey; label: string; href: string }[] = [
  { key: "goal", label: "Mục tiêu", href: "/onboarding/goal" },
  { key: "skills", label: "Trình độ", href: "/onboarding/skills" },
  { key: "topics", label: "Chủ đề & thời gian", href: "/onboarding/topics" },
];

export const ONBOARDING_GOALS: OnboardingGoal[] = [
  {
    id: "frontend",
    title: "Lập trình viên Frontend",
    description: "HTML, CSS, JavaScript, React và thiết kế giao diện hiện đại.",
    icon: Monitor,
    topics: ["HTML/CSS", "JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS", "UI/UX", "Kiểm thử"],
  },
  {
    id: "backend",
    title: "Lập trình viên Backend",
    description: "Máy chủ, cơ sở dữ liệu, API và kiến trúc hệ thống.",
    icon: Server,
    topics: ["Node.js", "PHP/Laravel", "Python", "Cơ sở dữ liệu", "REST API", "Bảo mật", "Docker", "Kiến trúc hệ thống"],
  },
  {
    id: "fullstack",
    title: "Lập trình viên Fullstack",
    description: "Kết hợp frontend và backend để làm sản phẩm hoàn chỉnh.",
    icon: Layers,
    topics: ["JavaScript", "React", "Node.js", "Cơ sở dữ liệu", "REST API", "Xác thực", "Triển khai", "Git"],
  },
  {
    id: "english",
    title: "Tiếng Anh cho IT",
    description: "Từ vựng chuyên ngành, đọc tài liệu và giao tiếp trong công việc.",
    icon: Languages,
    topics: ["Từ vựng IT", "Ngữ pháp", "Nghe hiểu", "Giao tiếp", "Viết email", "Phỏng vấn"],
  },
  {
    id: "certificate",
    title: "Ôn thi chứng chỉ",
    description: "Kế hoạch ôn tập tập trung cho kỳ thi chứng chỉ và học thuật.",
    icon: GraduationCap,
    topics: ["IELTS", "TOEIC", "AWS", "Tin học văn phòng", "Luyện đề", "Quản lý thời gian"],
  },
  {
    id: "ai-data",
    title: "AI và Khoa học dữ liệu",
    description: "Python, phân tích dữ liệu, học máy và ứng dụng AI.",
    icon: BrainCircuit,
    topics: ["Python", "SQL", "Thống kê", "Pandas", "Trực quan hóa dữ liệu", "Machine Learning", "Deep Learning", "Prompt engineering"],
  },
];

export const ONBOARDING_LEVELS: OnboardingOption<LevelId>[] = [
  { id: "beginner", title: "Mới bắt đầu", description: "Tôi chưa có hoặc mới có rất ít kiến thức.", icon: Sprout },
  { id: "intermediate", title: "Đã có nền tảng", description: "Tôi nắm phần cơ bản và muốn học sâu hơn.", icon: TrendingUp },
  { id: "advanced", title: "Nâng cao", description: "Tôi đã có kinh nghiệm và muốn làm chủ chủ đề khó.", icon: Trophy },
];

export const ONBOARDING_TIMES: OnboardingOption<TimeId>[] = [
  { id: "30m", title: "Khoảng 30 phút/ngày", description: "Học đều đặn, nhẹ nhàng", icon: Timer },
  { id: "1-2h", title: "1–2 giờ/ngày", description: "Nhịp độ phổ biến nhất", icon: Clock3 },
  { id: "2-4h", title: "2–4 giờ/ngày", description: "Tiến bộ nhanh", icon: CalendarClock },
  { id: "4h+", title: "Trên 4 giờ/ngày", description: "Học toàn thời gian", icon: Flame },
];

/** Visual stages shown while the plan is generated (not tied to backend progress). */
export const GENERATING_STAGES = [
  "Phân tích mục tiêu của bạn",
  "Đánh giá trình độ hiện tại",
  "Chọn chủ đề và khóa học phù hợp",
  "Sắp xếp lộ trình theo thời gian học",
];

export const WELCOME_HIGHLIGHTS = [
  { icon: Rocket, title: "3 câu hỏi ngắn", description: "Mất khoảng một phút" },
  { icon: BrainCircuit, title: "Lộ trình do AI thiết kế", description: "Theo mục tiêu và trình độ" },
  { icon: GraduationCap, title: "Khóa học phù hợp", description: "Gợi ý từ thư viện MindNova" },
];
