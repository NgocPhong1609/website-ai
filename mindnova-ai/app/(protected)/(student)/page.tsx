import {
  AiSuggestionCard,
  ContinueLearning,
  DashboardStatsPanel,
<<<<<<< HEAD
<<<<<<< HEAD:mindnova-ai/app/(protected)/(student)/page.tsx
<<<<<<< HEAD:mindnova-ai/app/(protected)/(student)/page.tsx
} from "@/src/components/page/student/dashboard";
=======
=======
  ExploreCourses,
>>>>>>> d992cb0ab12794193226d83e3c42b24fadda4c43:mindnova-ai/app/(dashboard)/page.tsx
} from "@/src/features/student/dashboard";
>>>>>>> cb5bd5256681bc413148896ee90827b7f054ec2e:mindnova-ai/app/(dashboard)/page.tsx
=======
} from "@/src/components/page/student/dashboard";
>>>>>>> 83c13480e0df972562db35c4fc048e4e29106ede

export default function DashboardPage() {
  return (
    <div className="flex flex-col xl:flex-row gap-8 p-6 lg:p-8 max-w-[1400px] mx-auto">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-8 min-w-0">
        <AiSuggestionCard />
        <ContinueLearning />
        <ExploreCourses/>
      </div>

      {/* Right Sidebar */}
      <DashboardStatsPanel />
    </div>
  );
}
