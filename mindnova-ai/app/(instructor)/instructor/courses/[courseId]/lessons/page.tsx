import { redirect } from "next/navigation";

// Route: /instructor/courses/[courseId]/lessons
// Deprecated: Consolidated into /instructor/courses/[courseId]/edit
export default async function LessonsPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  redirect(`/instructor/courses/${courseId}/edit`);
}
