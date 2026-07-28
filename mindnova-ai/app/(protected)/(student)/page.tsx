import {
  AiSuggestionCard,
  ContinueLearning,
  DashboardStatsPanel,
<<<<<<< HEAD:mindnova-ai/app/(protected)/(student)/page.tsx
} from "@/src/components/page/student/dashboard";
=======
} from "@/src/features/student/dashboard";
>>>>>>> cb5bd5256681bc413148896ee90827b7f054ec2e:mindnova-ai/app/(dashboard)/page.tsx

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
