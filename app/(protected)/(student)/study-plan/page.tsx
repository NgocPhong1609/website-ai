
import { Metadata } from "next";
import { ChatPanel, ContextPanel } from "../../../../src/components/page/student/ai-study-plan";

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
