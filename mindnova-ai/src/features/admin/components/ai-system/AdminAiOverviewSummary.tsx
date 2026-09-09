import Link from "next/link";
import type { AdminOverviewData } from "../../types";
import { AiProviderStatus } from "./AiProviderStatus";
import { AiUsageSummary } from "./AiUsageSummary";

export function AdminAiOverviewSummary({ summary }: { summary: AdminOverviewData["ai_summary"] }) {
  return <section aria-labelledby="admin-ai-summary-heading" className="min-w-0 space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4 sm:p-5">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 id="admin-ai-summary-heading" className="text-xl font-semibold text-slate-900">Tổng quan AI</h2>
        <p className="mt-1 text-sm text-slate-600">Cấu hình nhà cung cấp và sử dụng trong 7 ngày gần nhất.</p>
      </div>
      <Link href="/admin/ai-system" className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100">
        Cấu hình AI & Hệ thống
      </Link>
    </div>
    {summary ? <>
      <AiProviderStatus providers={summary.providers} />
      <AiUsageSummary usage={summary.usage} compact />
      <section aria-label="Hạn mức AI Trợ giảng" className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">Hạn mức AI Trợ giảng</h3>
        <dl className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
          {([ ["free", "Free"], ["premium", "Premium"] ] as const).map(([tier, label]) => <div key={tier}>
            <dt className="text-slate-600">{label}</dt>
            <dd className="mt-1 font-medium text-slate-900">{summary.packages[tier].daily_requests.toLocaleString("vi-VN")} yêu cầu / ngày</dd>
          </div>)}
        </dl>
      </section>
    </> : <p className="text-sm text-slate-600">Chưa có dữ liệu AI.</p>}
  </section>;
}
