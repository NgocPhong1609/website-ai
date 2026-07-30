import { Metadata } from "next";
<<<<<<< HEAD:mindnova-ai/app/(protected)/(student)/courses/assignment/page.tsx
import { AssignmentSubmission } from "@/src/components/page/student/courses";
=======
import { AssignmentSubmission } from "@/src/features/student/courses/components/assignment/AssignmentSubmission";
>>>>>>> d992cb0ab12794193226d83e3c42b24fadda4c43:mindnova-ai/app/(dashboard)/courses/assignment/page.tsx

export const metadata: Metadata = {
  title: "Assignment Submission",
  description: "Submit your assignment and review AI feedback.",
};

export default function AssignmentPage() {
  return <AssignmentSubmission />;
}
