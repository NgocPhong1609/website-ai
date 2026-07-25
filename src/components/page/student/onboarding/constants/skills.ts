import type { ISkill } from "@/src/components/page/student/onboarding/types";

export const ONBOARDING_SKILLS: ISkill[] = [
  {
    id: 1,
    level: "Beginner",
    iconPath: "/icons/smile.svg",
    iconBgColor: "bg-[#6063EE]/20",
    description: "I am just getting started.",
  },
  {
    id: 2,
    level: "Intermediate",
    iconPath: "/icons/zigzac.svg",
    iconBgColor: "bg-[#6063EE]/20",
    description: "I understand the basics and want to improve.",
  },
  {
    id: 3,
    level: "Advanced",
    iconPath: "/icons/reward.svg",
    iconBgColor: "bg-[#6063EE]/20",
    description: "I want to master advanced topics.",
  },
];
