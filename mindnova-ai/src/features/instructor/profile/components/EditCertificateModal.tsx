"use client";

import React, { useState, useEffect } from "react";
import { axiosClient } from "@/src/shared/lib/axios";

interface EditCertificateModalProps {
  isOpen: boolean;
  certificate: any | null;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCertificateModal({
  isOpen,
  certificate,
  onClose,
  onSuccess,
}: EditCertificateModalProps) {
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
  });

  const [certImage, setCertImage] = useState<File | null>(null);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (certificate) {
      setFormData({
        certificate_name: certificate.certificate_name || "",
        issuing_organization: certificate.issuing_organization || "",
        certificate_number: certificate.certificate_number || "",
        specialization: certificate.specialization || "",
        issue_date: certificate.issue_date ? certificate.issue_date.split("T")[0] : "",
        expiry_date: certificate.expiry_date ? certificate.expiry_date.split("T")[0] : "",
        verification_url: certificate.verification_url || "",
        description: certificate.description || "",
        is_public: certificate.is_public !== undefined ? Boolean(certificate.is_public) : true,
      });
      setCertImage(null);
      setEvidenceFiles([]);
      setErrorMsg("");
    }
  }, [certificate]);

  if (!isOpen || !certificate) return null;

  const isApproved = certificate.verification_status === "approved";

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
    if (isApproved) {
      setErrorMsg("Bằng cấp đã được xác minh không thể chỉnh sửa.");
      return;
    }

    if (!formData.certificate_name.trim()) {
      setErrorMsg("Vui lòng nhập tên chứng chỉ/bằng cấp.");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMsg("");

      const body = new FormData();
      body.append("_method", "PUT");
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

      await axiosClient.post(`/api/instructor/certificates/${certificate.id}`, body, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Certificate update failed", err);
      setErrorMsg(err.response?.data?.message || "Đã xảy ra lỗi khi cập nhật bằng cấp. Vui lòng thử lại.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-3 sm:p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-xl max-h-[88vh] rounded-3xl bg-white shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 bg-[#FEFCF9]/50 shrink-0">
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-[#C0392B]">
              MindNova Certificate Manager
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#2C3039] mt-0.5">Chỉnh sửa Bằng cấp / Chứng chỉ</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-[#E8E2D9] text-[#8A8478] hover:bg-gray-100 flex items-center justify-center transition-colors shadow-2xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-col min-h-0 flex-1">
          <div className="flex-1 overflow-y-auto p-5 space-y-3.5">
            {isApproved && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs font-bold text-amber-800">
                🔒 Bằng cấp đã được Admin xác minh chính thức. Không thể chỉnh sửa thông tin.
              </div>
            )}

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
                  disabled={isApproved}
                  placeholder="VD: Bằng Thạc sĩ CNTT, IELTS 8.0..."
                  value={formData.certificate_name}
                  onChange={(e) => setFormData({ ...formData, certificate_name: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Đơn vị / Tổ chức cấp
                </label>
                <input
                  type="text"
                  disabled={isApproved}
                  placeholder="VD: Đại học Bách Khoa, British Council..."
                  value={formData.issuing_organization}
                  onChange={(e) => setFormData({ ...formData, issuing_organization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
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
                  disabled={isApproved}
                  placeholder="VD: REG-2024-88921"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData({ ...formData, certificate_number: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Chuyên môn / Lĩnh vực
                </label>
                <input
                  type="text"
                  disabled={isApproved}
                  placeholder="VD: Lập trình Web, AI, Tiếng Anh..."
                  value={formData.specialization}
                  onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">Ngày cấp</label>
                <input
                  type="date"
                  disabled={isApproved}
                  value={formData.issue_date}
                  onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                  Ngày hết hạn (Nếu có)
                </label>
                <input
                  type="date"
                  disabled={isApproved}
                  value={formData.expiry_date}
                  onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                Link xác minh chính thức / Verification URL (Nếu có)
              </label>
              <input
                type="url"
                disabled={isApproved}
                placeholder="https://verify.organization.com/check/..."
                value={formData.verification_url}
                onChange={(e) => setFormData({ ...formData, verification_url: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-indigo-50/50 border border-indigo-100">
                <label className="block text-[11px] font-extrabold uppercase text-[#C0392B] mb-0.5">
                  Cập nhật Ảnh Bằng cấp (Public)
                </label>
                <p className="text-[10px] text-[#8A8478] mb-1.5">Để trống nếu muốn giữ ảnh hiện tại.</p>
                <input
                  type="file"
                  disabled={isApproved}
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => handleFileChange(e, false)}
                  className="text-[11px] font-semibold text-gray-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-[#C0392B] file:text-white hover:file:bg-[#383AB8] disabled:opacity-50"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200">
                <label className="block text-[11px] font-extrabold uppercase text-amber-800 mb-0.5">
                  Bổ sung Minh chứng (Private)
                </label>
                <p className="text-[10px] text-amber-700 mb-1.5">Bản công chứng, CCCD mới (nếu có).</p>
                <input
                  type="file"
                  multiple
                  disabled={isApproved}
                  accept="image/jpeg,image/png,image/webp,application/pdf"
                  onChange={(e) => handleFileChange(e, true)}
                  className="text-[11px] font-semibold text-gray-700 file:mr-2 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-amber-600 file:text-white hover:file:bg-amber-700 disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-extrabold uppercase text-gray-700 mb-1">
                Mô tả chi tiết bằng cấp
              </label>
              <textarea
                rows={2}
                disabled={isApproved}
                placeholder="Mô tả nội dung chương trình đào tạo..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-xl border border-[#E8E2D9] text-xs sm:text-sm font-semibold text-[#2C3039] bg-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C0392B] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <div className="flex items-center gap-2 pt-1">
              <input
                type="checkbox"
                id="edit_is_public"
                disabled={isApproved}
                checked={formData.is_public}
                onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
                className="w-4 h-4 rounded text-[#C0392B] focus:ring-[#C0392B] disabled:opacity-50"
              />
              <label htmlFor="edit_is_public" className="text-xs font-bold text-gray-700 cursor-pointer">
                Cho phép hiển thị thông tin bằng cấp này trên Profile công khai
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2.5 px-5 py-3 border-t border-gray-100 bg-[#FEFCF9]/50 shrink-0">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-extrabold text-[#8A8478] hover:bg-gray-200 transition-colors"
            >
              Hủy bỏ
            </button>
            {!isApproved && (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-5 py-2 rounded-xl text-xs font-black text-white bg-[#C0392B] hover:bg-[#383AB8] shadow-md shadow-[#C0392B]/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Đang lưu...</span>
                  </>
                ) : (
                  "Lưu thay đổi"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
