import { Metadata } from "next";
import { AssignmentSubmission } from "@features/student/courses";

export const metadata: Metadata = {
  title: "Assignment Submission",
  description: "Submit your assignment and review AI feedback.",
};

export default function AssignmentPage() {
  return <AssignmentSubmission />;
}
