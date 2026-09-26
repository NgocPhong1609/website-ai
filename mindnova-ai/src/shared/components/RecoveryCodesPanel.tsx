"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { axiosClient } from "@/src/shared/lib/axios";
import { getErrorMessage } from "@/src/shared/lib/user-error";

export function RecoveryCodesPanel() {
  const id = useId();
  const [remaining, setRemaining] = useState<number | null>(null);
  const [codes, setCodes] = useState<string[]>([]);
  const [password, setPassword] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setError(null);
    try {
      const { data } = await axiosClient.get<{ remaining: number }>("/api/profile/recovery-codes");
      setRemaining(data.remaining);
    } catch (failure) {
      setError(getErrorMessage(failure, "Không thể tải thông tin mã khôi phục. Vui lòng thử lại."));
    }
  }
  useEffect(() => { void load(); }, []);

  async function generate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (remaining === null || !password || (remaining > 0 && !confirmed) || busy) return;
    setBusy(true);
    setError(null);
    setCodes([]);
    try {
      const { data } = await axiosClient.post<{ codes: string[] }>("/api/profile/recovery-codes", { current_password: password });
      setCodes(data.codes);
      setRemaining(data.codes.length);
      setPassword("");
      setConfirmed(false);
    } catch (failure) {
      setError(getErrorMessage(failure, "Không thể tạo mã khôi phục. Vui lòng thử lại."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <section aria-labelledby={`${id}-title`} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900">
      <h2 id={`${id}-title`} className="text-lg font-semibold">Mã khôi phục tài khoản</h2>
      <p className="text-sm text-slate-600">Tạo và lưu mã ở nơi riêng tư để đặt lại mật khẩu khi quên. Mã chỉ hiển thị lúc tạo. Không chia sẻ mã với người khác, kể cả người tự xưng là hỗ trợ.</p>
      <p className="text-sm font-medium">{remaining === null ? "Đang tải thông tin mã…" : remaining > 0 ? `Còn ${remaining} mã khôi phục chưa dùng.` : "Chưa có mã khôi phục. Hãy tạo mã khi bạn còn đăng nhập được."}</p>
      {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
      {remaining === null && error && <button type="button" onClick={() => void load()} className="text-sm text-blue-600">Tải lại thông tin mã</button>}
      <form onSubmit={generate} className="max-w-xl space-y-3">
        <label htmlFor={`${id}-password`} className="block text-sm">Mật khẩu để tạo mã khôi phục</label>
        <input id={`${id}-password`} type="password" autoComplete="current-password" required maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" />
        {remaining !== null && remaining > 0 && <label className="flex items-start gap-2 text-sm text-slate-600"><input type="checkbox" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} className="mt-1" />Tôi hiểu tạo bộ mã mới sẽ vô hiệu hóa toàn bộ mã khôi phục cũ.</label>}
        <button type="submit" disabled={busy || remaining === null || !password || (remaining > 0 && !confirmed)} className="rounded-xl bg-[#3B82F6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#2563EB] disabled:opacity-50">{busy ? "Đang tạo…" : "Tạo bộ mã mới"}</button>
      </form>
      {codes.length > 0 && (
        <div className="space-y-3 rounded-xl bg-blue-50 p-4">
          <p className="text-sm font-semibold text-blue-900">Lưu các mã dưới đây ngay. Bạn không thể xem lại sau khi đóng trang.</p>
          <ul className="space-y-1 break-all font-mono text-sm text-slate-900">{codes.map(code => <li key={code}>{code}</li>)}</ul>
          <p className="text-xs text-slate-600">Mỗi mã chỉ dùng một lần. Khi khôi phục mật khẩu thành công, cả bộ mã sẽ bị vô hiệu hóa; hãy tạo bộ mới sau khi đăng nhập lại.</p>
          <button type="button" onClick={() => setCodes([])} className="rounded-lg border border-blue-200 bg-white px-3 py-2 text-sm font-semibold text-blue-700">Tôi đã lưu mã, ẩn mã</button>
        </div>
      )}
    </section>
  );
}
