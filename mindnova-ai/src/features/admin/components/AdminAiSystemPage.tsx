<<<<<<< HEAD
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
=======
"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/src/features/admin/lib/admin-api";

type ConfigPayload = {
  providers: {
    primary: string;
    connections?: Array<{ name: string; enabled: boolean; has_key: boolean }>;
  };
  quotas: {
    student_daily_questions: number;
    guest_daily_questions: number;
  };
  prompts: {
    ai_tro_giang: string;
    ai_cham_bai: string;
  };
  usage_today: {
    total_requests: number;
    estimated_cost: number;
  };
};

export function AdminAiSystemPage() {
  const [data, setData] = useState<ConfigPayload | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const loadData = async () => {
    try {
      const payload = await adminApi<ConfigPayload>("/admin/ai-config");
      setData(payload);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể tải cấu hình.");
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  useEffect(() => {
    const handleRefresh = () => {
      void loadData();
    };

    window.addEventListener("admin:refresh-data", handleRefresh);
    return () => window.removeEventListener("admin:refresh-data", handleRefresh);
  }, []);

  const save = async () => {
    if (!data) return;

    setSaving(true);
    setMessage(null);

    try {
      await adminApi<{ message: string }>("/admin/ai-config", {
        method: "PUT",
        body: JSON.stringify({
          providers: data.providers,
          quotas: data.quotas,
          prompts: data.prompts,
        }),
      });
      setMessage("Đã lưu cấu hình AI & hệ thống.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Lưu cấu hình thất bại.");
    } finally {
      setSaving(false);
    }
  };

  if (!data) {
    return <div className="p-6 text-sm text-slate-600">Đang tải cấu hình AI...</div>;
  }

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[28px] border border-cyan-200/20 bg-[linear-gradient(120deg,#1e293b_0%,#0f766e_55%,#0369a1_100%)] p-6 text-white shadow-[0_30px_70px_-35px_rgba(7,18,45,0.85)]">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/70">AI & System Configuration</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Quản lý cấu hình AI và hạn mức sử dụng</h1>
        <p className="mt-2 text-sm text-slate-100/90">Quản lý API key provider, quota Student/Guest, và System Prompt cho AI trợ giảng/chấm bài.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
          <p className="text-sm text-slate-500">Yêu cầu AI hôm nay</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">{data.usage_today.total_requests}</p>
        </div>
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
          <p className="text-sm text-slate-500">Chi phí API ước tính hôm nay</p>
          <p className="mt-2 text-3xl font-semibold text-slate-900 [font-family:var(--font-admin-head)]">${data.usage_today.estimated_cost.toFixed(4)}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">API Model Provider</h2>

        <label className="block text-sm text-slate-700">
          Provider chính
          <select
            value={data.providers.primary}
            onChange={(event) => setData((current) => current ? { ...current, providers: { ...current.providers, primary: event.target.value } } : current)}
            className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2"
          >
            <option value="openai">OpenAI</option>
            <option value="gemini">Gemini</option>
            <option value="claude">Claude</option>
            <option value="internal">AI nội bộ</option>
            <option value="groq">Groq</option>
          </select>
        </label>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Quota AI theo ngày</h2>

        <div className="grid gap-3 md:grid-cols-2">
          <label className="text-sm text-slate-700">
            Student / ngày
            <input type="number" min={1} value={data.quotas.student_daily_questions} onChange={(event) => setData((current) => current ? { ...current, quotas: { ...current.quotas, student_daily_questions: Number(event.target.value) } } : current)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
          </label>
          <label className="text-sm text-slate-700">
            Guest / ngày
            <input type="number" min={1} value={data.quotas.guest_daily_questions} onChange={(event) => setData((current) => current ? { ...current, quotas: { ...current.quotas, guest_daily_questions: Number(event.target.value) } } : current)} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
          </label>
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 space-y-4">
        <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">System Prompt</h2>

        <label className="block text-sm text-slate-700">
          AI Trợ giảng
          <textarea value={data.prompts.ai_tro_giang} onChange={(event) => setData((current) => current ? { ...current, prompts: { ...current.prompts, ai_tro_giang: event.target.value } } : current)} rows={5} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
        </label>

        <label className="block text-sm text-slate-700">
          AI Chấm bài
          <textarea value={data.prompts.ai_cham_bai} onChange={(event) => setData((current) => current ? { ...current, prompts: { ...current.prompts, ai_cham_bai: event.target.value } } : current)} rows={5} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2" />
        </label>
      </section>

      <button disabled={saving} onClick={() => void save()} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu cấu hình"}</button>
      {message && <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
>>>>>>> origin/main
    </div>
  );
}
