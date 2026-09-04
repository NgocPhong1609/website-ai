"use client";

import { useState, useEffect } from "react";
import { useUpdateProfile } from "../api";
import toast from "react-hot-toast";

interface PersonalInfoPanelProps {
 fullName: string;
 email: string;
 bio: string;
 completionPercent?: number;
}

function FormLabel({ htmlFor, children, required = false }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
 return (
 <label
 htmlFor={htmlFor}
 className="block text-xs sm:text-sm font-medium text-[#4A4A68] mb-1.5"
 >
 {children}
 {required && <span className="text-[#C0392B] ml-1 font-normal">*</span>}
 </label>
 );
}

function FormInput({
 id,
 value,
 onChange,
 type = "text",
 placeholder,
}: {
 id: string;
 value: string;
 onChange: (v: string) => void;
 type?: string;
 placeholder?: string;
}) {
 return (
 <input
 id={id}
 type={type}
 value={value}
 onChange={(e) => onChange(e.target.value)}
 placeholder={placeholder}
 className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-[#2C3039] bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#C0392B] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C0392B]/15 placeholder-[#989AAB] transition-all duration-200"
 />
 );
}

export function PersonalInfoPanel({
 fullName: initialName,
 email: initialEmail,
 bio: initialBio,
}: PersonalInfoPanelProps) {
 const [fullName, setFullName] = useState(initialName);
 const [email, setEmail] = useState(initialEmail);
 const [bio, setBio] = useState(initialBio);
 const [saved, setSaved] = useState(false);
 const updateProfileMutation = useUpdateProfile();

 useEffect(() => {
 setFullName(initialName);
 setEmail(initialEmail);
 setBio(initialBio);
 }, [initialName, initialEmail, initialBio]);

 const isDirty =
 fullName !== initialName || email !== initialEmail || bio !== initialBio;

 async function handleSave() {
 try {
 await updateProfileMutation.mutateAsync({
 fullName,
 email,
 bio,
 });

 setSaved(true);
 setTimeout(() => setSaved(false), 2500);
 } catch (error: any) {
 console.error("Failed to save profile", error);
 const err = error?.response?.data;
 const message = err?.message || (err?.errors ? Object.values(err.errors).flat().join(', ') : null) || "Không thể lưu thông tin hồ sơ. Vui lòng thử lại.";
 toast(message);
 }
 }

 function handleDiscard() {
 setFullName(initialName);
 setEmail(initialEmail);
 setBio(initialBio);
 }

 return (
 <div className="flex flex-col gap-6">
 {/* Panel Header */}
 <div className="border-b border-[#E8E2D9] pb-4 flex items-center justify-between">
 <div>
 <h2 className="text-base sm:text-lg font-semibold text-[#2C3039] tracking-normal">Thông tin Cá nhân</h2>
 <p className="text-xs sm:text-sm font-normal text-[#8A8478] mt-1 leading-relaxed">
 Cập nhật định danh cá nhân và địa chỉ email chính thức sử dụng cho lộ trình rèn luyện AI.
 </p>
 </div>

 <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#E8E2D9] text-xs font-medium text-[#8A8478]">
 <span className="w-2 h-2 rounded-full bg-[#2C3039]" />
 <span>Trạng thái: Hoạt động</span>
 </div>
 </div>

 {/* Form Area */}
 <div className="flex flex-col gap-5">
 {/* Name + Email Row */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
 <div>
 <FormLabel htmlFor="profile-fullname" required>Họ và Tên đầy đủ</FormLabel>
 <FormInput
 id="profile-fullname"
 value={fullName}
 onChange={setFullName}
 placeholder="Nhập họ và tên của bạn..."
 />
 </div>
 <div>
 <FormLabel htmlFor="profile-email" required>Địa chỉ Email liên hệ</FormLabel>
 <FormInput
 id="profile-email"
 value={email}
 onChange={setEmail}
 type="email"
 placeholder="nhaptentailhoan@email.com"
 />
 </div>
 </div>

 {/* Bio */}
 <div>
 <FormLabel htmlFor="profile-bio">Giới thiệu bản thân &amp; Định hướng chuyên sâu</FormLabel>
 <textarea
 id="profile-bio"
 value={bio}
 onChange={(e) => setBio(e.target.value)}
 rows={4}
 placeholder="Hãy chia sẻ ngắn gọn về sở trường, năng lực kỹ thuật và những mục tiêu bạn muốn Trợ lý Nova đồng hành..."
 className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-normal text-[#2C3039] bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#C0392B] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#C0392B]/15 placeholder-[#989AAB] transition-all duration-200 resize-none leading-relaxed"
 />
 </div>

 {/* Action Buttons with soft soothing text and background */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
 <button
 type="button"
 onClick={handleDiscard}
 disabled={!isDirty}
 className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#8A8478] hover:text-[#2C3039] border border-[#E8E2D9] bg-white hover:bg-[#F4F5FB] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
 >
 <span></span>
 <span>Hủy thay đổi</span>
 </button>
 
 <button
 type="button"
 onClick={handleSave}
 disabled={updateProfileMutation.isPending || !isDirty}
 className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-[#C0392B] shadow-sm hover:opacity-95 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
 >
 <></>
 <span>{updateProfileMutation.isPending ? "Đang lưu..." : saved ? "Đã cập nhật thành công!" : "Lưu thay đổi"}</span>
 </button>
 </div>
 </div>
 </div>
 );
}
