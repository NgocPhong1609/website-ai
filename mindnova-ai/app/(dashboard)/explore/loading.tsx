import { CourseCatalogSkeleton } from "@/src/features/student/explore/components/CourseCatalogSkeleton";

export default function ExploreLoading() {
  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto min-h-full flex flex-col">
      <CourseCatalogSkeleton />
    </div>
  );
}
