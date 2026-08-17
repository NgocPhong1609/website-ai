import { Metadata } from "next";
import { LearningHistory } from "@/src/features/student/history/components/LearningHistory";

export const metadata: Metadata = {
  title: "Learning History",
  description:
    "A comprehensive record of your academic journey and milestones.",
};

export default function HistoryPage() {
  return <LearningHistory />;
}
