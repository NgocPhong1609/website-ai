import type { Metadata } from "next";
<<<<<<< HEAD
import { CourseHeader, CurriculumAccordion, CourseSidebar } from "@/src/features/student/courses";
=======
import { CourseHeader, CurriculumAccordion, CourseSidebar } from "@features/student/courses";
>>>>>>> 7e154dade1d41e3edc19ae56dfd6b83146d023b7

export const metadata: Metadata = {
  title: "Course Detail | MindNova AI",
  description: "View course curriculum and progress.",
};

export default function CourseDetailPage() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col lg:flex-row items-start gap-8">
      {/* Main Content (Left) */}
      <div className="flex-1 w-full min-w-0">
        <CourseHeader />
        <CurriculumAccordion />
      </div>

      {/* Sidebar (Right) */}
      <CourseSidebar />
    </div>
  );
}
