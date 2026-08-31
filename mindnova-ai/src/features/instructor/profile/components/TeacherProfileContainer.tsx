"use client";

import React, { useEffect, useState } from "react";
import { axiosClient } from "@/src/shared/lib/axios";
import { VerifiedTeacherBadge } from "@/src/shared/components/VerifiedTeacherBadge";
import { VerificationRequestModal } from "./VerificationRequestModal";
import { writeStoredUser } from "@/src/shared/lib/userStorage";

export function TeacherProfileContainer() {
 const [profileData, setProfileData] = useState<any>(null);
 const [isLoading, setIsLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
 const [msg, setMsg] = useState({ type: "", text: "" });

 const [isModalOpen, setIsModalOpen] = useState(false);

 const [form, setForm] = useState({
 name: "",
 bio: "",
 phone: "",
 address: "",
 expertise: "",
 experience: "",
 });

 const fetchProfile = async () => {
 try {
 setIsLoading(true);
 const res = await axiosClient.get("/api/instructor/profile");
 const data = res.data.data;
 setProfileData(data);

 setForm({
 name: data.name || "",
 bio: data.profile?.bio || "",
 phone: data.profile?.phone || "",
 address: data.profile?.address || "",
 expertise: data.profile?.skill_level || "",
 experience: data.profile?.learning_goal || "",
 });

 if (data) {
 writeStoredUser({
 id: data.id,
 name: data.name,
 avatar_url: data.avatar_url,
 avatar: data.avatar_url,
 is_verified: data.is_verified,
 } as any);
 }
 } catch (error) {
 console.error("Failed to load teacher profile", error);
 } finally {
 setIsLoading(false);
 }
 };

 useEffect(() => {
 fetchProfile();
 }, []);

 const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
 if (!e.target.files?.[0]) return;
 const file = e.target.files[0];

 try {
 setIsUploadingAvatar(true);
 setMsg({ type: "", text: "" });

 const body = new FormData();
 body.append("avatar", file);

 const res = await axiosClient.post("/api/instructor/avatar", body, {
 headers: { "Content-Type": "multipart/form-data" },
 });

 if (res.data?.data?.avatar_url) {
 writeStoredUser({
 avatar_url: res.data.data.avatar_url,
 avatar: res.data.data.avatar_url,
 });
 }

 setMsg({ type: "success", text: "Cập nhật ảnh đại diện thành công!" });
 fetchProfile();
 } catch (err: any) {
 console.error("Avatar upload error", err);
 setMsg({ type: "error", text: err.response?.data?.message || "Không thể tải lên ảnh đại diện." });
 } finally {
 setIsUploadingAvatar(false);
 }
 };

 const handleProfileSave = async (e: React.FormEvent) => {
 e.preventDefault();
 try {
 setIsSaving(true);
 setMsg({ type: "", text: "" });

 await axiosClient.put("/api/instructor/profile", form);

 setMsg({ type: "success", text: "Cập nhật hồ sơ cá nhân thành công!" });
 fetchProfile();
 } catch (err: any) {
 console.error("Profile save error", err);
 setMsg({ type: "error", text: err.response?.data?.message || "Không thể lưu thông tin." });
 } finally {
 setIsSaving(false);
 }
 };

 const handleDeleteCert = async (certId: number) => {
 if (!window.confirm("Bạn có chắc chắn muốn xóa bằng cấp này?")) return;
 try {
 await axiosClient.delete(`/api/instructor/certificates/${certId}`);
 fetchProfile();
 } catch (err: any) {
 alert("Xóa bằng cấp thất bại.");
 }
 };

 if (isLoading) {
 return (
 <div className="flex items-center justify-center min-h-[400px] text-[#8A8478] font-semibold">
 Đang tải thông tin hồ sơ giáo viên...
 </div>
 );
 }

 const isVerified = Boolean(profileData?.is_verified);
 const status = profileData?.teacher_verification_status || "none";
 const requestInfo = profileData?.verification_request;

 return (
 <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-8">
 {/* Header Profile Banner */}
 <div className="relative rounded-3xl border border-[#E8E2D9]/80 bg-white p-6 md:p-8 shadow-sm overflow-hidden">
 <div className="absolute top-0 right-0 w-64 h-64 bg-[#C0392B] -[#C0392B]/5 rounded-full blur-3xl -z-0 pointer-events-none" />

 <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
 {/* Avatar Upload */}
 <div className="relative group">
 <div className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-100 flex items-center justify-center text-3xl font-black text-[#C0392B]">
 {profileData?.avatar_url ? (
 <img
 src={profileData.avatar_url}
 alt={profileData.name}
 className="w-full h-full object-cover"
 />
 ) : (
 profileData?.name?.charAt(0).toUpperCase()
 )}
 </div>

 <label className="absolute inset-0 rounded-full bg-black/40 text-white flex flex-col items-center justify-center text-[10px] font-bold opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
 <span> Thay ảnh</span>
 <input
 type="file"
 accept="image/jpeg,image/png,image/webp"
 className="hidden"
 onChange={handleAvatarChange}
 disabled={isUploadingAvatar}
 />
 </label>
 </div>

 {/* Teacher Basic Details */}
 <div className="flex-1 text-center md:text-left space-y-2">
 <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
 <h1 className="text-2xl md:text-3xl font-black text-[#2C3039]">
 {profileData?.name}
 </h1>
 <VerifiedTeacherBadge isVerified={isVerified} size="md" />
 </div>

 <p className="text-sm font-semibold text-[#8A8478]">{profileData?.email}</p>

 <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
 <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-[#C0392B] border -[#FAF7F2] uppercase tracking-wide">
 ‍ Giảng viên
 </span>
 <span
 className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide ${
 isVerified
 ? "bg-emerald-50 -[#2C3039] -[#FAF7F2]"
 : status === "pending"
 ? "bg-amber-50 text-amber-700 border-amber-200"
 : status === "rejected"
 ? "bg-rose-50 text-rose-700 border-rose-200"
 : "bg-gray-100 text-[#8A8478] border-[#E8E2D9]"
 }`}
 >
 {isVerified
 ? " Đã xác minh tích xanh"
 : status === "pending"
 ? " Đang chờ duyệt"
 : status === "rejected"
 ? " Bị từ chối"
 : "Chưa xác minh"}
 </span>
 </div>
 </div>
 </div>
 </div>

 {/* Notification Toast Message */}
 {msg.text && (
 <div
 className={`p-4 rounded-2xl border text-sm font-bold ${
 msg.type === "success"
 ? "bg-emerald-50 -[#2C3039] -[#FAF7F2]"
 : "bg-rose-50 text-rose-800 border-rose-200"
 }`}
 >
 {msg.text}
 </div>
 )}

 {/* 2-Column Grid */}
 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
 {/* Left Column: Verification Card & Certificates */}
 <div className="lg:col-span-1 space-y-6">
 {/* Card: Verification Status */}
 <div className="rounded-3xl border border-[#E8E2D9] bg-white p-6 shadow-sm space-y-4">
 <div className="flex items-center gap-2">
 
 <h2 className="text-base font-black text-[#2C3039]">Xác minh chuyên môn</h2>
 </div>

 {isVerified ? (
 <div className="p-4 rounded-2xl bg-emerald-50/70 border -[#FAF7F2] space-y-2">
 <div className="flex items-center gap-2 -[#2C3039] font-black text-sm">
 <VerifiedTeacherBadge isVerified={true} size="sm" showTooltip={false} />
 <span>Đã được MindNova xác minh</span>
 </div>
 <p className="text-xs -[#2C3039] font-semibold leading-relaxed">
 Tài khoản của bạn đã được xác minh bằng cấp và chuyên môn chính thức bởi Ban quản trị. Tích xanh được hiển thị công khai trên toàn hệ thống.
 </p>
 {profileData?.teacher_verified_at && (
 <p className="text-[11px] -[#2C3039] font-bold pt-1">
 Cấp ngày: {new Date(profileData.teacher_verified_at).toLocaleDateString("vi-VN")}
 </p>
 )}
 </div>
 ) : status === "pending" ? (
 <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2">
 <div className="flex items-center gap-2 text-amber-800 font-black text-sm">
 <span> Đang chờ xét duyệt</span>
 </div>
 <p className="text-xs text-amber-700 font-semibold leading-relaxed">
 Hồ sơ và bằng cấp của bạn đang được Ban quản trị MindNova AI kiểm tra. Kết quả sẽ được cập nhật sớm nhất.
 </p>
 <button
 disabled
 className="w-full py-2.5 rounded-xl bg-amber-200 text-amber-900 font-bold text-xs cursor-not-allowed opacity-75"
 >
 Đang chờ xét duyệt...
 </button>
 </div>
 ) : status === "rejected" || status === "revoked" ? (
 <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-3">
 <div className="flex items-center gap-2 text-rose-800 font-black text-sm">
 <span> Yêu cầu chưa được chấp thuận</span>
 </div>
 <p className="text-xs text-rose-700 font-semibold leading-relaxed">
 Lý do: {profileData?.teacher_verification_note || requestInfo?.rejection_reason || "Hồ sơ chưa đủ minh chứng hợp lệ."}
 </p>
 <button
 onClick={() => setIsModalOpen(true)}
 className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-sm transition-all"
 >
 Cập nhật hồ sơ & nộp lại 
 </button>
 </div>
 ) : (
 <div className="p-4 rounded-2xl bg-indigo-50/50 border -[#FAF7F2] space-y-3">
 <p className="text-xs text-[#8A8478] font-semibold leading-relaxed">
 Tài khoản của bạn chưa được xác minh. Nộp bằng cấp/chứng chỉ để Admin kiểm tra và cấp tích xanh xác minh uy tín.
 </p>
 <button
 onClick={() => setIsModalOpen(true)}
 className="w-full py-2.5 rounded-xl bg-[#C0392B] hover:bg-[#383AB8] text-white font-black text-xs shadow-md shadow-[#C0392B]/20 transition-all"
 >
 Yêu cầu cấp tích xanh 
 </button>
 </div>
 )}
 </div>

 {/* Card: Certificate List */}
 <div className="rounded-3xl border border-[#E8E2D9] bg-white p-6 shadow-sm space-y-4">
 <div className="flex items-center justify-between">
 <h2 className="text-base font-black text-[#2C3039]">Bằng cấp & Chứng chỉ</h2>
 <button
 onClick={() => setIsModalOpen(true)}
 className="text-xs font-black text-[#C0392B] hover:underline"
 >
 + Thêm bằng cấp
 </button>
 </div>

 {profileData?.certificates?.length > 0 ? (
 <div className="space-y-3">
 {profileData.certificates.map((cert: any) => (
 <div
 key={cert.id}
 className="p-3.5 rounded-2xl border border-gray-100 bg-[#FEFCF9]/60 space-y-2 relative group"
 >
 <div className="flex items-start justify-between gap-2">
 <div>
 <h4 className="text-sm font-extrabold text-[#2C3039]">{cert.certificate_name}</h4>
 <p className="text-xs font-semibold text-[#8A8478]">
 {cert.issuing_organization || "Đơn vị chưa cập nhật"}
 </p>
 </div>
 <span
 className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
 cert.verification_status === "approved"
 ? "bg-emerald-50 -[#2C3039] -[#FAF7F2]"
 : cert.verification_status === "rejected"
 ? "bg-rose-50 text-rose-700 border-rose-200"
 : "bg-amber-50 text-amber-700 border-amber-200"
 }`}
 >
 {cert.verification_status === "approved"
 ? "Đã duyệt"
 : cert.verification_status === "rejected"
 ? "Từ chối"
 : "Chờ duyệt"}
 </span>
 </div>

 {cert.certificate_image && (
 <a
 href={cert.certificate_image}
 target="_blank"
 rel="noreferrer"
 className="block mt-2 rounded-xl overflow-hidden border border-[#E8E2D9] h-24 bg-gray-100"
 >
 <img
 src={cert.certificate_image}
 alt={cert.certificate_name}
 className="w-full h-full object-cover"
 />
 </a>
 )}

 {cert.verification_url && (
 <a
 href={cert.verification_url}
 target="_blank"
 rel="noreferrer"
 className="inline-block text-[11px] font-bold text-[#C0392B] hover:underline"
 >
 Link xác minh chính thức 
 </a>
 )}

 <div className="flex items-center justify-between pt-1 border-t border-[#E8E2D9]/50 text-[11px] text-gray-400">
 <span>{cert.is_public ? " Hiển thị Public" : " Riêng tư"}</span>
 <div className="flex items-center gap-3">
 <button
 onClick={() => {
   const newName = prompt("Nhập tên bằng cấp mới:", cert.certificate_name);
   if (!newName || !newName.trim()) return;
   const newOrg = prompt("Tổ chức cấp:", cert.issuing_organization || "") || "";
   const newUrl = prompt("Link xác minh (nếu có):", cert.verification_url || "") || "";
   axiosClient.put(`/api/instructor/certificates/${cert.id}`, {
     certificate_name: newName,
     issuing_organization: newOrg,
     verification_url: newUrl,
   }).then(() => fetchProfile()).catch(() => alert("Cập nhật thất bại."));
 }}
 className="text-[#C0392B] hover:underline font-bold"
 >
 Sửa
 </button>
 <button
 onClick={() => handleDeleteCert(cert.id)}
 className="text-rose-600 hover:underline font-bold"
 >
 Xóa
 </button>
 </div>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-xs text-gray-400 italic">Chưa có bằng cấp nào được thêm.</p>
 )}
 </div>
 </div>

 {/* Right Column: Edit Profile Form & Courses */}
 <div className="lg:col-span-2 space-y-6">
 {/* Edit Profile Form */}
 <div className="rounded-3xl border border-[#E8E2D9] bg-white p-6 md:p-8 shadow-sm space-y-6">
 <div className="border-b border-gray-100 pb-4">
 <h2 className="text-lg font-black text-[#2C3039]">Chỉnh sửa thông tin cá nhân</h2>
 <p className="text-xs font-semibold text-[#8A8478]">
 Thông tin được hiển thị cho học viên trên trang cá nhân của bạn.
 </p>
 </div>

 <form onSubmit={handleProfileSave} className="space-y-4">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
 Họ và Tên
 </label>
 <input
 type="text"
 required
 value={form.name}
 onChange={(e) => setForm({ ...form, name: e.target.value })}
 className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
 />
 </div>

 <div>
 <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
 Số điện thoại
 </label>
 <input
 type="text"
 value={form.phone}
 onChange={(e) => setForm({ ...form, phone: e.target.value })}
 className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
 />
 </div>
 </div>

 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
 <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
 Chuyên môn chính
 </label>
 <input
 type="text"
 placeholder="VD: Lập trình Fullstack, AI, IELTS..."
 value={form.expertise}
 onChange={(e) => setForm({ ...form, expertise: e.target.value })}
 className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
 />
 </div>

 <div>
 <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
 Kinh nghiệm làm việc
 </label>
 <input
 type="text"
 placeholder="VD: 5+ năm giảng dạy tại ĐH Bách Khoa"
 value={form.experience}
 onChange={(e) => setForm({ ...form, experience: e.target.value })}
 className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
 Địa chỉ
 </label>
 <input
 type="text"
 value={form.address}
 onChange={(e) => setForm({ ...form, address: e.target.value })}
 className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
 />
 </div>

 <div>
 <label className="block text-xs font-extrabold uppercase text-gray-700 mb-1">
 Giới thiệu ngắn (Bio)
 </label>
 <textarea
 rows={4}
 placeholder="Giới thiệu bản thân, phong cách giảng dạy và định hướng học tập cho học viên..."
 value={form.bio}
 onChange={(e) => setForm({ ...form, bio: e.target.value })}
 className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8E2D9] text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-[#C0392B]"
 />
 </div>

 <div className="flex justify-end pt-2">
 <button
 type="submit"
 disabled={isSaving}
 className="px-6 py-2.5 rounded-xl text-xs font-black text-white bg-[#C0392B] hover:bg-[#383AB8] shadow-md shadow-[#C0392B]/30 transition-all disabled:opacity-50"
 >
 {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
 </button>
 </div>
 </form>
 </div>

 {/* Teacher's Courses */}
 <div className="rounded-3xl border border-[#E8E2D9] bg-white p-6 md:p-8 shadow-sm space-y-4">
 <h2 className="text-lg font-black text-[#2C3039]">Danh sách Khóa học giảng dạy</h2>
 {profileData?.courses?.length > 0 ? (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 {profileData.courses.map((course: any) => (
 <div
 key={course.id}
 className="p-4 rounded-2xl border border-gray-100 bg-[#FEFCF9] flex items-center gap-3"
 >
 <div className="w-14 h-14 rounded-xl bg-gray-200 shrink-0 overflow-hidden">
 {course.thumbnail && (
 <img
 src={course.thumbnail}
 alt={course.title}
 className="w-full h-full object-cover"
 />
 )}
 </div>
 <div className="min-w-0 flex-1">
 <h4 className="text-sm font-extrabold text-[#2C3039] truncate">
 {course.title}
 </h4>
 <span className="text-[10px] font-bold uppercase text-[#C0392B]">
 {course.status}
 </span>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <p className="text-xs text-gray-400 italic">Chưa có khóa học nào.</p>
 )}
 </div>
 </div>
 </div>

 {/* Verification Modal */}
 <VerificationRequestModal
 isOpen={isModalOpen}
 onClose={() => setIsModalOpen(false)}
 onSuccess={fetchProfile}
 />
 </div>
 );
}
