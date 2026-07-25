import { Metadata } from "next";
import { LearningHistory } from "@/src/components/page/student/history/LearningHistory";

export const metadata: Metadata = {
  title: "Learning History",
  description:
    "A comprehensive record of your academic journey and milestones.",
};

export default function HistoryPage() {
  return <LearningHistory />;
}
