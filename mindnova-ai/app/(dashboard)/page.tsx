import { ContinueLearning, AiSuggestionCard, DashboardStatsPanel } from "@features/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <AiSuggestionCard />
        <ContinueLearning />
      </div>

      {/* Right Sidebar */}
      <DashboardStatsPanel />
    </div>
  );
}
