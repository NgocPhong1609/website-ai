import { AdminCoursesPage } from "@/src/features/admin/components/AdminCoursesPage";

type CoursesPageProps = {
  searchParams?: Promise<{
    search?: string;
    categoryId?: string;
    level?: string;
  }>;
};

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const params = await searchParams;

  return (
    <AdminCoursesPage
      filters={{
        search: params?.search,
        categoryId: params?.categoryId,
        level: params?.level,
      }}
    />
  );
}
