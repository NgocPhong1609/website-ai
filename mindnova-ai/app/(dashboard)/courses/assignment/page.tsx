import { Metadata } from "next";
import { AssignmentSubmission } from "@/src/features/courses/components/assignment/AssignmentSubmission";

export const metadata: Metadata = {
  title: "Assignment Submission",
  description: "Submit your assignment and review AI feedback.",
};

export default function AssignmentPage() {
  return <AssignmentSubmission />;
}
