import { EditCourseContainer } from "@/src/features/instructor/create-course/components/EditCourseContainer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chỉnh sửa khóa học — MindNova AI",
  description: "Cập nhật thông tin chi tiết cho khóa học của bạn.",
};

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <EditCourseContainer courseId={courseId} />;
}
