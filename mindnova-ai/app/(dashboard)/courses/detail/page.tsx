import type { Metadata } from "next";
import { CourseDetailWorkspace } from "@/src/features/student/courses/components/course-detail";

export const metadata: Metadata = {
  title: "Chi tiết Khóa học AI & Neural Networks | MindNova AI",
  description: "Khởi động hành trình rèn luyện chuyên môn cùng Gia sư Trí tuệ AI Nova.",
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function CourseDetailPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const courseIdStr = resolvedParams.courseId;
  const courseId = courseIdStr ? parseInt(courseIdStr as string, 10) : 1;
  return <CourseDetailWorkspace courseId={courseId} />;
}
