"use client";

import { useEffect, useState } from "react";
import { adminApi } from "@/src/features/admin/lib/admin-api";

type FlagRow = {
  id: number;
  source: string;
  reason: string;
  status: string;
  input_text?: string | null;
  created_at?: string;
};

type TicketRow = {
  id: number;
  type: string;
  title: string;
  description: string;
  status: string;
  resolution?: string | null;
};

export function AdminModerationSupportPage() {
  const [flags, setFlags] = useState<FlagRow[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [ticketForm, setTicketForm] = useState({ type: "system_error", title: "", description: "" });

  const loadData = async () => {
    setMessage(null);

    try {
      const [flagsRes, ticketsRes] = await Promise.all([
        adminApi<{ data: FlagRow[] }>("/admin/moderation/flags"),
        adminApi<{ data: TicketRow[] }>("/admin/support/tickets"),
      ]);

      setFlags(flagsRes.data);
      setTickets(ticketsRes.data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Không thể tải moderation/support.");
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

  const reviewFlag = async (flagId: number, status: "approved" | "rejected") => {
    try {
      await adminApi(`/admin/moderation/flags/${flagId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, review_notes: status === "approved" ? "Vi pham chinh sach" : "False positive" }),
      });
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Kiểm duyệt flag thất bại.");
    }
  };

  const createTicket = async () => {
    try {
      await adminApi("/admin/support/tickets", {
        method: "POST",
        body: JSON.stringify(ticketForm),
      });
      setTicketForm({ type: "system_error", title: "", description: "" });
      setMessage("Đã tiếp nhận ticket.");
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Tạo ticket thất bại.");
    }
  };

  const resolveTicket = async (ticketId: number, status: "in_progress" | "resolved" | "rejected") => {
    try {
      await adminApi(`/admin/support/tickets/${ticketId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, resolution: status === "resolved" ? "Da xu ly xong." : "Dang xu ly." }),
      });
      await loadData();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Cập nhật ticket thất bại.");
    }
  };

  return (
    <div className="space-y-6 p-6 lg:p-8 [font-family:var(--font-admin-body)]">
      <section className="rounded-[28px] border border-cyan-200/20 bg-[linear-gradient(120deg,#1f2937_0%,#0f766e_46%,#115e59_100%)] p-6 text-white shadow-[0_30px_70px_-35px_rgba(7,18,45,0.85)]">
        <p className="text-xs uppercase tracking-[0.34em] text-cyan-100/70">Moderation & Support</p>
        <h1 className="mt-2 text-3xl font-semibold [font-family:var(--font-admin-head)]">Kiểm duyệt nội dung và xử lý khiếu nại</h1>
        <p className="mt-2 text-sm text-slate-100/90">Flag nội dung AI độc hại để admin xử lý thủ công, và tiếp nhận/phản hồi ticket lỗi hệ thống, tranh chấp chấm điểm.</p>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Flag nội dung độc hại</h2>
          <div className="space-y-2">
            {flags.map((flag) => (
              <div key={flag.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">#{flag.id} · {flag.reason} · {flag.status}</p>
                <p className="mt-1 text-xs text-slate-500">{flag.input_text?.slice(0, 180) || "(không có nội dung)"}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => void reviewFlag(flag.id, "approved")} className="rounded-lg bg-rose-100 px-2 py-1 text-xs font-semibold text-rose-800">Xác nhận vi phạm</button>
                  <button onClick={() => void reviewFlag(flag.id, "rejected")} className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">False positive</button>
                </div>
              </div>
            ))}

            {flags.length === 0 && <p className="text-sm text-slate-500">Chưa có flag.</p>}
          </div>
        </div>

        <div className="rounded-2xl border border-cyan-100/80 bg-white/95 p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900 [font-family:var(--font-admin-head)]">Tiếp nhận khiếu nại/báo lỗi</h2>
          <div className="grid gap-2">
            <select value={ticketForm.type} onChange={(e) => setTicketForm((s) => ({ ...s, type: e.target.value }))} className="rounded-xl border border-slate-200 px-3 py-2 text-sm">
              <option value="system_error">Lỗi hệ thống</option>
              <option value="grading_dispute">Tranh chấp chấm điểm</option>
              <option value="abuse_report">Báo cáo vi phạm</option>
              <option value="other">Khác</option>
            </select>
            <input value={ticketForm.title} onChange={(e) => setTicketForm((s) => ({ ...s, title: e.target.value }))} placeholder="Tiêu đề" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <textarea value={ticketForm.description} onChange={(e) => setTicketForm((s) => ({ ...s, description: e.target.value }))} placeholder="Mô tả" rows={4} className="rounded-xl border border-slate-200 px-3 py-2 text-sm" />
            <button onClick={() => void createTicket()} className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-semibold text-white">Tạo ticket</button>
          </div>

          <div className="mt-4 space-y-2">
            {tickets.map((ticket) => (
              <div key={ticket.id} className="rounded-lg border border-slate-200 p-3">
                <p className="text-sm font-medium text-slate-900">#{ticket.id} · {ticket.title}</p>
                <p className="text-xs text-slate-600">{ticket.type} · {ticket.status}</p>
                <p className="mt-1 text-xs text-slate-500">{ticket.description.slice(0, 160)}</p>
                <div className="mt-2 flex gap-2">
                  <button onClick={() => void resolveTicket(ticket.id, "in_progress")} className="rounded-lg bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">Đang xử lý</button>
                  <button onClick={() => void resolveTicket(ticket.id, "resolved")} className="rounded-lg bg-emerald-100 px-2 py-1 text-xs font-semibold text-emerald-800">Đã xong</button>
                  <button onClick={() => void resolveTicket(ticket.id, "rejected")} className="rounded-lg bg-slate-200 px-2 py-1 text-xs font-semibold text-slate-700">Từ chối</button>
                </div>
              </div>
            ))}

            {tickets.length === 0 && <p className="text-sm text-slate-500">Chưa có ticket.</p>}
          </div>
        </div>
      </section>

      {message && <p className="rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-700">{message}</p>}
    </div>
  );
}
