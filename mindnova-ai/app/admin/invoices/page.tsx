import { AdminInvoicesPage } from "@/src/features/admin/components/AdminInvoicesPage";

type InvoicesPageProps = {
  searchParams?: Promise<{
    search?: string;
    status?: string;
    paymentMethod?: string;
  }>;
};

export default async function InvoicesPage({ searchParams }: InvoicesPageProps) {
  const params = await searchParams;

  return (
    <AdminInvoicesPage
      filters={{
        search: params?.search,
        status: params?.status,
        paymentMethod: params?.paymentMethod,
      }}
    />
  );
}
