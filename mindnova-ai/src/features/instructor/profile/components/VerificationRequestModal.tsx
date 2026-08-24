"use client";

import React, { useState } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

interface VerificationRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function VerificationRequestModal({
  isOpen,
  onClose,
  onSuccess,
}: VerificationRequestModalProps) {
  const [formData, setFormData] = useState({
    certificate_name: "",
    issuing_organization: "",
    certificate_number: "",
    specialization: "",
    issue_date: "",
    expiry_date: "",
    verification_url: "",
    description: "",
    is_public: true,
    note: "",
  });

  const [certImage, setCertImage] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, isEvidence: boolean) => {
    if (!e.target.files) return;
    if (isEvidence) {
      setEvidenceFiles(Array.from(e.target.files));
    } else {
      if (e.target.files[0]) {
        setCertImage(e.target.files[0]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.certificate_name.trim()) {
      setErrorMsg("Vui lòng nhập tên chứng chỉ/bằng cấp.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const body = new FormData();
      body.append("certificate_name", formData.certificate_name);
      body.append("issuing_organization", formData.issuing_organization);
      body.append("certificate_number", formData.certificate_number);
      body.append("specialization", formData.specialization);
      if (formData.issue_date) body.append("issue_date", formData.issue_date);
      if (formData.expiry_date) body.append("expiry_date", formData.expiry_date);
      if (formData.verification_url) body.append("verification_url", formData.verification_url);
      body.append("description", formData.description);
      body.append("is_public", formData.is_public ? "1" : "0");

      if (certImage) {
        body.append("certificate_image", certImage);
      }

      evidenceFiles.forEach((file) => {
        body.append("evidence_files[]", file);
      });

      // 1. Upload Certificate & Evidence
      await axiosClient.post("/api/instructor/certificates", body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // 2. Submit Verification Request
      await axiosClient.post("/api/instructor/verification/request", {
        note: formData.note,
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Verification submit failed", err);
      setErrorMsg(err.response?.data?.message || "Đã xảy ra lỗi khi gửi yêu cầu. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[88vh] rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header - Fixed */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-gray-50/50 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#4648D4]">
              MindNova Verification
            </span>
            <h2 className="text-base sm:text-lg font-black text-gray-900 mt-0.5">Yêu cầu cấp tích xanh xác minh</h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 flex items-center justify-center transition-colors shadow-2xs"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {errorMsg && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs font-bold text-red-700">
                ⚠️ {errorMsg}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Tên chứng chỉ / Bằng cấp <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="VD: Bằng Thạc sĩ CNTT, IELTS 8.0..."
                  value={formData.certificate_name}
                  onChange={(e) => setFormData({ ...formData, certificate_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Đơn vị / Tổ chức cấp
                </label>
                <input
                  type="text"
                  placeholder="VD: Đại học Bách Khoa, British Council..."
                  value={formData.issuing_organization}
                  onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Số chứng chỉ (Nếu có)
                </label>
                <input
                  type="text"
                  placeholder="VD: REG-2024-88921"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Chuyên môn / Lĩnh vực
                </label>
                <input
                  type="text"
                  placeholder="VD: Lập trình Web, AI, Tiếng Anh..."
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">Ngày cấp</label>
                <input
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Ngày hết hạn (Nếu có)
                </label>
                <input
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                Link xác minh chính thức / Verification URL (Nếu có)
              </label>
              <input
                type="url"
                placeholder="https://verify.organization.com/check/..."
                value={formData.verification_url}
                onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <label className="block text-[11px] font-extrabold uppercase text-[#4648D4] mb-0.5">
                  📷 Ảnh Bằng cấp (Public)
                </label>
                <p className="text-[10px] text-gray-500 mb-1.5">Ảnh hiển thị công khai trên hồ sơ.</p>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileChange(e, false)}
                  className="text-[11px] font-semibold text-gray-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#4648D4] file:text-white hover:file:bg-[#383AB8]"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                <label className="block text-[11px] font-extrabold uppercase text-amber-800 mb-0.5">
                  🔒 Minh chứng (Private)
                </label>
                <p className="text-[10px] text-amber-700 mb-1.5">Bản công chứng, CCCD. Chỉ Admin xem được.</p>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => handleFileChange(e, true)}
                  className="text-[11px] font-semibold text-gray-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                Ghi chú cho Admin
              </label>
              <textarea
                rows={2}
                placeholder="Lời nhắn gửi Ban quản trị MindNova AI..."
                value={formData.note}
                onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-xs sm:text-sm font-semibold text-gray-900 bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#4648D4]"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="is_public"
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="w-4 h-4 rounded text-[#4648D4] focus:ring-[#4648D4]"
              />
              <label htmlFor="is_public" className="text-xs font-bold text-gray-700 cursor-pointer">
                Cho phép hiển thị thông tin bằng cấp này trên Profile công khai
              </label>
            </div>
          </div>

          {/* Footer - Fixed */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-gray-100 bg-gray-50/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-gray-600 hover:bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#4648D4] hover:bg-[#383AB8] shadow-md shadow-[#4648D4]/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <>
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang gửi hồ sơ...</span>
                </>
              ) : (
                "Gửi yêu cầu xác minh ✦"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
