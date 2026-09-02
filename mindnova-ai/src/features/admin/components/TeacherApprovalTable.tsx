"use client";

import React, { useMemo, useState } from "react";
import type { AdminTeacherApprovalRow, AdminTeacherCertificateItem } from "@/src/features/admin/types";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";
import { axiosClient } from "@/src/shared/lib/axios";

interface TeacherApprovalTableProps {
 rows: AdminTeacherApprovalRow[];
}

export function TeacherApprovalTable({ rows }: TeacherApprovalTableProps) {
 const [selectedRow, setSelectedRow] = useState<AdminTeacherApprovalRow | null>(null);
 const [localRows, setLocalRows] = useState<AdminTeacherApprovalRow[]>(rows);
 const [activeTab, setActiveTab] = useState<string>("all");
 const [isPendingAction, setIsPendingAction] = useState(false);
 const [reasonInput, setReasonInput] = useState("");
 const [showReasonModal, setShowReasonModal] = useState<{
 type: "reject_teacher" | "revoke_teacher" | "reject_cert";
 certId?: number;
 } | null>(null);

 const [evidenceViewer, setEvidenceViewer] = useState<{
 signedUrl: string;
 name: string;
 mime: string;
 } | null>(null);

 const ITEMS_PER_PAGE = 10;
 const [currentPage, setCurrentPage] = useState(1);

 const filteredRows = useMemo(() => {
 if (activeTab === "all") return localRows;
 return localRows.filter((r) => {
 const st = r.teacher_verification_status || r.status || "pending";
 if (activeTab === "verified") return r.is_verified || st === "approved";
 return st === activeTab;
 });
 }, [localRows, activeTab]);

 const totalPages = useMemo(() => {
 return Math.max(1, Math.ceil(filteredRows.length / ITEMS_PER_PAGE));
 }, [filteredRows]);

 const paginatedRows = useMemo(() => {
 const start = (currentPage - 1) * ITEMS_PER_PAGE;
 return filteredRows.slice(start, start + ITEMS_PER_PAGE);
 }, [filteredRows, currentPage]);

 const handleTabChange = (tabId: string) => {
 setActiveTab(tabId);
 setCurrentPage(1);
 };

 const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);
 const [actionError, setActionError] = useState("");

 const handleTeacherDecision = async (status: "approved" | "rejected" | "revoked", reason?: string) => {
 if (!selectedRow || isPendingAction) return;

 try {
 setIsPendingAction(true);
 setActionError("");

 if (status === "revoked") {
 const cleanReason = reason?.trim();
 if (!cleanReason) {
 setActionError("Vui lòng nhập lý do thu hồi tích xanh.");
 return;
 }
 await axiosClient.post(`/api/admin/teachers/${selectedRow.id}/revoke-verification`, {
 reason: cleanReason,
 });
 } else if (status === "rejected") {
 const cleanReason = reason?.trim();
 if (!cleanReason) {
 setActionError("Vui lòng nhập lý do từ chối xác minh.");
 return;
 }
 await axiosClient.patch(`/api/admin/teachers/${selectedRow.id}/verify`, {
 status: "rejected",
 reason: cleanReason,
 note: cleanReason,
 });
 } else {
 await axiosClient.patch(`/api/admin/teachers/${selectedRow.id}/verify`, {
 status: "approved",
 note: reason || "Đã thẩm định và cấp tích xanh thành công",
 });
 }

 // Update local state immediately
 setLocalRows((current) =>
 current.map((r) =>
 r.id === selectedRow.id
 ? {
 ...r,
 is_verified: status === "approved",
 teacher_verification_status: status,
 teacher_verification_note: reason?.trim() || r.teacher_verification_note,
 }
 : r
 )
 );

 setSelectedRow((prev) =>
 prev
 ? {
 ...prev,
 is_verified: status === "approved",
 teacher_verification_status: status,
 teacher_verification_note: reason?.trim() || prev.teacher_verification_note,
 }
 : null
 );

 setShowReasonModal(null);
 setShowApproveConfirmModal(false);
 setReasonInput("");
 } catch (err: any) {
 console.error("Failed teacher decision", err);
 const serverMsg = err.response?.data?.message || err.message || "Thao tác thất bại. Vui lòng thử lại.";
 setActionError(serverMsg);
 alert(`[LỖI]: ${serverMsg}`);
 } finally {
 setIsPendingAction(false);
 }
 };

 const handleCertDecision = async (certId: number, status: "approved" | "rejected", reason?: string) => {
 if (isPendingAction) return;

 try {
 setIsPendingAction(true);
 setActionError("");

 if (status === "approved") {
 await axiosClient.post(`/api/admin/certificates/${certId}/approve`);
 } else {
 const cleanReason = reason?.trim();
 if (!cleanReason) {
 setActionError("Vui lòng nhập lý do từ chối chứng chỉ.");
 return;
 }
 await axiosClient.post(`/api/admin/certificates/${certId}/reject`, { reason: cleanReason });
 }

 // Update local cert list
 if (selectedRow) {
 const updatedCerts = selectedRow.certificates.map((c) =>
 c.id === certId ? { ...c, verification_status: status, verification_note: reason?.trim() || null } : c
 );

 setSelectedRow({ ...selectedRow, certificates: updatedCerts });
 setLocalRows((current) =>
 current.map((r) => (r.id === selectedRow.id ? { ...r, certificates: updatedCerts } : r))
 );
 }

 setShowReasonModal(null);
 setReasonInput("");
 } catch (err: any) {
 console.error("Failed cert decision", err);
 const serverMsg = err.response?.data?.message || err.message || "Thao tác thất bại.";
 setActionError(serverMsg);
 alert(`[LỖI]: ${serverMsg}`);
 } finally {
 setIsPendingAction(false);
 }
 };

 const handleFetchEvidence = async (evidenceId: number) => {
 try {
 const res = await axiosClient.get(`/api/admin/certificates/evidence/${evidenceId}`);
 const data = res.data.data;
 if (data?.signed_url) {
 setEvidenceViewer({
 signedUrl: data.signed_url,
 name: data.original_name || "Tài liệu minh chứng",
 mime: data.mime_type || "application/octet-stream",
 });
 }
 } catch (err: any) {
 alert(err.response?.data?.message || "Không thể tải tài liệu minh chứng.");
 }
 };

 return (
 <div className="space-y-6">
 {/* Filter Tabs */}
 <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-slate-100 border border-slate-200">
 {[
 { id: "all", label: "Tất cả" },
 { id: "pending", label: "⏳ Chờ xét duyệt" },
 { id: "verified", label: " Đã cấp tích xanh" },
 { id: "rejected", label: " Từ chối" },
 { id: "revoked", label: " Đã thu hồi" },
 ].map((tab) => (
 <button
 key={tab.id}
 onClick={() => handleTabChange(tab.id)}
 className={`px-4 py-2 rounded-xl text-xs font-black transition-all ${
 activeTab === tab.id
 ? "bg-white text-slate-900 shadow-md border border-slate-200"
 : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/50"
 }`}
 >
 {tab.label}
 </button>
 ))}
 </div>

 {/* Main Table */}
 <section className="rounded-3xl border border-slate-200 bg-white shadow-sm overflow-hidden">
 <div className="overflow-x-auto">
 <table className="w-full min-w-[960px] text-left text-sm border-collapse">
 <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider">
 <tr>
 <th className="px-6 py-4 min-w-[240px]">Giáo viên</th>
 <th className="px-6 py-4 min-w-[150px] whitespace-nowrap">Chuyên môn</th>
 <th className="px-6 py-4 min-w-[180px] whitespace-nowrap">Số chứng chỉ</th>
 <th className="px-6 py-4 min-w-[150px] whitespace-nowrap">Trạng thái</th>
 <th className="px-6 py-4 min-w-[120px] whitespace-nowrap">Ngày nộp</th>
 <th className="px-6 py-4 min-w-[190px] text-right whitespace-nowrap">Hành động</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-slate-100">
 {paginatedRows.length > 0 ? (
 paginatedRows.map((row) => {
 const avatar = row.avatar_url || row.avatarUrl;
 const isVer = row.is_verified || row.teacher_verification_status === "approved";
 const statusLabel = isVer
 ? "Đã cấp tích xanh"
 : row.teacher_verification_status === "rejected"
 ? "Từ chối"
 : row.teacher_verification_status === "revoked"
 ? "Đã thu hồi"
 : "Chờ xét duyệt";

 const certCount = row.certificates?.length || 0;
 const approvedCerts = row.certificates?.filter((c) => c.verification_status === "approved").length || 0;

 return (
 <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
 <td className="px-6 py-4 min-w-[240px]">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 rounded-full bg-amber-50 text-[#C0392B] flex items-center justify-center font-black overflow-hidden border border-amber-100 shrink-0">
 {avatar ? (
 <img src={avatar} alt={row.name} className="w-full h-full object-cover" />
 ) : (
 row.name?.charAt(0).toUpperCase()
 )}
 </div>
 <div>
 <div className="flex items-center gap-1 font-bold text-slate-900">
 <span>{row.name}</span>
 <VerifiedTeacherBadge isVerified={isVer} size="xs" />
 </div>
 <div className="text-xs text-slate-500">{row.email}</div>
 </div>
 </div>
 </td>

 <td className="px-6 py-4 text-slate-600 font-semibold whitespace-nowrap min-w-[150px]">
 {row.profile?.skill_level || row.expertise || "Chưa cập nhật"}
 </td>

 <td className="px-6 py-4 font-semibold text-slate-700 whitespace-nowrap min-w-[180px]">
 <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold whitespace-nowrap inline-block">
 {certCount} bằng ({approvedCerts} đã duyệt)
 </span>
 </td>

 <td className="px-6 py-4 whitespace-nowrap min-w-[150px]">
 <span
 className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border whitespace-nowrap ${
 isVer
 ? "bg-emerald-50 text-emerald-700 border-emerald-200"
 : row.teacher_verification_status === "rejected"
 ? "bg-rose-50 text-rose-700 border-rose-200"
 : row.teacher_verification_status === "revoked"
 ? "bg-slate-100 text-slate-700 border-slate-300"
 : "bg-amber-50 text-amber-700 border-amber-200"
 }`}
 >
 {statusLabel}
 </span>
 </td>

 <td className="px-6 py-4 text-slate-500 text-xs font-semibold whitespace-nowrap min-w-[120px]">
 {row.verification_request?.submitted_at
 ? new Date(row.verification_request.submitted_at).toLocaleDateString("vi-VN")
 : row.submittedAt || "-"}
 </td>

 <td className="px-6 py-4 text-right whitespace-nowrap min-w-[190px]">
 <button
 type="button"
 onClick={() => setSelectedRow(row)}
 className="px-4 py-2 rounded-xl border border-rose-200 bg-rose-50/50 text-[#C0392B] text-xs font-black hover:bg-rose-100 transition-all shadow-xs whitespace-nowrap"
 >
 Xem hồ sơ & Thẩm định
 </button>
 </td>
 </tr>
 );
 })
 ) : (
 <tr>
 <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-semibold">
 Không có giáo viên nào phù hợp với bộ lọc.
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </section>

 {/* Detail Modal / Drawer */}
 {selectedRow && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm overflow-y-auto">
 <div className="relative w-full max-w-4xl rounded-[32px] border border-slate-200 bg-white shadow-2xl my-8 overflow-hidden">
 {/* Modal Header */}
 <div className="flex items-center justify-between border-b border-slate-200 px-8 py-5 bg-slate-50">
 <div className="flex items-center gap-3">
 <div className="w-12 h-12 rounded-full -[#FAF7F2] text-[#C0392B] font-black text-lg flex items-center justify-center overflow-hidden border -[#FAF7F2]">
 {selectedRow.avatar_url || selectedRow.avatarUrl ? (
 <img
 src={selectedRow.avatar_url || selectedRow.avatarUrl!}
 alt={selectedRow.name}
 className="w-full h-full object-cover"
 />
 ) : (
 selectedRow.name.charAt(0).toUpperCase()
 )}
 </div>
 <div>
 <div className="flex items-center gap-2">
 <h3 className="text-xl font-black text-slate-900">{selectedRow.name}</h3>
 <VerifiedTeacherBadge isVerified={selectedRow.is_verified} size="sm" />
 </div>
 <p className="text-xs text-slate-500 font-semibold">{selectedRow.email}</p>
 </div>
 </div>

 <button
 type="button"
 onClick={() => setSelectedRow(null)}
 className="w-9 h-9 rounded-full bg-white border border-slate-200 text-slate-500 hover:bg-slate-100 flex items-center justify-center font-bold"
 >
 
 </button>
 </div>

 {/* Modal Content Grid */}
 <div className="p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 max-h-[75vh] overflow-y-auto">
 {/* Left Column: Teacher Profile Info */}
 <div className="lg:col-span-1 space-y-5 border-r border-slate-100 pr-0 lg:pr-6">
 <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
 <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
 Trạng thái hiện tại
 </span>
 <div className="flex items-center gap-2">
 <span
 className={`px-3 py-1 rounded-full text-xs font-black border ${
 selectedRow.is_verified
 ? "bg-emerald-50 -[#2C3039] -[#FAF7F2]"
 : selectedRow.teacher_verification_status === "rejected"
 ? "bg-rose-50 text-rose-700 border-rose-200"
 : selectedRow.teacher_verification_status === "revoked"
 ? "bg-slate-200 text-slate-800 border-slate-300"
 : "bg-amber-50 text-amber-700 border-amber-200"
 }`}
 >
 {selectedRow.is_verified ? " Đã cấp tích xanh" : selectedRow.teacher_verification_status}
 </span>
 </div>
 {selectedRow.teacher_verification_note && (
 <p className="text-xs text-slate-600 italic pt-1">
 Ghi chú: "{selectedRow.teacher_verification_note}"
 </p>
 )}
 </div>

 <div className="space-y-3 text-xs">
 <div>
 <span className="font-extrabold uppercase text-slate-400">Chuyên môn</span>
 <p className="font-bold text-slate-900 mt-0.5">
 {selectedRow.profile?.skill_level || selectedRow.expertise || "Chưa cập nhật"}
 </p>
 </div>

 <div>
 <span className="font-extrabold uppercase text-slate-400">Kinh nghiệm</span>
 <p className="font-bold text-slate-900 mt-0.5">
 {selectedRow.profile?.learning_goal || selectedRow.experience || "Chưa cập nhật"}
 </p>
 </div>

 <div>
 <span className="font-extrabold uppercase text-slate-400">Số điện thoại</span>
 <p className="font-bold text-slate-900 mt-0.5">
 {selectedRow.profile?.phone || "Chưa có"}
 </p>
 </div>

 <div>
 <span className="font-extrabold uppercase text-slate-400">Địa chỉ</span>
 <p className="font-bold text-slate-900 mt-0.5">
 {selectedRow.profile?.address || "Chưa có"}
 </p>
 </div>

 <div>
 <span className="font-extrabold uppercase text-slate-400">Giới thiệu (Bio)</span>
 <p className="font-semibold text-slate-700 mt-0.5 leading-relaxed">
 {selectedRow.profile?.bio || "Chưa nhập giới thiệu."}
 </p>
 </div>
 </div>

 {/* Admin Actions for Verification Status */}
 <div className="pt-4 border-t border-slate-200 space-y-2">
 <span className="text-xs font-black uppercase text-slate-500 block mb-2">
 Quyết định Cấp / Thu hồi Tích Xanh
 </span>

 {!selectedRow.is_verified ? (
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => {
 setActionError("");
 setShowApproveConfirmModal(true);
 }}
 className="w-full py-3 rounded-xl -[#2C3039] hover:-[#2C3039] text-white text-xs font-black shadow-md transition-all flex items-center justify-center gap-1.5"
 >
 CẤP TÍCH XANH SỐ XÁC MINH
 </button>
 ) : (
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => {
 setActionError("");
 setShowReasonModal({ type: "revoke_teacher" });
 }}
 className="w-full py-3 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-black shadow-md transition-all"
 >
 THU HỒI TÍCH XANH
 </button>
 )}

 {!selectedRow.is_verified && (
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => {
 setActionError("");
 setShowReasonModal({ type: "reject_teacher" });
 }}
 className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-sm transition-all"
 >
 TỪ CHỐI YÊU CẦU XÁC MINH
 </button>
 )}
 </div>
 </div>

 {/* Right Column: Certificates & Private Evidence Documents */}
 <div className="lg:col-span-2 space-y-6">
 <div>
 <h4 className="text-base font-black text-slate-900">
 Bằng cấp & Minh chứng xác minh ({selectedRow.certificates?.length || 0})
 </h4>
 <p className="text-xs font-semibold text-slate-500">
 Admin có thể kiểm tra từng chứng chỉ, link xác minh và xem tài liệu công chứng riêng tư.
 </p>
 </div>

 {selectedRow.certificates?.length > 0 ? (
 <div className="space-y-4">
 {selectedRow.certificates.map((cert) => (
 <div
 key={cert.id}
 className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3"
 >
 <div className="flex items-start justify-between gap-3">
 <div>
 <h5 className="text-base font-extrabold text-slate-900">
 {cert.certificate_name}
 </h5>
 <p className="text-xs font-semibold text-slate-500">
 Đơn vị cấp: {cert.issuing_organization || "Chưa nhập"}
 </p>
 </div>
 <span
 className={`px-3 py-1 rounded-full text-xs font-black border ${
 cert.verification_status === "approved"
 ? "bg-emerald-50 -[#2C3039] -[#FAF7F2]"
 : cert.verification_status === "rejected"
 ? "bg-rose-50 text-rose-700 border-rose-200"
 : "bg-amber-50 text-amber-700 border-amber-200"
 }`}
 >
 {cert.verification_status === "approved" ? " Đã duyệt" : cert.verification_status}
 </span>
 </div>

 <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white p-3 rounded-xl border border-slate-100">
 <div><span className="font-bold text-slate-400">Số VB:</span> {cert.certificate_number || "-"}</div>
 <div><span className="font-bold text-slate-400">Chuyên môn:</span> {cert.specialization || "-"}</div>
 <div><span className="font-bold text-slate-400">Ngày cấp:</span> {cert.issue_date || "-"}</div>
 <div><span className="font-bold text-slate-400">Ngày hết hạn:</span> {cert.expiry_date || "Vĩnh viễn"}</div>
 </div>

 {/* Public Certificate Image */}
 {cert.certificate_image && (
 <div>
 <span className="text-[11px] font-black uppercase text-slate-400 block mb-1">
 Ảnh bằng cấp public:
 </span>
 <a
 href={cert.certificate_image}
 target="_blank"
 rel="noreferrer"
 className="inline-block rounded-xl overflow-hidden border border-slate-200 max-h-36 bg-slate-100"
 >
 <img
 src={cert.certificate_image}
 alt={cert.certificate_name}
 className="max-h-36 object-contain"
 />
 </a>
 </div>
 )}

 {/* Verification Official Link */}
 {cert.verification_url && (
 <div>
 <a
 href={cert.verification_url}
 target="_blank"
 rel="noreferrer"
 className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 text-[#C0392B] border -[#FAF7F2] text-xs font-bold hover:underline"
 >
 Mở trang xác minh chính thức ↗
 </a>
 </div>
 )}

 {/* Private Evidence Documents */}
 {cert.evidences && cert.evidences.length > 0 && (
 <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
 <span className="text-xs font-extrabold text-amber-900 block">
 Tài liệu minh chứng riêng tư (Chỉ Admin xem được):
 </span>
 <div className="space-y-1.5">
 {cert.evidences.map((ev) => (
 <div
 key={ev.id}
 className="flex items-center justify-between p-2 rounded-lg bg-white border border-amber-100 text-xs"
 >
 <span className="font-semibold text-slate-800 truncate max-w-xs">
 {ev.original_name || `Minh chứng #${ev.id}`}
 </span>
 <button
 type="button"
 onClick={() => handleFetchEvidence(ev.id)}
 className="px-3 py-1 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-bold text-[11px] shadow-xs"
 >
 Xem minh chứng 
 </button>
 </div>
 ))}
 </div>
 </div>
 )}

 {/* Cert Approve / Reject Buttons */}
 <div className="flex items-center gap-2 pt-2 border-t border-slate-200/50">
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => handleCertDecision(cert.id, "approved")}
 className="px-4 py-2 rounded-xl -[#2C3039] hover:-[#2C3039] text-white text-xs font-black shadow-xs transition-all"
 >
 Duyệt chứng chỉ này
 </button>
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => {
 setActionError("");
 setShowReasonModal({ type: "reject_cert", certId: cert.id });
 }}
 className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-black shadow-xs transition-all"
 >
 Từ chối chứng chỉ
 </button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="p-8 rounded-2xl border border-dashed border-slate-300 text-center text-slate-400 font-semibold">
 Giáo viên này chưa thêm chứng chỉ nào.
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 )}

 {/* Approval Confirmation Modal */}
 {showApproveConfirmModal && selectedRow && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
 <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200">
 
 <div>
 <h3 className="text-lg font-black text-slate-900">Xác nhận cấp tích xanh</h3>
 <p className="text-xs font-semibold text-slate-600 mt-1 leading-relaxed">
 Bạn có chắc chắn muốn cấp tích xanh xác minh cho giáo viên <strong className="text-slate-900">{selectedRow.name}</strong>?
 </p>
 <p className="text-[11px] font-medium text-slate-500 mt-2 bg-emerald-50 p-2.5 rounded-xl border -[#FAF7F2] leading-relaxed">
 Sau khi xác nhận, giáo viên sẽ được hiển thị trạng thái đã xác minh trên toàn hệ thống MindNova AI.
 </p>
 </div>

 {actionError && (
 <div className="p-2.5 rounded-xl bg-red-50 text-xs font-bold text-red-700">
 ️ {actionError}
 </div>
 )}

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => {
 setShowApproveConfirmModal(false);
 setActionError("");
 }}
 className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
 >
 Hủy
 </button>
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => handleTeacherDecision("approved")}
 className="px-5 py-2 rounded-xl text-xs font-black text-white -[#2C3039] hover:-[#2C3039] shadow-md shadow-emerald-600/30 transition-all disabled:opacity-50 flex items-center gap-1.5"
 >
 {isPendingAction ? (
 <>
 <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 <span>Đang xử lý...</span>
 </>
 ) : (
 "Xác nhận cấp tích xanh "
 )}
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Reason Input Modal */}
 {showReasonModal && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
 <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 animate-in fade-in zoom-in duration-200">
 <h3 className="text-lg font-black text-slate-900">
 {showReasonModal.type === "revoke_teacher"
 ? "Thu hồi tích xanh xác minh"
 : showReasonModal.type === "reject_teacher"
 ? "Từ chối xác minh giáo viên"
 : "Từ chối chứng chỉ"}
 </h3>

 <p className="text-xs font-semibold text-slate-500">
 Bắt buộc nhập lý do chi tiết để gửi thông báo cho giáo viên.
 </p>

 {actionError && (
 <div className="p-2.5 rounded-xl bg-red-50 text-xs font-bold text-red-700">
 ️ {actionError}
 </div>
 )}

 <textarea
 rows={3}
 required
 placeholder="Nhập lý do chi tiết..."
 value={reasonInput}
 onChange={(e) => {
 setReasonInput(e.target.value);
 if (actionError) setActionError("");
 }}
 className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-900 bg-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500"
 />

 <div className="flex items-center justify-end gap-3 pt-2">
 <button
 type="button"
 disabled={isPendingAction}
 onClick={() => {
 setShowReasonModal(null);
 setReasonInput("");
 setActionError("");
 }}
 className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
 >
 Hủy
 </button>
 <button
 type="button"
 disabled={!reasonInput.trim() || isPendingAction}
 onClick={() => {
 if (!reasonInput.trim()) {
 setActionError("Vui lòng nhập lý do.");
 return;
 }
 if (showReasonModal.type === "revoke_teacher") {
 handleTeacherDecision("revoked", reasonInput);
 } else if (showReasonModal.type === "reject_teacher") {
 handleTeacherDecision("rejected", reasonInput);
 } else if (showReasonModal.type === "reject_cert" && showReasonModal.certId) {
 handleCertDecision(showReasonModal.certId, "rejected", reasonInput);
 }
 }}
 className="px-5 py-2 rounded-xl text-xs font-black text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 shadow-md shadow-rose-600/30 transition-all flex items-center gap-1.5"
 >
 {isPendingAction ? (
 <>
 <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
 <span>Đang xử lý...</span>
 </>
 ) : (
 "Xác nhận từ chối"
 )}
 </button>
 </div>
 </div>
 </div>
 )}

 {/* Private Evidence Secure Viewer Modal */}
 {evidenceViewer && (
 <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-md">
 <div className="w-full max-w-3xl rounded-3xl bg-white p-6 shadow-2xl border border-slate-100 space-y-4 max-h-[90vh] flex flex-col">
 <div className="flex items-center justify-between border-b border-slate-100 pb-3">
 <h4 className="text-base font-black text-slate-900">
 Minh chứng riêng tư: {evidenceViewer.name}
 </h4>
 <button
 onClick={() => setEvidenceViewer(null)}
 className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center font-bold"
 >
 
 </button>
 </div>

 <div className="flex-1 overflow-auto rounded-2xl bg-slate-100 p-2 min-h-[350px] flex items-center justify-center">
 {evidenceViewer.mime.includes("pdf") ? (
 <iframe src={evidenceViewer.signedUrl} className="w-full h-[500px] rounded-xl" />
 ) : (
 <img
 src={evidenceViewer.signedUrl}
 alt={evidenceViewer.name}
 className="max-h-[500px] object-contain rounded-xl"
 />
 )}
 </div>

 <div className="flex justify-end">
 <button
 onClick={() => setEvidenceViewer(null)}
 className="px-5 py-2 rounded-xl text-xs font-black bg-slate-800 text-white hover:bg-slate-900"
 >
 Đóng
 </button>
 </div>
 </div>
 </div>
 )}
 </div>
 );
}
