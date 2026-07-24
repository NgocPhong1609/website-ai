export function AdminSettingsPage() {
  return (
    <div className="space-y-6 p-6 lg:p-8">
      <section className="rounded-[28px] bg-slate-900 p-6 text-white shadow-[0_20px_60px_-25px_rgba(15,23,42,0.8)]">
        <h1 className="text-2xl font-semibold">System Settings</h1>
        <p className="mt-2 text-sm text-slate-300">
          Cấu hình API, auth, notification và lưu trữ dữ liệu.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">Laravel API Endpoint</p>
          <p className="mt-2 text-sm text-slate-500">http://localhost:8000/api</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-sm font-medium text-slate-900">Auth Token Config</p>
          <p className="mt-2 text-sm text-slate-500">Bearer token via cookies</p>
        </div>
      </section>
    </div>
  );
}
