import type { Metadata } from "next";
import { TopicsContainer } from "@/src/features/student/onboarding";

export const metadata: Metadata = {
 title: "Chọn chủ đề",
 description: "Chọn chủ đề để cá nhân hóa lộ trình học tập của bạn.",
};

export default function TopicsPage() {
 return <TopicsContainer />;
}
