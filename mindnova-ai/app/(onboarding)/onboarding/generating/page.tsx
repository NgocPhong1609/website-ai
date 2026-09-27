import type { Metadata } from "next";
import { GeneratingContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
 title: "Đang tạo lộ trình",
 description: "MindNova AI đang tạo lộ trình học tập cá nhân hóa cho bạn.",
};

export default function GeneratingPage() {
 return <GeneratingContainer />;
}
