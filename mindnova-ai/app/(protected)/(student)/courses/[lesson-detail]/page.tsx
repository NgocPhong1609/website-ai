import type { Metadata } from "next";
import {
  LessonCurriculumSidebar,
  LessonContent,
  LessonFooter,
} from "@/src/components/page/student/courses";

export const metadata: Metadata = {
  title: "Lesson | MindNova AI",
  description: "Learn and interact with MindNova AI lesson content.",
};

interface LessonPageProps {
  params: Promise<{ "lesson-detail": string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { "lesson-detail": lessonId } = await params;

  return (
    <div className="flex h-full w-full bg-white relative">
      <LessonCurriculumSidebar />
      <div className="flex-1 relative">
        <LessonContent lessonId={lessonId} />
        <LessonFooter />
      </div>
    </div>
  );
}
