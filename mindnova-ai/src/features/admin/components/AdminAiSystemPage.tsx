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
    <div className="space-y-4 px-5 lg:px-6 pt-2.5 pb-5 [font-family:var(--font-admin-body)]">
      <section className="rounded-2xl border border-cyan-200/20 bg-[linear-gradient(120deg,#1e293b_0%,#0f766e_55%,#0369a1_100%)] py-3.5 px-5 text-white shadow-[0_20px_50px_-25px_rgba(7,18,45,0.85)]">
        <p className="text-[10px] uppercase tracking-[0.34em] text-cyan-100/70">AI & System Configuration</p>
        <h1 className="mt-1 text-2xl font-semibold [font-family:var(--font-admin-head)]">Quản lý cấu hình AI và hạn mức sử dụng</h1>
        <p className="mt-1 text-xs text-slate-100/90">Quản lý API key provider, quota Student/Guest, và System Prompt cho AI trợ giảng/chấm bài.</p>
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
    </div>
  );
}
