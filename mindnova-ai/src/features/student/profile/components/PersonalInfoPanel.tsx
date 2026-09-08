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
 className="block text-xs sm:text-sm font-medium text-muted-foreground mb-1.5"
 >
 {children}
 {required && <span className="text-primary ml-1 font-normal">*</span>}
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
 className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-foreground bg-transparent border border-border/60 focus:border-primary focus:bg-primary/5 focus:outline-none transition-all duration-200"
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
 <div className="pb-2 flex items-center justify-between">
 <div>
 <h2 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Thông tin Cá nhân</h2>
 <p className="text-xs sm:text-sm font-normal text-muted-foreground mt-1.5 leading-relaxed">
 Cập nhật định danh cá nhân và địa chỉ email chính thức sử dụng cho lộ trình rèn luyện AI.
 </p>
 </div>

 <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-success">
 <span className="relative flex h-2 w-2">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
 <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
 </span>
 <span>Hoạt động</span>
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
 className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-normal text-foreground bg-transparent border border-border/60 focus:border-primary focus:bg-primary/5 focus:outline-none transition-all duration-200 resize-none leading-relaxed"
 />
 </div>

 {/* Action Buttons */}
 <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4">
 <button
 type="button"
 onClick={handleDiscard}
 disabled={!isDirty}
 className="px-6 py-2.5 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer flex items-center justify-center"
 >
 Hủy thay đổi
 </button>
 
 <button
 type="button"
 onClick={handleSave}
 disabled={updateProfileMutation.isPending || !isDirty}
 className="px-8 py-2.5 rounded-full text-sm font-medium text-primary-foreground bg-primary hover:opacity-90 active:scale-95 transition-all duration-200 cursor-pointer flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed"
 >
 {updateProfileMutation.isPending ? "Đang lưu..." : saved ? "Đã cập nhật thành công!" : "Lưu thay đổi"}
 </button>
 </div>
 </div>
 </div>
 );
}
