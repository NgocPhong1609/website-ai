"use client";

import { useMemo, useState } from "react";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

type NotificationForm = {
  email: string;
  subject: string;
  message: string;
};

type SubmitResult = {
  message: string;
  recipient?: string;
  queue?: string;
  isError: boolean;
};

function readStoredToken(): string {
  const cookieValue = document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1];

  const cookieToken = cookieValue ? decodeURIComponent(cookieValue) : "";
  const localToken = window.localStorage.getItem("accessToken") ?? "";

  return cookieToken || localToken;
}

function getAuthHeaders(): Record<string, string> {
  const token = readStoredToken();

  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export function AdminNotificationsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState<NotificationForm>({
    email: "",
    subject: "",
    message: "",
  });
  const [result, setResult] = useState<SubmitResult | null>(null);

  const hasContent = useMemo(() => {
    return form.email.trim().length > 0 || form.subject.trim().length > 0 || form.message.trim().length > 0;
  }, [form.email, form.subject, form.message]);

  const applyTemplate = (template: "system" | "maintenance" | "course") => {
    if (template === "system") {
      setForm((current) => ({
        ...current,
        subject: "Thong bao he thong MindNova",
        message: "He thong da tiep nhan va xu ly yeu cau quan tri moi. Vui long kiem tra lai bang dieu khien de theo doi trang thai.",
      }));
      return;
    }

    if (template === "maintenance") {
      setForm((current) => ({
        ...current,
        subject: "Thong bao bao tri he thong",
        message: "He thong se bao tri trong khung 23:00 - 23:30 toi nay. Mot so chuc nang co the gian doan tam thoi.",
      }));
      return;
    }

    setForm((current) => ({
      ...current,
      subject: "Thong bao duyet noi dung khoa hoc",
      message: "Noi dung khoa hoc vua duoc cap nhat trang thai kiem duyet. Vui long dang nhap de xem chi tiet va huong dan tiep theo.",
    }));
  };

  const resetForm = () => {
    setForm({ email: "", subject: "", message: "" });
    setResult(null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setResult(null);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/notifications/test-email`, {
        method: "POST",
        headers: getAuthHeaders(),
        credentials: "include",
        body: JSON.stringify({
          email: form.email.trim() || undefined,
          subject: form.subject.trim() || undefined,
          message: form.message.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Ban khong co quyen admin hoac phien dang nhap da het han.");
        }

        throw new Error(payload?.message ?? "Gui email that bai.");
      }

      setResult({
        message: payload?.message ?? "Email da duoc dua vao hang doi.",
        recipient: payload?.meta?.recipient,
        queue: payload?.meta?.queue,
        isError: false,
      });
    } catch (error) {
      setResult({
        message: error instanceof Error ? error.message : "Gui email that bai.",
        isError: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="mn-stagger rounded-[30px] border border-cyan-200/20 bg-[linear-gradient(125deg,#14213d_0%,#113a63_45%,#0f766e_100%)] p-6 text-white shadow-[0_30px_70px_-30px_rgba(13,23,56,0.95)]">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-100/70">PB-036 · Email Notification</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Gui email thong bao tu trang quan tri</h1>
        <p className="mt-2 max-w-3xl text-sm text-slate-200/90">
          Soan noi dung thong bao va dua vao queue de he thong gui nen. Endpoint su dung: POST /api/admin/notifications/test-email.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-cyan-100/80 bg-white/95 p-5 shadow-[0_20px_45px_-28px_rgba(13,23,56,0.45)]"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Noi dung thong bao</h2>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => applyTemplate("system")}
                className="rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1 text-xs font-semibold text-cyan-700 transition hover:bg-cyan-100"
              >
                Mau he thong
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("maintenance")}
                className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700 transition hover:bg-indigo-100"
              >
                Mau bao tri
              </button>
              <button
                type="button"
                onClick={() => applyTemplate("course")}
                className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-700 transition hover:bg-teal-100"
              >
                Mau khoa hoc
              </button>
            </div>
          </div>

          <div className="grid gap-4">
            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Email nguoi nhan (tuy chon)</span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                placeholder="de trong de gui cho email admin dang dang nhap"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Tieu de</span>
              <input
                value={form.subject}
                onChange={(event) => setForm((current) => ({ ...current, subject: event.target.value }))}
                placeholder="MindNova Admin Notification"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>

            <label className="space-y-1 text-sm text-slate-700">
              <span className="font-medium">Noi dung</span>
              <textarea
                value={form.message}
                onChange={(event) => setForm((current) => ({ ...current, message: event.target.value }))}
                placeholder="Thong bao he thong tu trang quan tri MindNova."
                rows={8}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-cyan-400"
              />
            </label>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_-16px_rgba(79,70,229,0.9)] transition hover:from-cyan-500 hover:to-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Dang gui vao queue..." : "Gui email thong bao"}
            </button>

            <button
              type="button"
              onClick={resetForm}
              disabled={isSubmitting || !hasContent}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Lam moi form
            </button>
          </div>

          {result && (
            <div
              className={`mt-4 rounded-xl px-3 py-3 text-sm ${
                result.isError ? "bg-rose-50 text-rose-700 ring-1 ring-rose-100" : "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
              }`}
            >
              <p className="font-medium">{result.message}</p>
              {!result.isError && (
                <p className="mt-1 text-xs text-emerald-700/90">
                  Recipient: {result.recipient ?? "(admin hien tai)"} · Queue: {result.queue ?? "default"}
                </p>
              )}
            </div>
          )}
        </form>

        <aside className="space-y-4">
          <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4 shadow-[0_16px_35px_-24px_rgba(14,23,52,0.45)]">
            <h3 className="text-base font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Trang thai chuc nang</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>Route API: /api/admin/notifications/test-email</li>
              <li>Phuong thuc: POST</li>
              <li>Delivery: Queue (database)</li>
              <li>Auth: Bearer token admin</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-amber-100/80 bg-amber-50/70 p-4 shadow-[0_16px_35px_-24px_rgba(120,53,15,0.25)]">
            <h3 className="text-base font-semibold text-amber-900 [font-family:var(--font-admin-head)]">Checklist van hanh</h3>
            <ol className="mt-3 space-y-2 text-sm text-amber-900/85">
              <li>1. Kiem tra MAIL_HOST, MAIL_PORT, MAIL_FROM trong backend .env</li>
              <li>2. Chay php artisan migrate neu chua co jobs table</li>
              <li>3. Chay php artisan queue:work de xu ly email</li>
            </ol>
          </div>
        </aside>
      </section>
    </div>
  );
}
