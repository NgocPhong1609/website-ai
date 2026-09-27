import type { ISkill } from "@/src/features/student/onboarding/types";

export const ONBOARDING_SKILLS: ISkill[] = [
 {
 id: 1,
 level: "Beginner",
 iconPath: "/icons/smile.svg",
 iconBgColor: "bg-[#3B82F6]/20",
 description: "Tôi mới bắt đầu.",
 },
 {
 id: 2,
 level: "Intermediate",
 iconPath: "/icons/zigzac.svg",
 iconBgColor: "bg-[#3B82F6]/20",
 description: "Tôi đã nắm cơ bản và muốn nâng cao.",
 },
 {
 id: 3,
 level: "Advanced",
 iconPath: "/icons/reward.svg",
 iconBgColor: "bg-[#3B82F6]/20",
 description: "Tôi muốn làm chủ các chủ đề nâng cao.",
 },
];
