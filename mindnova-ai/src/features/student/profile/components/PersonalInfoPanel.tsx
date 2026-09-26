"use client";

import { getErrorMessage } from "@/src/shared/lib/user-error";

import { useState, useEffect } from "react";
import { useUpdateProfile } from "../api";
import { Save, RefreshCcw } from "lucide-react";
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
      className="block text-sm font-medium text-[#1e293b] mb-1.5"
    >
      {children}
      {required && <span className="text-red-500 ml-1 font-normal">*</span>}
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
      className="w-full px-4 py-3 rounded-xl text-sm text-[#0f172a] bg-[#F8FAFC] border border-[#EAEAF4] focus:border-[#3b82f6] focus:bg-white focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all placeholder:text-[#94a3b8]"
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
      toast.success("Cập nhật thông tin cá nhân thành công!");
      setTimeout(() => setSaved(false), 2500);
    } catch (error: any) {
      console.error("Failed to save profile", error);
      const err = error?.response?.data;
      const message = getErrorMessage(err, "Không thể lưu thông tin hồ sơ. Vui lòng thử lại.");
      toast.error(message);
    }
  }

  function handleDiscard() {
    setFullName(initialName);
    setEmail(initialEmail);
    setBio(initialBio);
  }

  return (
    <div className="flex flex-col h-full">
      
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#0f172a] tracking-tight">Thông tin cá nhân</h2>
        <p className="text-[15px] font-medium text-[#64748b] mt-2">
          Cập nhật định danh cá nhân và địa chỉ email chính thức sử dụng cho lộ trình rèn luyện AI.
        </p>
      </div>

      {/* Form Grid */}
      <div className="flex flex-col gap-6 flex-1">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

        <div>
          <FormLabel htmlFor="profile-bio">Giới thiệu bản thân &amp; Định hướng chuyên sâu</FormLabel>
          <textarea
            id="profile-bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={5}
            placeholder="Hãy chia sẻ ngắn gọn về sở trường, năng lực kỹ thuật và những mục tiêu bạn muốn Trợ lý Nova đồng hành..."
            className="w-full px-4 py-3 rounded-xl text-sm text-[#0f172a] bg-[#F8FAFC] border border-[#EAEAF4] focus:border-[#3b82f6] focus:bg-white focus:ring-4 focus:ring-[#3b82f6]/10 outline-none transition-all resize-none placeholder:text-[#94a3b8] leading-relaxed"
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="mt-8 pt-6 border-t border-[#EAEAF4] flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={handleDiscard}
          disabled={!isDirty || updateProfileMutation.isPending}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-[#64748b] bg-white border border-[#EAEAF4] hover:bg-[#F8FAFC] hover:text-[#0f172a] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <RefreshCcw size={16} /> Khôi phục
        </button>
        
        <button
          type="button"
          onClick={handleSave}
          disabled={updateProfileMutation.isPending || !isDirty}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] hover:opacity-95 shadow-md shadow-blue-500/20 disabled:from-[#94a3b8] disabled:to-[#cbd5e1] disabled:shadow-none disabled:cursor-not-allowed transition-all flex items-center gap-2"
        >
          <Save size={16} /> 
          {updateProfileMutation.isPending ? "Đang lưu..." : saved ? "Đã lưu thành công" : "Lưu thay đổi"}
        </button>
      </div>
    </div>
  );
}
