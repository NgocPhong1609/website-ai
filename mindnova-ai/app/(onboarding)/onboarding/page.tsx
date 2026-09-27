import type { Metadata } from "next";
import { WelcomeContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
  title: "Chào mừng",
  description: "Thiết lập lộ trình học tập cá nhân hóa cùng MindNova AI.",
};

export default function Page() {
  return <WelcomeContainer />;
}
