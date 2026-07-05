import { ChatPanel } from "@/src/features/student/ai-study-plan/components/ChatPanel";
import { ContextPanel } from "@/src/features/student/ai-study-plan/components/ContextPanel";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "AI Study Plan",
  description: "Your AI-powered study plan and interactive tutor.",
};

export default function AIStudyPlanPage() {
  return (
    <div className="flex h-full w-full overflow-hidden relative bg-white">
      <ContextPanel />
      <ChatPanel />
    </div>
  );
}
