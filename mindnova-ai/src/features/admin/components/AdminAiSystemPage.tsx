import { getAdminAiSystemData } from "@/src/features/admin/services/admin-module-data.service";

export async function AdminAiSystemPage() {
  const data = await getAdminAiSystemData();

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#0b1636_0%,#0d224a_50%,#115e83_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/65">AI & system</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Cấu hình AI & hệ thống</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-200/90">
          Theo dõi kết nối mô hình AI, hạn mức sử dụng và prompt hệ thống.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <h2 className="text-lg font-semibold text-slate-900">Provider</h2>
          <div className="mt-4 space-y-3">
            {data.providers.map((provider) => (
              <div key={provider.provider} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                <div>
                  <div className="font-medium text-slate-800">{provider.provider}</div>
                  <div className="text-xs text-slate-500">{provider.model}</div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${provider.status === "connected" ? "bg-emerald-50 text-emerald-700" : provider.status === "warning" ? "bg-amber-50 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                    {provider.status}
                  </span>
                  <div className="mt-1 text-[11px] text-slate-500">{provider.apiKeyHint}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
          <h2 className="text-lg font-semibold text-slate-900">Quota</h2>
          <div className="mt-4 space-y-4">
            {data.quotas.map((quota) => (
              <div key={quota.label}>
                <div className="mb-1 flex items-center justify-between text-sm text-slate-700">
                  <span>{quota.label}</span>
                  <span>{quota.used}/{quota.limit}</span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500"
                    style={{ width: `${Math.min((quota.used / quota.limit) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]">
        <h2 className="text-lg font-semibold text-slate-900">System prompt</h2>
        <div className="mt-4 space-y-3">
          {data.systemPrompts.map((prompt) => (
            <div key={prompt.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <div>
                <div className="font-medium text-slate-800">{prompt.name}</div>
                <div className="text-xs text-slate-500">{prompt.purpose}</div>
              </div>
              <div className="text-right">
                <span className={`inline-flex rounded-full px-2 py-1 text-[11px] font-semibold ${prompt.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"}`}>
                  {prompt.status === "active" ? "Active" : "Draft"}
                </span>
                <div className="mt-1 text-[11px] text-slate-500">Updated {prompt.updatedAt}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
