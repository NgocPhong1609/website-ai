"use client";

import { useId, useState, type FormEvent } from "react";
import { adminApi } from "../lib/admin-api";
import { getErrorMessage } from "@/src/shared/lib/user-error";

type RecoveryLink = { reset_url: string; expires_at: string };
export function AdminPasswordRecovery({ user, onClose }: { user: { id: number; email: string }; onClose: () => void }) {
  const id = useId();
  const [password, setPassword] = useState("");
  const [note, setNote] = useState("");
  const [result, setResult] = useState<RecoveryLink | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function issue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy || !password || note.trim().length < 20) return;
    setBusy(true);
    setError(null);
    try {
      const link = await adminApi<RecoveryLink>(`/admin/users/${user.id}/password-recovery`, {
        method: "POST", body: JSON.stringify({ current_password: password, verification_note: note.trim() }),
      });
      setPassword("");
      setResult(link);
    } catch (failure) {
      setError(getErrorMessage(failure, "Không thể cấp liên kết khôi phục. Vui lòng thử lại."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby={`${id}-title`} className="space-y-3 rounded-2xl border border-blue-200 bg-blue-50 p-5 text-sm text-slate-900">
      <div className="flex items-center justify-between gap-4"><h2 id={`${id}-title`} className="text-lg font-semibold">Khôi phục cho {user.email}</h2><button type="button" disabled={busy} onClick={onClose} className="text-blue-700 hover:underline">Đóng khôi phục</button></div>
      <p>Chỉ cấp liên kết sau khi xác minh chủ tài khoản bằng bằng chứng độc lập và kênh liên hệ đã lưu trước đó. Email hoặc kênh liên hệ do người yêu cầu tự khai không đủ để xác minh. Không yêu cầu họ cung cấp mật khẩu hoặc mã khôi phục.</p>
      {error && <p role="alert" className="text-rose-700">{error}</p>}
      {result ? (
        <div className="space-y-2">
          <label htmlFor={`${id}-link`} className="block font-medium">Liên kết khôi phục</label>
          <textarea id={`${id}-link`} readOnly value={result.reset_url} onFocus={e => e.target.select()} rows={3} className="w-full rounded-xl border border-slate-200 bg-white p-3 text-sm" />
          <p>Hết hạn lúc {new Date(result.expires_at).toLocaleString("vi-VN")}. Chỉ dùng một lần. Chuyển liên kết qua kênh đã xác minh, không dán vào ghi chú hỗ trợ công khai. Liên kết sẽ ẩn khi đóng khung này.</p>
        </div>
      ) : (
        <form onSubmit={issue} className="space-y-3">
          <label htmlFor={`${id}-password`} className="block">Mật khẩu quản trị viên</label>
          <input id={`${id}-password`} type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          <label htmlFor={`${id}-note`} className="block">Cách đã xác minh chủ tài khoản</label>
          <textarea id={`${id}-note`} required minLength={20} maxLength={1000} rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2" />
          <button type="submit" disabled={busy || !password || note.trim().length < 20} className="rounded-xl bg-[#3B82F6] px-4 py-2 font-semibold text-white hover:bg-[#2563EB] disabled:opacity-50">{busy ? "Đang cấp…" : "Cấp liên kết khôi phục"}</button>
        </form>
      )}
    </section>
  );
}
