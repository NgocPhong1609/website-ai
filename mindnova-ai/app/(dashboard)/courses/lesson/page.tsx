import type { Metadata } from "next";
<<<<<<< HEAD
import { LessonCurriculumSidebar, LessonContent, LessonFooter } from "@/src/features/student/courses";
=======
import { LessonCurriculumSidebar, LessonContent, LessonFooter } from "@features/student/courses";
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

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
