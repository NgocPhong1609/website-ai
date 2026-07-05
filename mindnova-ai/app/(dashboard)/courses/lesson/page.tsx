import type { Metadata } from "next";
import { LessonCurriculumSidebar, LessonContent, LessonFooter } from "@features/courses";

export const metadata: Metadata = {
  title: "Lesson | MindNova AI",
  description: "Learn and interact with MindNova AI lesson content.",
};

export default function LessonPage() {
  return (
    <div className="flex h-full w-full bg-white relative">
      <LessonCurriculumSidebar />
      <div className="flex-1 relative">
        <LessonContent />
        <LessonFooter />
      </div>
    </div>
  );
}
