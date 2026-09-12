"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "@/src/features/admin/lib/admin-api";
import type { AdminAiSystemData, AiPeriod, WritableAiConfig } from "../ai-system/types";
import { validateAiConfig, type AiConfigErrors } from "../ai-system/validation";
import { normalizeAiPrompts } from "../ai-system/prompts";
import { AiUsageSummary } from "./ai-system/AiUsageSummary";
import { AiProviderStatus } from "./ai-system/AiProviderStatus";
import { AiPackageEditor } from "./ai-system/AiPackageEditor";
import { AiPromptEditor } from "./ai-system/AiPromptEditor";

function writable(data: AdminAiSystemData): WritableAiConfig {
  return { packages: data.packages, prompts: normalizeAiPrompts(data.prompts) };
}

type PageError = { message: string; origin: "load" | "save" | "validation" };

export function AdminAiSystemPage() {
  const [data, setData] = useState<AdminAiSystemData | null>(null);
  const [draft, setDraft] = useState<WritableAiConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<PageError | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<AiConfigErrors>({});
  const [pendingPeriod, setPendingPeriod] = useState<AiPeriod | null>(null);
  const inFlight = useRef(false);
  const keepEditingButton = useRef<HTMLButtonElement>(null);
  const form = useRef<HTMLFormElement>(null);
  const period = data?.usage.period ?? "7d";
  const dirty = Boolean(data && draft && JSON.stringify(writable(data)) !== JSON.stringify(draft));

  const loadData = useCallback(async (nextPeriod: AiPeriod) => {
    setLoading(true);
    setError(null);
    try {
      const payload = await adminApi<AdminAiSystemData>(`/admin/ai-config?period=${nextPeriod}`);
      setData(payload);
      setDraft(writable(payload));
      setErrors({});
      return true;
    } catch (cause) {
      setError({ origin: "load", message: cause instanceof Error ? cause.message : "Không thể tải cấu hình AI." });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    adminApi<AdminAiSystemData>("/admin/ai-config?period=7d").then((payload) => {
      if (!active) return;
      setData(payload);
      setDraft(writable(payload));
    }).catch((cause: unknown) => {
      if (active) setError({ origin: "load", message: cause instanceof Error ? cause.message : "Không thể tải cấu hình AI." });
    }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const refresh = useCallback(async (nextPeriod: AiPeriod, discard = false) => {
    if (loading || saving || inFlight.current) return;
    if (dirty && !discard) {
      setPendingPeriod(nextPeriod);
      return;
    }
    inFlight.current = true;
    setPendingPeriod(null);
    setMessage(null);
    await loadData(nextPeriod);
    inFlight.current = false;
  }, [dirty, loading, saving, loadData]);

  useEffect(() => {
    const handleRefresh = () => { void refresh(period); };
    window.addEventListener("admin:refresh-data", handleRefresh);
    return () => window.removeEventListener("admin:refresh-data", handleRefresh);
  }, [period, refresh]);

  useEffect(() => { if (pendingPeriod) keepEditingButton.current?.focus(); }, [pendingPeriod]);

  useEffect(() => {
    if (error?.origin === "validation") form.current?.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus();
  }, [error]);

  const save = async () => {
    if (!draft || saving || loading || inFlight.current) return;
    const nextErrors = validateAiConfig(draft);
    setErrors(nextErrors);
    setMessage(null);
    setError(null);
    if (Object.keys(nextErrors).length) {
      setError({ origin: "validation", message: "Kiểm tra các trường được đánh dấu trước khi lưu." });
      return;
    }
    inFlight.current = true;
    setSaving(true);
    try {
      await adminApi<{ message: string }>("/admin/ai-config", { method: "PUT", body: JSON.stringify(draft) });
      setMessage("Đã lưu cấu hình AI.");
      await loadData(period);
    } catch (cause) {
      setError({ origin: "save", message: cause instanceof Error ? cause.message : "Lưu cấu hình thất bại." });
    } finally {
      setSaving(false);
      inFlight.current = false;
    }
  };

  const cancel = () => {
    if (!data) return;
    setDraft(writable(data));
    setErrors({});
    setError(null);
    setMessage(null);
    setPendingPeriod(null);
  };

  return <div className="space-y-4 px-4 pb-5 pt-2.5 text-[#0F172A] [font-family:var(--font-admin-body)] lg:px-6">
    <header className="rounded-2xl border border-[#E2E8F0]/20 bg-[linear-gradient(125deg,#0f1a3c_0%,#183067_45%,#0284c7_100%)] px-5 py-4 text-white shadow-md">
      <p className="text-[10px] uppercase tracking-[0.25em] text-white/75">AI & System Configuration</p>
      <h1 className="mt-1 text-xl font-semibold [font-family:var(--font-admin-head)] sm:text-2xl">Cấu hình AI & hệ thống</h1>
      <p className="mt-2 text-sm leading-6 text-white/90">Theo dõi sử dụng AI, quản lý hạn mức Free/Premium và nội dung hướng dẫn AI.</p>
    </header>

    {error && <div role="alert" className="flex flex-wrap items-center justify-between gap-3 rounded-xl bg-rose-50 p-3 text-sm text-rose-700">
      <div><p>{error.message}</p>{error.origin === "save" && <p className="mt-1">Thay đổi của bạn vẫn được giữ. Kiểm tra cấu hình rồi lưu lại.</p>}</div>
      {error.origin === "load" && <button type="button" disabled={loading || saving} onClick={() => void refresh(period)} className="rounded-xl border border-red-200 px-3 py-2 font-semibold disabled:opacity-60">Thử lại</button>}
      {error.origin === "save" && <button type="button" disabled={loading || saving} onClick={() => void save()} className="rounded-xl border border-red-200 px-3 py-2 font-semibold disabled:opacity-60">Lưu lại</button>}
    </div>}
    {message && <p role="status" className="rounded-xl bg-teal-50 p-3 text-sm text-teal-800">{message}</p>}

    {loading && !data ? <div role="status" aria-busy="true" className="space-y-4">
      <p className="text-sm text-slate-600">Đang tải cấu hình AI...</p>
      <div aria-hidden="true" className="grid animate-pulse gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => <div key={item} className="h-28 rounded-2xl bg-slate-200/60" />)}
      </div>
      <div aria-hidden="true" className="h-56 animate-pulse rounded-2xl bg-slate-200/60" />
      <div aria-hidden="true" className="h-48 animate-pulse rounded-2xl bg-slate-200/60" />
    </div> : data && draft && <>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div><h2 className="text-lg font-semibold">Sử dụng AI</h2><p className="mt-1 text-xs text-slate-600">{data.updated_at ? `Cấu hình cập nhật: ${new Date(data.updated_at).toLocaleString("vi-VN")}` : "Đang sử dụng cấu hình mặc định."}</p></div>
        <label className="text-xs text-slate-600">Khoảng thời gian
          <select value={period} disabled={loading || saving} onChange={(event) => void refresh(event.target.value as AiPeriod)} className="ml-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-[#0F172A]">
            <option value="7d">7 ngày</option><option value="30d">30 ngày</option>
          </select>
        </label>
      </div>
      {loading && <p role="status" aria-busy="true" className="text-sm text-slate-600">Đang tải lại dữ liệu...</p>}
      {pendingPeriod && <div role="alertdialog" aria-labelledby="discard-title" aria-describedby="discard-description" className="rounded-2xl border border-orange-200 bg-orange-50 p-4" onKeyDown={(event) => { if (event.key === "Escape") setPendingPeriod(null); }}>
        <h2 id="discard-title" className="font-semibold">Bỏ thay đổi chưa lưu?</h2>
        <p id="discard-description" className="mt-1 text-sm">Tải lại sẽ thay thế hạn mức và nội dung bạn đang chỉnh sửa.</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button ref={keepEditingButton} type="button" onClick={() => setPendingPeriod(null)} className="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm">Tiếp tục chỉnh sửa</button>
          <button type="button" onClick={() => void refresh(pendingPeriod, true)} className="rounded-xl bg-slate-900 px-3 py-2 text-sm text-white">Bỏ thay đổi và tải lại</button>
        </div>
      </div>}
      <AiUsageSummary usage={data.usage} />
      <AiProviderStatus providers={data.providers} />
      <form ref={form} noValidate onSubmit={(event) => { event.preventDefault(); void save(); }} className="space-y-4">
        <AiPackageEditor packages={draft.packages} errors={errors.packages} disabled={loading || saving}
          onChange={(tier, field, value) => setDraft((current) => current ? { ...current, packages: { ...current.packages, [tier]: { ...current.packages[tier], [field]: value } } } : current)} />
        <AiPromptEditor prompts={draft.prompts} errors={errors.prompts} disabled={loading || saving}
          onChange={(name, value) => setDraft((current) => current ? { ...current, prompts: { ...current.prompts, [name]: value } } : current)} />
        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={!dirty || loading || saving} className="rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB] disabled:opacity-60">{saving ? "Đang lưu..." : "Lưu cấu hình"}</button>
          <button type="button" disabled={!dirty || loading || saving} onClick={cancel} className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold disabled:opacity-60">Hủy thay đổi</button>
          {dirty && <p className="text-xs text-slate-600">Có thay đổi chưa lưu.</p>}
        </div>
      </form>
    </>}
  </div>;
}
