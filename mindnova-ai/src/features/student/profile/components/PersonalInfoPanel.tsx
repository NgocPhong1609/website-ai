"use client";

import { useState, useEffect } from "react";
import { useUpdateProfile } from "../api";

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
      {required && <span className="text-[#EF4444] ml-1 font-normal">*</span>}
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
      className="w-full px-4 py-2.5 rounded-xl text-xs sm:text-sm font-normal text-[#1A1A2E] bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#5052EE] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#5052EE]/15 placeholder-[#989AAB] transition-all duration-200"
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
      alert(message);
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
      <div className="border-b border-[#EAEAF4] pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-semibold text-[#1A1A2E] tracking-normal">Thông tin Cá nhân</h2>
          <p className="text-xs sm:text-sm font-normal text-[#7878A0] mt-1 leading-relaxed">
            Cập nhật định danh cá nhân và địa chỉ email chính thức sử dụng cho lộ trình rèn luyện AI.
          </p>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-xl bg-[#F8FAFC] border border-[#EAEAF4] text-xs font-medium text-[#64647A]">
          <span className="w-2 h-2 rounded-full bg-[#10B981]" />
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
            className="w-full px-4 py-3 rounded-xl text-xs sm:text-sm font-normal text-[#1A1A2E] bg-[#F8FAFC] focus:bg-white border border-[#E4E6F0] focus:border-[#5052EE] shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#5052EE]/15 placeholder-[#989AAB] transition-all duration-200 resize-none leading-relaxed"
          />
        </div>

        {/* Action Buttons with soft soothing text and background */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleDiscard}
            disabled={!isDirty}
            className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-[#64647A] hover:text-[#1A1A2E] border border-[#EAEAF4] bg-white hover:bg-[#F4F5FB] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer shadow-2xs flex items-center justify-center gap-1.5"
          >
            <span>✕</span>
            <span>Hủy thay đổi</span>
          </button>
          
          <button
            type="button"
            onClick={handleSave}
            disabled={updateProfileMutation.isPending || !isDirty}
            className="px-6 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-[#5052EE] via-[#6063EE] to-[#0D9488] shadow-sm hover:opacity-95 active:scale-98 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              {saved ? (
                <polyline points="20 6 9 17 4 12" />
              ) : (
                <>
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </>
              )}
            </svg>
            <span>{updateProfileMutation.isPending ? "Đang lưu..." : saved ? "Đã cập nhật thành công!" : "Lưu thay đổi"}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
