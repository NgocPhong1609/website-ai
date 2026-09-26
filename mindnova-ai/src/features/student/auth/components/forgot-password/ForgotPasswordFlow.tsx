"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import Link from "next/link";
import { getErrorMessage, readApiResponse } from "@/src/shared/lib/user-error";
import { LogoMark } from "../login/AuthShared";

const inputClass = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-blue-500 focus:outline-none";
const buttonClass = "w-full rounded-xl bg-[#3B82F6] px-4 py-3 text-sm font-semibold text-white hover:bg-[#2563EB] disabled:opacity-50";

export function ForgotPasswordFlow() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [contact, setContact] = useState("");
  const [description, setDescription] = useState("");
  const [support, setSupport] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fragment = new URLSearchParams(window.location.hash.slice(1));
    if (fragment.has("recovery_code")) {
      setEmail(fragment.get("email") ?? "");
      setCode(fragment.get("recovery_code") ?? "");
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    if (!support && password !== confirmation) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setBusy(true);
    try {
      const response = await fetch(support ? "/api/password-recovery/support" : "/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(support
          ? { email: email.trim(), contact: contact.trim(), description: description.trim() }
          : { email: email.trim(), recovery_code: code.trim(), password, password_confirmation: confirmation }),
      });
      await readApiResponse(response, "Không thể hoàn tất yêu cầu. Vui lòng thử lại.");
      if (support) {
        setSubmitted(true);
        setContact("");
        setDescription("");
      } else {
        setCode("");
        setPassword("");
        setConfirmation("");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userInfo");
        document.cookie = "accessToken=; path=/; max-age=0; samesite=lax";
        document.cookie = "userRole=; path=/; max-age=0; samesite=lax";
        setSuccess(true);
      }
    } catch (failure) {
      setError(getErrorMessage(failure, "Không thể hoàn tất yêu cầu. Vui lòng thử lại."));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex h-full w-full flex-col px-8 py-8 sm:px-10">
      <div className="mb-6 flex items-center gap-2.5"><LogoMark /><span className="text-sm font-bold text-slate-900">MindNova AI</span></div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">{success ? "Thành công!" : support ? "Hỗ trợ khôi phục tài khoản" : "Quên mật khẩu"}</h1>
      {success ? (
        <div className="space-y-5 text-sm text-slate-600">
          <p>Mật khẩu đã được cập nhật. Các phiên đăng nhập và mã khôi phục cũ đã bị vô hiệu hóa. Sau khi đăng nhập, hãy tạo bộ mã mới trong phần bảo mật.</p>
          <Link href="/login" className={`${buttonClass} block text-center`}>Đăng nhập ngay</Link>
        </div>
      ) : (
        <>
          <p className="mb-5 text-sm text-slate-600">{support
            ? "Quản trị viên sẽ xem xét yêu cầu và cần xác minh bạn là chủ tài khoản trước khi hỗ trợ. Không gửi mật khẩu hoặc mã khôi phục trong nội dung yêu cầu."
            : "Nhập một mã khôi phục bạn đã lưu trong phần bảo mật, hoặc dùng liên kết do quản trị viên cấp. Mã chỉ dùng một lần; sau khi đặt lại mật khẩu, toàn bộ bộ mã cũ sẽ hết hiệu lực."}</p>
          {error && <p role="alert" className="mb-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-800">{error}</p>}
          {submitted && support ? (
            <p role="status" className="rounded-xl bg-blue-50 p-4 text-sm text-blue-800">Đã tiếp nhận yêu cầu hỗ trợ. Nếu thông tin phù hợp, quản trị viên sẽ liên hệ để xác minh. Việc gửi yêu cầu chưa thay đổi mật khẩu của bạn.</p>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div><label htmlFor={`${id}-email`} className="mb-1 block text-sm">Email</label><input id={`${id}-email`} type="email" autoComplete="email" required maxLength={255} value={email} onChange={e => setEmail(e.target.value)} className={inputClass} /></div>
              {support ? (
                <>
                  <div><label htmlFor={`${id}-contact`} className="mb-1 block text-sm">Kênh liên hệ</label><input id={`${id}-contact`} required maxLength={255} value={contact} onChange={e => setContact(e.target.value)} placeholder="Số điện thoại hoặc tài khoản liên hệ" className={inputClass} /></div>
                  <div><label htmlFor={`${id}-description`} className="mb-1 block text-sm">Thông tin hỗ trợ xác minh</label><textarea id={`${id}-description`} required minLength={20} maxLength={2000} rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Mô tả vấn đề và thông tin giúp quản trị viên xác minh tài khoản" className={inputClass} /></div>
                </>
              ) : (
                <>
                  <div><label htmlFor={`${id}-code`} className="mb-1 block text-sm">Mã khôi phục</label><input id={`${id}-code`} type="password" autoComplete="off" required maxLength={100} value={code} onChange={e => setCode(e.target.value)} className={inputClass} /></div>
                  <div><label htmlFor={`${id}-password`} className="mb-1 block text-sm">Mật khẩu mới</label><input id={`${id}-password`} type="password" autoComplete="new-password" required minLength={8} maxLength={128} value={password} onChange={e => setPassword(e.target.value)} className={inputClass} /><p className="mt-1 text-xs text-slate-500">Ít nhất 8 ký tự, gồm chữ hoa, chữ số và ký tự đặc biệt.</p></div>
                  <div><label htmlFor={`${id}-confirm`} className="mb-1 block text-sm">Xác nhận mật khẩu</label><input id={`${id}-confirm`} type="password" autoComplete="new-password" required value={confirmation} onChange={e => setConfirmation(e.target.value)} className={inputClass} /></div>
                </>
              )}
              <button type="submit" disabled={busy} className={buttonClass}>{busy ? "Đang xử lý…" : support ? "Gửi yêu cầu hỗ trợ" : "Đặt lại mật khẩu"}</button>
            </form>
          )}
          <button type="button" disabled={busy} onClick={() => { setSupport(!support); setError(null); setCode(""); setPassword(""); setConfirmation(""); }} className="mt-5 text-sm font-semibold text-blue-600 hover:underline">{support ? "Tôi có mã khôi phục" : "Tôi không có mã khôi phục"}</button>
          <Link href="/login" className="mt-4 text-center text-sm text-slate-600 hover:underline">Quay lại đăng nhập</Link>
        </>
      )}
    </div>
  );
}
