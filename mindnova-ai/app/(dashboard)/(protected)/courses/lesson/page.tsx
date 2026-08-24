import type { Metadata } from "next";
import { LessonWorkspace } from "@/src/features/student/courses";

export const metadata: Metadata = {
  title: "Phòng học trực tuyến AI | MindNova",
  description: "Không gian học tập tương tác cùng Gia sư Trợ lý AI MindNova Co-Pilot.",
};

export default function LessonPage() {
  return (
    <div className="min-h-screen w-full bg-[#F6F6FB] relative">
      <LessonWorkspace />
    </div>
  );
}
